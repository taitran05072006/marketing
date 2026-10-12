package com.example.demo.repository;

import com.example.demo.entity.SlugRedirect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SlugRedirectRepository extends JpaRepository<SlugRedirect, Long> {
    Optional<SlugRedirect> findByOldSlugAndEntityType(String oldSlug, String entityType);
    Optional<SlugRedirect> findByOldSlug(String oldSlug);
}
