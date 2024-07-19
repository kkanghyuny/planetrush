package com.planetrush.planetrush.planet.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planetrush.planetrush.planet.domain.Resident;

public interface ResidentRepository extends JpaRepository<Resident, Long> {
}
