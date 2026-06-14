package com.messFinder.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "mess_images")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessImage
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mess_id", nullable = false)
    private Mess mess;

    @Column(name = "cloudinary_url", nullable = false)
    private String cloudinaryUrl;

    @Column(name = "cloudinary_id", nullable = false)
    private String cloudinaryId;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
