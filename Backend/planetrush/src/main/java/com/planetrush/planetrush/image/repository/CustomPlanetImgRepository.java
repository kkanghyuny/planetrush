package com.planetrush.planetrush.image.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planetrush.planetrush.image.domain.CustomPlanetImg;

public interface CustomPlanetImgRepository extends JpaRepository<CustomPlanetImg, Long> {

}