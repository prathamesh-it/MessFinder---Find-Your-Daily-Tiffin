package com.messFinder.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessSummaryDTO
{
    private Long id;
    private String name;
    private String area;
    private String city;
    private BigDecimal pricePerMonth;
    private Boolean isVeg;
    private Double avgRating;
    private Integer totalReviews;
    private Boolean isFeatured;
    private String imageUrl;
}
