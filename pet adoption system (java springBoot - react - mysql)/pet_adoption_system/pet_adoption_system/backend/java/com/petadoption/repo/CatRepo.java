package com.petadoption.repo;

import com.petadoption.entity.Cat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatRepo extends JpaRepository<Cat, Integer> {}
