package com.messFinder.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessDetailDTO
{
    private Long id;
    private String name;
    private String area;
    private String city;
    private String address;
    private String nearbyLandmark;
    private String phone;
    private Boolean isActive;
    private BigDecimal pricePerMonth;
    private Boolean isVeg;
    private Boolean breakfast;
    private String lunch;
    private String dinner;
    private Double avgRating;
    private Integer totalReviews;
    private Boolean isFeatured;
    private String ownerName;
    private List<String> imageUrls;
}
