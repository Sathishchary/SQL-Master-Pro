package com.sqlmasterpro;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
    "spring.jpa.properties.hibernate.default_schema=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "jwt.secret=test-secret-key-for-testing-only-must-be-at-least-64-characters-long",
    "razorpay.key-id=test_key_id",
    "razorpay.key-secret=test_key_secret",
    "spring.mail.host=localhost",
    "spring.mail.port=3025",
    "spring.mail.username=test@test.com",
    "spring.mail.password=test"
})
class SqlMasterProApplicationTests {

    @Test
    void contextLoads() {
    }
}
