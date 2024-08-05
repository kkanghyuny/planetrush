package com.planetrush.chat.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GetNicknameServiceImpl implements GetNicknameService {

	private final JdbcTemplate jdbcTemplate;

	@Override
	public Map<Long, String> getNicknameByMemberIds(Set<Long> memberIds) {
		if (memberIds.isEmpty()) {
			return Collections.emptyMap();
		}

		String sql = "SELECT member_id, nickname FROM member WHERE member_id IN (?)";

		String inClause = memberIds.stream()
			.map(id -> "?")
			.collect(Collectors.joining(", "));
		sql = sql.replace("?", inClause);
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, memberIds.toArray());
		Map<Long, String> nicknameMap = new HashMap<>();
		for (Map<String, Object> row : rows) {
			Long memberId = ((Number)row.get("member_id")).longValue();
			String nickname = (String)row.get("nickname");
			nicknameMap.put(memberId, nickname);
		}
		return nicknameMap;
	}
}
