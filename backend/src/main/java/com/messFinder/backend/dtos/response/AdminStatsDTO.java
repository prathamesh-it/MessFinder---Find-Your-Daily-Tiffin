package com.messFinder.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO
{
    private long totalMesses;
    private long activeMesses;
    private long totalUsers;
    private long totalOwners;
    private double avgRating;
}
