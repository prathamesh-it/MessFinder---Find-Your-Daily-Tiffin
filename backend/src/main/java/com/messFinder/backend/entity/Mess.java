package com.messFinder.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "messes")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Mess
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(name = "area")
    private String area;

    @Column(name = "city")
    private String city = "Amravati";


    @Column(name = "nearby_landmark")
    private String nearbyLandmark;

    @Column(nullable = false)
    private String phone;

    @Column(name = "price_per_month", nullable = false)
    private BigDecimal pricePerMonth;

    @Column(name = "is_veg")
    private Boolean isVeg = true;

    @Column(name = "breakfast")
    private Boolean breakfast = false;

    @Column(name = "lunch")
    private String lunch;

    @Column(name = "dinner")
    private String dinner;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "avg_rating")
    private Double avgRating = 0.0;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


}
