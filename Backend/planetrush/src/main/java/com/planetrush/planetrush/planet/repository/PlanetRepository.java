package com.planetrush.planetrush.planet.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planetrush.planetrush.planet.domain.Planet;

public interface PlanetRepository extends JpaRepository<Planet, Long> {
}
