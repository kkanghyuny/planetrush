package com.planetrush.planetrush.planet.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planetrush.planetrush.planet.domain.image.StandardVerificationImg;

public interface StandardVerificationImgRepository extends JpaRepository<StandardVerificationImg, Long> {
}