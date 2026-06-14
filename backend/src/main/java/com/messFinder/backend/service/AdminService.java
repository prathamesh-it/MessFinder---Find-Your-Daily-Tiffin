package com.messFinder.backend.service;

import com.messFinder.backend.dtos.response.AdminStatsDTO;
import com.messFinder.backend.dtos.response.MessDetailDTO;
import com.messFinder.backend.dtos.response.UserDTO;
import com.messFinder.backend.entity.Mess;
import com.messFinder.backend.entity.User;
import com.messFinder.backend.entity.MessImage;
import com.messFinder.backend.enums.Role;
import com.messFinder.backend.repository.MessImageRepository;
import com.messFinder.backend.repository.MessRepository;
import com.messFinder.backend.repository.ReviewRepository;
import com.messFinder.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService
{
    private final MessRepository messRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final MessImageRepository messImageRepository;

    // Get dashboard stats
    public AdminStatsDTO getStats() {
        long totalMesses = messRepository.count();
        long activeMesses = messRepository.findByIsActiveTrue().size();
        long totalUsers = userRepository.count();
        long totalOwners = userRepository.findByRole(Role.MESS_OWNER).size();

        double avgRating = messRepository.findByIsActiveTrue()
                .stream()
                .mapToDouble(Mess::getAvgRating)
                .average()
                .orElse(0.0);

        double rounded = Math.round(avgRating * 10.0) / 10.0;

        return AdminStatsDTO.builder()
                .totalMesses(totalMesses)
                .activeMesses(activeMesses)
                .totalUsers(totalUsers)
                .totalOwners(totalOwners)
                .avgRating(rounded)
                .build();
    }

    // Get all messes
    public List<MessDetailDTO> getAllMesses() {
        return messRepository.findAll()
                .stream()
                .map(this::toDetailDTO)
                .collect(Collectors.toList());
    }

    // Get all users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    // Get all mess owners
    public List<UserDTO> getAllOwners() {
        return userRepository.findByRole(Role.MESS_OWNER)
                .stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    // Toggle mess active/inactive
    public MessDetailDTO toggleMessActive(Long messId) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));

        mess.setIsActive(!mess.getIsActive());
        return toDetailDTO(messRepository.save(mess));
    }

    // Toggle mess featured
    public MessDetailDTO toggleMessFeatured(Long messId) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));

        mess.setIsFeatured(!mess.getIsFeatured());
        return toDetailDTO(messRepository.save(mess));
    }

    // Delete mess
    public void deleteMess(Long messId) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));
        messRepository.delete(mess);
    }

    // Convert to DetailDTO
    private MessDetailDTO toDetailDTO(Mess mess) {
        List<MessImage> images = messImageRepository.findByMess(mess);
        List<String> imageUrls = images.stream()
                .map(MessImage::getCloudinaryUrl)
                .collect(Collectors.toList());

        return MessDetailDTO.builder()
                .id(mess.getId())
                .name(mess.getName())
                .area(mess.getArea())
                .city(mess.getCity())
                .address(mess.getAddress())
                .nearbyLandmark(mess.getNearbyLandmark())
                .phone(mess.getPhone())
                .pricePerMonth(mess.getPricePerMonth())
                .isVeg(mess.getIsVeg())
                .breakfast(mess.getBreakfast())
                .lunch(mess.getLunch())
                .dinner(mess.getDinner())
                .avgRating(mess.getAvgRating())
                .totalReviews(mess.getTotalReviews())
                .isFeatured(mess.getIsFeatured())
                .isActive(mess.getIsActive())
                .ownerName(mess.getOwner() != null ? mess.getOwner().getName() : null)
                .imageUrls(imageUrls)
                .build();
    }

    // Convert to UserDTO
    private UserDTO toUserDTO(User user) {
        Mess mess = messRepository.findByOwner(user)
                .stream()
                .findFirst()
                .orElse(null);

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .messName(mess != null ? mess.getName() : null)
                .build();
    }
}
