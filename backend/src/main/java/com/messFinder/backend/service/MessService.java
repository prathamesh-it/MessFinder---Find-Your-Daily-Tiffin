package com.messFinder.backend.service;

import com.messFinder.backend.dtos.request.CreateMessRequest;
import com.messFinder.backend.dtos.request.OwnerUpdateMessRequest;
import com.messFinder.backend.dtos.response.MessDetailDTO;
import com.messFinder.backend.dtos.response.MessSummaryDTO;
import com.messFinder.backend.entity.Mess;
import com.messFinder.backend.entity.MessImage;
import com.messFinder.backend.entity.User;
import com.messFinder.backend.repository.MessImageRepository;
import com.messFinder.backend.repository.MessRepository;
import com.messFinder.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessService
{
    private final MessRepository messRepository;
    private final MessImageRepository messImageRepository;
    private final UserRepository userRepository;

    // Get all active messes (public)
    public List<MessSummaryDTO> getAllMesses() {
        return messRepository.findByIsActiveTrue()
                .stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }


    // Search messes (public)
    public List<MessSummaryDTO> searchMesses(String query) {
        return messRepository.searchMesses(query)
                .stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    // Get featured messes (public)
    public List<MessSummaryDTO> getFeaturedMesses() {
        return messRepository.findByIsFeaturedTrueAndIsActiveTrue()
                .stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }


    // Get mess detail by id (public)
    public MessDetailDTO getMessById(Long id) {
        Mess mess = messRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));
        return toDetailDTO(mess);
    }

    // Get veg or nonveg messes (public)
    public List<MessSummaryDTO> getMessesByType(Boolean isVeg) {
        return messRepository.findByIsVegAndIsActiveTrue(isVeg)
                .stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    // Create mess (owner)
    public MessDetailDTO createMess(CreateMessRequest request, String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // Check if owner already has a mess
        if (messRepository.findByOwner(owner).size() > 0) {
            throw new RuntimeException("You already have a mess!");
        }

        Mess mess = Mess.builder()
                .owner(owner)
                .name(request.getName())
                .address(request.getAddress())
                .nearbyLandmark(request.getNearbyLandmark())
                .phone(request.getPhone())
                .pricePerMonth(request.getPricePerMonth())
                .isVeg(request.getIsVeg())
                .breakfast(request.getBreakfast())
                .lunch(request.getLunch())
                .dinner(request.getDinner())
                .area(request.getArea())
                .city("Amravati")
                .isActive(true)
                .isFeatured(false)
                .avgRating(0.0)
                .totalReviews(0)
                .build();

        return toDetailDTO(messRepository.save(mess));
    }

    // Update mess name and price (owner only)
    public MessDetailDTO updateMess(OwnerUpdateMessRequest request, String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Mess mess = messRepository.findByOwnerAndIsActiveTrue(owner)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));

        // Owner can only update these fields
        if (request.getName() != null) mess.setName(request.getName());
        if (request.getPhone() != null) mess.setPhone(request.getPhone());
        if (request.getPricePerMonth() != null) mess.setPricePerMonth(request.getPricePerMonth());
        if (request.getAddress() != null) mess.setAddress(request.getAddress());
        if (request.getNearbyLandmark() != null) mess.setNearbyLandmark(request.getNearbyLandmark());
        if (request.getBreakfast() != null) mess.setBreakfast(request.getBreakfast());
        if (request.getLunch() != null) mess.setLunch(request.getLunch());
        if (request.getDinner() != null) mess.setDinner(request.getDinner());

        return toDetailDTO(messRepository.save(mess));
    }

    // Get owner's own mess
    public MessDetailDTO getMyMess(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Mess mess = messRepository.findByOwnerAndIsActiveTrue(owner)
                .orElseThrow(() -> new RuntimeException("You don't have a mess yet!"));

        return toDetailDTO(mess);
    }

    // Convert to SummaryDTO
    private MessSummaryDTO toSummaryDTO(Mess mess) {
        List<MessImage> images = messImageRepository.findByMess(mess);
        String imageUrl = images.isEmpty() ? null : images.get(0).getCloudinaryUrl();

        return MessSummaryDTO.builder()
                .id(mess.getId())
                .name(mess.getName())
                .area(mess.getArea())
                .city(mess.getCity())
                .pricePerMonth(mess.getPricePerMonth())
                .isVeg(mess.getIsVeg())
                .avgRating(mess.getAvgRating())
                .totalReviews(mess.getTotalReviews())
                .isFeatured(mess.getIsFeatured())
                .imageUrl(imageUrl)
                .build();
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
                .imageUrls(imageUrls)
                .build();
    }

}
