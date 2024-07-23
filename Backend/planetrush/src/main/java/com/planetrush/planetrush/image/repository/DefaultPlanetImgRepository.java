package com.planetrush.planetrush.image.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planetrush.planetrush.image.domain.DefaultPlanetImg;

public interface DefaultPlanetImgRepository extends JpaRepository<DefaultPlanetImg, Long> {
}
