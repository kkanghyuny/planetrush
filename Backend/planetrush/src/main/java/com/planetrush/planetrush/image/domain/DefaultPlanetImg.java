package com.planetrush.planetrush.image.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "default_planet_img")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DefaultPlanetImg {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "default_planet_img_id")
	private long id;

	@Column(name = "img_url", nullable = false)
	private String ImgUrl;

	@CreationTimestamp
	@Column(name = "upload_date", nullable = false)
	private LocalDateTime uploadDate;
}
