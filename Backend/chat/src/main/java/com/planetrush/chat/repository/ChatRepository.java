package com.planetrush.chat.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.planetrush.chat.domain.ChattingMessage;

public interface ChatRepository extends MongoRepository<ChattingMessage, Long> {

	public List<ChattingMessage> findAllByPlanetIdOrderByCreatedAtAsc(Long memberId);
}
