package com.messFinder.backend.dtos.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OwnerUpdateMessRequest
{
    private String name;
    private String phone;
    private BigDecimal pricePerMonth;
    private String address;
    private String nearbyLandmark;
    private Boolean breakfast;
    private String lunch;
    private String dinner;

}
