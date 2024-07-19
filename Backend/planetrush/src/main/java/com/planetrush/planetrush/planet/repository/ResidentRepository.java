package com.planetrush.planetrush.planet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.planet.domain.Resident;

@Repository
public interface ResidentRepository extends GetResidentRepository, JpaRepository<Resident, Long> {
}
