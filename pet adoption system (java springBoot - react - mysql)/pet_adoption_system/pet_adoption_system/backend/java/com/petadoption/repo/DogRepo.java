package com.petadoption.repo;

import com.petadoption.entity.Dog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DogRepo extends JpaRepository<Dog, Integer> {}
