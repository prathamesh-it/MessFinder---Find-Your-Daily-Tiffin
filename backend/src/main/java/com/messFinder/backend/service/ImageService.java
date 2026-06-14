package com.messFinder.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.messFinder.backend.entity.Mess;
import com.messFinder.backend.entity.MessImage;
import com.messFinder.backend.entity.User;
import com.messFinder.backend.repository.MessImageRepository;
import com.messFinder.backend.repository.MessRepository;
import com.messFinder.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageService
{
    private final Cloudinary cloudinary;
    private final MessImageRepository messImageRepository;
    private final MessRepository messRepository;
    private final UserRepository userRepository;

    // Upload image
    public String uploadImage(MultipartFile file, String email) throws IOException {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Mess mess = messRepository.findByOwnerAndIsActiveTrue(owner)
                .orElseThrow(() -> new RuntimeException("Mess not found!"));

        // Max 2 photos allowed
        int imageCount = messImageRepository.countByMess(mess);
        if (imageCount >= 2) {
            throw new RuntimeException("Maximum 2 photos allowed!");
        }

        // Upload to Cloudinary
        Map result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "messfinder",
                        "resource_type", "image"
                )
        );

        String imageUrl = (String) result.get("secure_url");
        String cloudinaryId = (String) result.get("public_id");

        // Save in database
        MessImage messImage = MessImage.builder()
                .mess(mess)
                .cloudinaryUrl(imageUrl)
                .cloudinaryId(cloudinaryId)
                .isPrimary(imageCount == 0)
                .build();

        messImageRepository.save(messImage);

        return imageUrl;
    }

    // Delete image
    public void deleteImage(Long imageId, String email) throws IOException {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        MessImage image = messImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found!"));

        // Check ownership
        if (!image.getMess().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You can only delete your own images!");
        }

        // Delete from Cloudinary
        cloudinary.uploader().destroy(
                image.getCloudinaryId(),
                ObjectUtils.emptyMap()
        );

        // Delete from database
        messImageRepository.delete(image);
    }

}
