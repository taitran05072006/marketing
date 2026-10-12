package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "slug_redirects", indexes = {
    @Index(name = "idx_slug_redirect_old", columnList = "old_slug"),
    @Index(name = "idx_slug_redirect_type", columnList = "entity_type")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SlugRedirect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "old_slug", nullable = false)
    private String oldSlug;

    @Column(name = "new_slug", nullable = false)
    private String newSlug;

    @Column(name = "entity_type", nullable = false)
    private String entityType; // "article", "product", "product-category", "article-category"

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}
