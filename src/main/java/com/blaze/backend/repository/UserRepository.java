package com.blaze.backend.repository;

import com.blaze.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    List<User> findByStatus(String status);

    @Query("SELECT u FROM User u WHERE u.status = 'APPROVED' AND u.role.name = 'ROLE_DEVELOPER'")
    List<User> findApprovedDevelopers();
}
