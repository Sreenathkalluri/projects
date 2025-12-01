package com.petadoption.repo;

import com.petadoption.entity.Fish;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FishRepo extends JpaRepository<Fish, Integer> {}
