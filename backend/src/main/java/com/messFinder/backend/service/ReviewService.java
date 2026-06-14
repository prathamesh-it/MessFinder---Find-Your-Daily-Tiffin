package com.messFinder.backend.service;

import com.messFinder.backend.dtos.request.CreateReviewRequest;
import com.messFinder.backend.dtos.response.ReviewDTO;
import com.messFinder.backend.entity.Mess;
import com.messFinder.backend.entity.Review;
import com.messFinder.backend.entity.User;
import com.messFinder.backend.repository.MessRepository;
import com.messFinder.backend.repository.ReviewRepository;
import com.messFinder.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService
{
    private final ReviewRepository reviewRepository;
    private final MessRepository messRepository;
    private final UserRepository userRepository;

    // Get all reviews for a mess
    public List<ReviewDTO> getReviewsByMess(Long messId) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));

        return reviewRepository.findByMessAndIsApprovedTrue(mess)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Add review
    public ReviewDTO addReview(Long messId,
                               CreateReviewRequest request,
                               String email) {

        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // Validate rating
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5!");
        }

        Review review = Review.builder()
                .mess(mess)
                .user(user)
                .reviewerName(user.getName())
                .rating(request.getRating())
                .comment(request.getComment())
                .isApproved(true)
                .build();

        reviewRepository.save(review);

        // Update mess average rating
        updateMessRating(mess);

        return toDTO(review);
    }

    // Update mess average rating automatically
    private void updateMessRating(Mess mess) {
        List<Review> reviews = reviewRepository
                .findByMessAndIsApprovedTrue(mess);

        if (reviews.isEmpty()) {
            mess.setAvgRating(0.0);
            mess.setTotalReviews(0);
        } else {
            double avg = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            // Round to 1 decimal
            double rounded = Math.round(avg * 10.0) / 10.0;
            mess.setAvgRating(rounded);
            mess.setTotalReviews(reviews.size());
        }

        messRepository.save(mess);
    }

    // Convert to DTO
    private ReviewDTO toDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .reviewerName(review.getReviewerName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

}
