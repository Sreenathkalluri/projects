package com.petadoption.repo;

import com.petadoption.entity.Hamster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HamsterRepo extends JpaRepository<Hamster, Integer> {}
