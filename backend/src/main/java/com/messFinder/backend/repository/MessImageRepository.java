package com.messFinder.backend.repository;

import com.messFinder.backend.entity.Mess;
import com.messFinder.backend.entity.MessImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessImageRepository extends JpaRepository<MessImage, Long>{
    List<MessImage> findByMess(Mess mess);
    int countByMess(Mess mess);

}
