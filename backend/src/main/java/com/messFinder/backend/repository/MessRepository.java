package com.messFinder.backend.repository;

import com.messFinder.backend.entity.Mess;
import com.messFinder.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessRepository extends JpaRepository<Mess, Long>
{
    List<Mess> findByIsActiveTrue();
    List<Mess> findByOwner(User owner);
    Optional<Mess> findByOwnerAndIsActiveTrue(User owner);
    List<Mess> findByIsVegAndIsActiveTrue(Boolean isVeg);
    List<Mess> findByIsFeaturedTrueAndIsActiveTrue();

    @Query("SELECT m FROM Mess m WHERE m.isActive = true AND " +
            "(LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(m.area) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Mess> searchMesses(@Param("query") String query);
}
