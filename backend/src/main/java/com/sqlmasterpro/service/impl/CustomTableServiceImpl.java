package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.BadRequestException;
import com.sqlmasterpro.model.dto.response.CustomTableResponse;
import com.sqlmasterpro.model.entity.CustomUserTable;
import com.sqlmasterpro.repository.CustomUserTableRepository;
import com.sqlmasterpro.service.CustomTableService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomTableServiceImpl implements CustomTableService {

    private final DataSource dataSource;
    private final CustomUserTableRepository customUserTableRepository;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;
    private static final int MAX_ROWS = 5000;
    private static final int MAX_COLUMNS = 50;
    private static final int MAX_STATEMENTS = MAX_ROWS + 1;
    private static final int QUERY_TIMEOUT_SECONDS = 10;

    private static final Pattern CREATE_PATTERN =
        Pattern.compile("^CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?\"?([a-zA-Z_][a-zA-Z0-9_]*)\"?", Pattern.CASE_INSENSITIVE);
    private static final Pattern INSERT_PATTERN =
        Pattern.compile("^INSERT\\s+INTO\\s+\"?([a-zA-Z_][a-zA-Z0-9_]*)\"?", Pattern.CASE_INSENSITIVE);
    private static final Pattern INT_PATTERN = Pattern.compile("^-?\\d+$");
    private static final Pattern NUMERIC_PATTERN = Pattern.compile("^-?\\d+\\.\\d+$");
    private static final Pattern DATE_PATTERN = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}$");

    @Override
    @Transactional
    public CustomTableResponse uploadCustomTable(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please choose a file to upload");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File exceeds the 5MB size limit");
        }

        String filename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String lower = filename.toLowerCase();
        String schemaName = "custom_user_" + userId;

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new BadRequestException("Could not read uploaded file");
        }

        String tableName;
        try (Connection conn = dataSource.getConnection()) {
            try (Statement stmt = conn.createStatement()) {
                stmt.setQueryTimeout(QUERY_TIMEOUT_SECONDS);
                stmt.execute("DROP SCHEMA IF EXISTS " + schemaName + " CASCADE");
                stmt.execute("CREATE SCHEMA " + schemaName);
            }

            if (lower.endsWith(".sql")) {
                tableName = executeSqlScript(conn, schemaName, new String(bytes, StandardCharsets.UTF_8));
            } else if (lower.endsWith(".csv")) {
                tableName = executeTabularUpload(conn, schemaName, parseCsv(new String(bytes, StandardCharsets.UTF_8)), filename);
            } else if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
                tableName = executeTabularUpload(conn, schemaName, parseExcel(bytes), filename);
            } else {
                throw new BadRequestException("Only .sql, .csv, .xlsx or .xls files are supported");
            }

            List<String> columns = fetchColumns(conn, schemaName, tableName);
            int rowCount = fetchRowCount(conn, schemaName, tableName);

            customUserTableRepository.save(CustomUserTable.builder()
                .userId(userId)
                .schemaName(schemaName)
                .tableName(tableName)
                .build());

            return new CustomTableResponse(schemaName, tableName, columns, rowCount);
        } catch (SQLException e) {
            log.warn("Custom table upload failed for user {}: {}", userId, e.getMessage());
            throw new BadRequestException("Failed to create table: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void removeCustomTable(Long userId) {
        String schemaName = "custom_user_" + userId;
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("DROP SCHEMA IF EXISTS " + schemaName + " CASCADE");
        } catch (SQLException e) {
            throw new BadRequestException("Failed to remove custom table: " + e.getMessage());
        }
        if (customUserTableRepository.existsById(userId)) {
            customUserTableRepository.deleteById(userId);
        }
    }

    @Scheduled(fixedRate = 60 * 60 * 1000)
    @Transactional
    public void cleanupExpiredCustomTables() {
        LocalDateTime cutoff = LocalDateTime.now().minus(jwtExpirationMs, java.time.temporal.ChronoUnit.MILLIS);
        List<CustomUserTable> expired = customUserTableRepository.findByCreatedAtBefore(cutoff);
        if (expired.isEmpty()) {
            return;
        }
        for (CustomUserTable entry : expired) {
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                stmt.execute("DROP SCHEMA IF EXISTS " + entry.getSchemaName() + " CASCADE");
            } catch (SQLException e) {
                log.warn("Failed to drop expired custom schema {}: {}", entry.getSchemaName(), e.getMessage());
            }
        }
        customUserTableRepository.deleteAll(expired);
    }

    private String executeSqlScript(Connection conn, String schemaName, String content) throws SQLException {
        List<String> statements = splitStatements(content);
        if (statements.isEmpty()) {
            throw new BadRequestException("SQL script is empty");
        }
        if (statements.size() > MAX_STATEMENTS) {
            throw new BadRequestException("SQL script exceeds the maximum of " + MAX_STATEMENTS + " statements");
        }

        String tableName = null;
        int insertCount = 0;
        for (String s : statements) {
            Matcher createMatcher = CREATE_PATTERN.matcher(s);
            Matcher insertMatcher = INSERT_PATTERN.matcher(s);
            if (createMatcher.find()) {
                if (tableName != null) {
                    throw new BadRequestException("Only one CREATE TABLE statement is allowed per upload");
                }
                tableName = createMatcher.group(1).toLowerCase();
            } else if (insertMatcher.find()) {
                if (tableName == null) {
                    throw new BadRequestException("INSERT statements must come after the CREATE TABLE statement");
                }
                if (!insertMatcher.group(1).toLowerCase().equals(tableName)) {
                    throw new BadRequestException("INSERT statements must target the same table created by CREATE TABLE");
                }
                insertCount++;
                if (insertCount > MAX_ROWS) {
                    throw new BadRequestException("SQL script exceeds the maximum of " + MAX_ROWS + " INSERT statements");
                }
            } else {
                throw new BadRequestException("Only CREATE TABLE and INSERT INTO statements are allowed");
            }
        }
        if (tableName == null) {
            throw new BadRequestException("SQL script must contain exactly one CREATE TABLE statement");
        }

        try (Statement stmt = conn.createStatement()) {
            stmt.setQueryTimeout(QUERY_TIMEOUT_SECONDS);
            stmt.execute("SET search_path TO " + schemaName);
            for (String s : statements) {
                stmt.execute(s);
            }
        }
        return tableName;
    }

    private String executeTabularUpload(Connection conn, String schemaName, List<List<String>> table, String filename) throws SQLException {
        if (table.isEmpty()) {
            throw new BadRequestException("File has no data");
        }
        List<String> rawHeaders = table.get(0);
        if (rawHeaders.size() > MAX_COLUMNS) {
            throw new BadRequestException("File exceeds the maximum of " + MAX_COLUMNS + " columns");
        }
        List<List<String>> dataRows = table.subList(1, table.size());
        if (dataRows.size() > MAX_ROWS) {
            throw new BadRequestException("File exceeds the maximum of " + MAX_ROWS + " rows");
        }

        List<String> columns = sanitizeHeaders(rawHeaders);
        List<String> columnTypes = inferColumnTypes(columns, dataRows);

        String tableName = sanitizeIdentifier(stripExtension(filename));
        if (tableName.isEmpty()) {
            tableName = "uploaded_data";
        }

        StringBuilder createSql = new StringBuilder("CREATE TABLE ").append(tableName).append(" (");
        for (int i = 0; i < columns.size(); i++) {
            if (i > 0) createSql.append(", ");
            createSql.append(columns.get(i)).append(" ").append(columnTypes.get(i));
        }
        createSql.append(")");

        try (Statement stmt = conn.createStatement()) {
            stmt.setQueryTimeout(QUERY_TIMEOUT_SECONDS);
            stmt.execute("SET search_path TO " + schemaName);
            stmt.execute(createSql.toString());
        }

        if (!dataRows.isEmpty()) {
            List<Integer> sqlTypes = columnTypes.stream().map(this::sqlTypeFor).collect(Collectors.toList());
            String placeholders = columns.stream().map(c -> "?").collect(Collectors.joining(", "));
            String insertSql = "INSERT INTO " + tableName + " (" + String.join(", ", columns) + ") VALUES (" + placeholders + ")";
            try (PreparedStatement ps = conn.prepareStatement(insertSql)) {
                for (List<String> row : dataRows) {
                    for (int i = 0; i < columns.size(); i++) {
                        String value = i < row.size() ? row.get(i) : null;
                        int sqlType = sqlTypes.get(i);
                        if (value == null || value.trim().isEmpty()) {
                            ps.setNull(i + 1, sqlType);
                        } else {
                            ps.setObject(i + 1, value.trim(), sqlType);
                        }
                    }
                    ps.addBatch();
                }
                ps.executeBatch();
            }
        }

        return tableName;
    }

    private List<String> splitStatements(String sql) {
        List<String> statements = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inSingleQuote = false;
        for (int i = 0; i < sql.length(); i++) {
            char c = sql.charAt(i);
            if (c == '\'') {
                inSingleQuote = !inSingleQuote;
                current.append(c);
            } else if (c == ';' && !inSingleQuote) {
                statements.add(current.toString().trim());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        if (current.toString().trim().length() > 0) {
            statements.add(current.toString().trim());
        }
        return statements.stream().filter(s -> !s.isEmpty()).collect(Collectors.toList());
    }

    private List<List<String>> parseCsv(String content) {
        List<List<String>> rows = new ArrayList<>();
        List<String> currentRow = new ArrayList<>();
        StringBuilder field = new StringBuilder();
        boolean inQuotes = false;
        int len = content.length();
        for (int i = 0; i < len; i++) {
            char c = content.charAt(i);
            if (inQuotes) {
                if (c == '"') {
                    if (i + 1 < len && content.charAt(i + 1) == '"') {
                        field.append('"');
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field.append(c);
                }
            } else if (c == '"') {
                inQuotes = true;
            } else if (c == ',') {
                currentRow.add(field.toString());
                field.setLength(0);
            } else if (c == '\n' || c == '\r') {
                if (c == '\r' && i + 1 < len && content.charAt(i + 1) == '\n') i++;
                currentRow.add(field.toString());
                field.setLength(0);
                if (!(currentRow.size() == 1 && currentRow.get(0).isEmpty())) {
                    rows.add(currentRow);
                }
                currentRow = new ArrayList<>();
            } else {
                field.append(c);
            }
        }
        if (field.length() > 0 || !currentRow.isEmpty()) {
            currentRow.add(field.toString());
            rows.add(currentRow);
        }
        return rows;
    }

    private List<List<String>> parseExcel(byte[] bytes) {
        List<List<String>> rows = new ArrayList<>();
        try (InputStream in = new java.io.ByteArrayInputStream(bytes);
             Workbook workbook = WorkbookFactory.create(in)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                List<String> cells = new ArrayList<>();
                short lastCol = row.getLastCellNum();
                for (int c = 0; c < lastCol; c++) {
                    cells.add(formatCellValue(row.getCell(c, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK)));
                }
                boolean blank = cells.isEmpty() || cells.stream().allMatch(String::isEmpty);
                if (!blank || rows.isEmpty()) {
                    rows.add(cells);
                }
            }
        } catch (IOException e) {
            throw new BadRequestException("Could not read the Excel file");
        } catch (Exception e) {
            throw new BadRequestException("Invalid or unsupported Excel file");
        }
        return rows;
    }

    private String formatCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                double d = cell.getNumericCellValue();
                return d == Math.floor(d) && !Double.isInfinite(d) ? String.valueOf((long) d) : String.valueOf(d);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return formatCellValue(cell, cell.getCachedFormulaResultType());
                } catch (Exception e) {
                    return "";
                }
            default:
                return "";
        }
    }

    private String formatCellValue(Cell cell, CellType cachedType) {
        if (cachedType == CellType.STRING) return cell.getStringCellValue().trim();
        if (cachedType == CellType.NUMERIC) {
            double d = cell.getNumericCellValue();
            return d == Math.floor(d) && !Double.isInfinite(d) ? String.valueOf((long) d) : String.valueOf(d);
        }
        if (cachedType == CellType.BOOLEAN) return String.valueOf(cell.getBooleanCellValue());
        return "";
    }

    private List<String> sanitizeHeaders(List<String> rawHeaders) {
        List<String> result = new ArrayList<>();
        Set<String> used = new HashSet<>();
        for (int i = 0; i < rawHeaders.size(); i++) {
            String base = sanitizeIdentifier(rawHeaders.get(i));
            if (base.isEmpty()) {
                base = "column_" + (i + 1);
            }
            String name = base;
            int suffix = 1;
            while (!used.add(name)) {
                name = base + "_" + (suffix++);
            }
            result.add(name);
        }
        return result;
    }

    private String sanitizeIdentifier(String raw) {
        if (raw == null) return "";
        String cleaned = raw.trim().toLowerCase().replaceAll("[^a-zA-Z0-9_]", "_");
        cleaned = cleaned.replaceAll("_+", "_").replaceAll("^_+|_+$", "");
        if (!cleaned.isEmpty() && Character.isDigit(cleaned.charAt(0))) {
            cleaned = "c_" + cleaned;
        }
        if (cleaned.length() > 50) {
            cleaned = cleaned.substring(0, 50);
        }
        return cleaned;
    }

    private String stripExtension(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(0, dot) : filename;
    }

    private List<String> inferColumnTypes(List<String> columns, List<List<String>> rows) {
        List<String> types = new ArrayList<>();
        for (int col = 0; col < columns.size(); col++) {
            boolean allInt = true, allNumeric = true, allDate = true, hasValue = false;
            for (List<String> row : rows) {
                String value = col < row.size() ? row.get(col).trim() : "";
                if (value.isEmpty()) continue;
                hasValue = true;
                if (allInt && !INT_PATTERN.matcher(value).matches()) allInt = false;
                if (allNumeric && !NUMERIC_PATTERN.matcher(value).matches() && !INT_PATTERN.matcher(value).matches()) allNumeric = false;
                if (allDate && !DATE_PATTERN.matcher(value).matches()) allDate = false;
            }
            if (!hasValue) types.add("TEXT");
            else if (allInt) types.add("BIGINT");
            else if (allNumeric) types.add("NUMERIC");
            else if (allDate) types.add("DATE");
            else types.add("TEXT");
        }
        return types;
    }

    private int sqlTypeFor(String columnType) {
        switch (columnType) {
            case "BIGINT": return Types.BIGINT;
            case "NUMERIC": return Types.NUMERIC;
            case "DATE": return Types.DATE;
            default: return Types.VARCHAR;
        }
    }

    private List<String> fetchColumns(Connection conn, String schemaName, String tableName) throws SQLException {
        List<String> columns = new ArrayList<>();
        String sql = "SELECT column_name FROM information_schema.columns " +
            "WHERE table_schema = ? AND table_name = ? ORDER BY ordinal_position";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, schemaName);
            ps.setString(2, tableName);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    columns.add(rs.getString("column_name"));
                }
            }
        }
        return columns;
    }

    private int fetchRowCount(Connection conn, String schemaName, String tableName) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("SET search_path TO " + schemaName);
            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM " + tableName)) {
                return rs.next() ? rs.getInt(1) : 0;
            }
        }
    }
}
