package com.planetrush.chat.service;

import java.util.Map;
import java.util.Set;

public interface GetNicknameService {

	Map<Long, String> getNicknameByMemberIds(Set<Long> memberIds);

}
