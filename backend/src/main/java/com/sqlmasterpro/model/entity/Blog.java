package com.sqlmasterpro.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "blogs", indexes = {
    @Index(name = "idx_blog_slug", columnList = "slug", unique = true),
    @Index(name = "idx_blog_category", columnList = "category")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "blog_seq")
    @SequenceGenerator(name = "blog_seq", sequenceName = "blogs_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(unique = true, nullable = false, length = 350)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "excerpt", length = 500)
    private String excerpt;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "reading_time_minutes")
    @Builder.Default
    private int readingTimeMinutes = 5;

    @Column(name = "views")
    @Builder.Default
    private int views = 0;

    @Column(name = "likes")
    @Builder.Default
    private int likes = 0;

    @Column(name = "published", nullable = false)
    @Builder.Default
    private boolean published = false;

    @Column(name = "featured", nullable = false)
    @Builder.Default
    private boolean featured = false;

    @Column(name = "seo_title", length = 300)
    private String seoTitle;

    @Column(name = "seo_description", length = 500)
    private String seoDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
