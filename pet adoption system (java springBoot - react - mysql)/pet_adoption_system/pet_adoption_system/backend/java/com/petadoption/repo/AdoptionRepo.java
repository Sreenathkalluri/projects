package com.petadoption.repo;

import com.petadoption.entity.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdoptionRepo extends JpaRepository<AdoptionRequest, Integer> {
    List<AdoptionRequest> findByEmail(String email);
}
