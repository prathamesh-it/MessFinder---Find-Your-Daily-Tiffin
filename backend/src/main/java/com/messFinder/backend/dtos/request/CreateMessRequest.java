package com.messFinder.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateMessRequest
{
    @NotBlank(message = "Mess name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    private String nearbyLandmark;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "Price is required")
    private BigDecimal pricePerMonth;

    @NotNull(message = "Veg/NonVeg is required")
    private Boolean isVeg;

    private Boolean breakfast = false;
    private String lunch;
    private String dinner;

    @NotBlank(message = "Area is required")
    private String area;
}
