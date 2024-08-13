package com.planetrush.planetrush.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.infra.flask.util.FlaskUtil;
import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.member.repository.ProgressAvgRepository;
import com.planetrush.planetrush.member.repository.custom.ProgressAvgRepositoryCustom;
import com.planetrush.planetrush.member.service.dto.GetMyProgressAvgDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class GetMyProgressAvgServiceImpl implements GetMyProgressAvgService {

	private final MemberRepository memberRepository;
	private final ProgressAvgRepositoryCustom progressAvgRepositoryCustom;
	private final ProgressAvgRepository progressAvgRepository;
	private final FlaskUtil flaskUtil;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public GetMyProgressAvgDto getMyProgressAvgPer(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("Member not found with ID: " + memberId));
		return flaskUtil.getMyProgressAvg(memberId);
	}
}
