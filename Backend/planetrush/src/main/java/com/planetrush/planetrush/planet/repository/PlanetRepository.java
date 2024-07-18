package com.planetrush.planetrush.planet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.planetrush.planetrush.planet.domain.Planet;

@Repository
public interface PlanetRepository extends GetPlanetRepository, JpaRepository<Planet, Long> {
}
