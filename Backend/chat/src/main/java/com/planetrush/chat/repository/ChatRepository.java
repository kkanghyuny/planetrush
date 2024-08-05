package com.planetrush.chat.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.planetrush.chat.domain.ChattingMessage;
import com.planetrush.chat.service.dto.GetChatDto;
import com.planetrush.chat.service.dto.MemberDto;

public interface ChatRepository extends MongoRepository<ChattingMessage, Long> {

	@Query(value = "{ 'planetId' : ?0 }", sort = "{ 'createdAt' : 1 }")
	List<GetChatDto> findAllByPlanetIdOrderByCreatedAtAsc(Long planetId);

	List<MemberDto> findMemberIdsByPlanetId(Long planetId);

}
