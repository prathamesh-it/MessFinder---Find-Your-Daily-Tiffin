package com.messFinder.backend.repository;



import com.messFinder.backend.entity.Mess;
import com.messFinder.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>
{
    List<Review> findByMess(Mess mess);
    List<Review> findByMessAndIsApprovedTrue(Mess mess);
}