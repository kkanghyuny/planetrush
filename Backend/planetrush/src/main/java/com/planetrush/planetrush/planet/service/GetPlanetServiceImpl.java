package com.planetrush.planetrush.planet.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.core.jwt.JwtTokenProvider;
import com.planetrush.planetrush.member.domain.Member;
import com.planetrush.planetrush.member.exception.MemberNotFoundException;
import com.planetrush.planetrush.member.repository.MemberRepository;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.Resident;
import com.planetrush.planetrush.planet.domain.VerificationRecord;
import com.planetrush.planetrush.planet.exception.PlanetNotFoundException;
import com.planetrush.planetrush.planet.repository.PlanetRepository;
import com.planetrush.planetrush.planet.repository.custom.PlanetRepositoryCustom;
import com.planetrush.planetrush.planet.repository.custom.ResidentRepositoryCustom;
import com.planetrush.planetrush.planet.repository.custom.VerificationRecordRepositoryCustom;
import com.planetrush.planetrush.planet.service.dto.GetMainPlanetListDto;
import com.planetrush.planetrush.planet.service.dto.GetMyPlanetListDto;
import com.planetrush.planetrush.planet.service.dto.OngoingPlanetDto;
import com.planetrush.planetrush.planet.service.dto.PlanetDetailDto;
import com.planetrush.planetrush.planet.service.dto.ResidentDto;
import com.planetrush.planetrush.planet.service.dto.SearchCond;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class GetPlanetServiceImpl implements GetPlanetService {

	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;
	private final PlanetRepository planetRepository;
	private final ResidentRepositoryCustom residentRepositoryCustom;
	private final PlanetRepositoryCustom planetRepositoryCustom;
	private final VerificationRecordRepositoryCustom verificationRecordRepositoryCustom;

	/**
	 * 검색어, 카테고리로 검색, 챌린지 시작 시간이 지나지 않아 참가 가능성이 있는 행성들을 검색할 수 있다.
	 * @param cond  검색 조건
	 * @return 행성 상세정보 목록
	 */
	@Override
	public List<PlanetDetailDto> searchPlanet(SearchCond cond) {
		List<Planet> planets = planetRepositoryCustom.searchPlanet(cond);
		return planets.stream()
			.map(p -> PlanetDetailDto.builder()
				.planetId(p.getId())
				.name(p.getName())
				.planetImg(p.getPlanetImgUrl())
				.content(p.getContent())
				.startDate(p.getStartDate())
				.endDate(p.getEndDate())
				.category(String.valueOf(p.getCategory()))
				.maxParticipants(p.getMaxParticipants())
				.currentParticipants(p.getCurrentParticipants())
				.planetStatus(p.getStatus().toString())
				.build())
			.toList();
	}

	/**
	 * 챌린지가 시작되지 않은 행성 상세 조회한다.
	 * @param memberId 회원 id
	 * @param planetId 행성 id
	 * @return 행성 상세 정보
	 */
	@Override
	public PlanetDetailDto getPlanetDetail(Long memberId, Long planetId) {
		Planet planet = planetRepository.findById(planetId)
			.orElseThrow(PlanetNotFoundException::new);
		boolean joined = false;
		if (memberId != null) {
			Member member = memberRepository.findById(memberId)
				.orElseThrow(MemberNotFoundException::new);
			joined = residentRepositoryCustom.isResidentOfPlanet(memberId, planetId);
		}
		return PlanetDetailDto.builder()
			.planetId(planet.getId())
			.name(planet.getName())
			.planetImg(planet.getPlanetImgUrl())
			.content(planet.getContent())
			.startDate(planet.getStartDate())
			.endDate(planet.getEndDate())
			.category(String.valueOf(planet.getCategory()))
			.maxParticipants(planet.getMaxParticipants())
			.currentParticipants(planet.getCurrentParticipants())
			.planetStatus(String.valueOf(planet.getStatus()))
			.joined(joined)
			.build();
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>이 메서드는 특정 멤버와 플래닛에 대한 진행 중인 플래닛 정보를 반환합니다.</p>
	 *
	 * <p>연속으로 3일간 인증하지 않은 회원은 행성에서 퇴출되며, 거주자 목록에서 제외됩니다.</p>
	 * <p>거주자 목록은 각 거주자의 인증 횟수와 연속 인증 점수를 기준으로 정렬됩니다.</p>
	 * <p>연속 인증 점수는 기본 1점에서 시작하며, 연속된 일 수만큼 매일 0.1 포인트를 추가하여 계산합니다.</p>
	 *
	 * @param memberId 멤버의 ID
	 * @param planetId 플래닛의 ID
	 * @return OngoingPlanetDto 객체, 진행 중인 플래닛의 정보를 담고 있습니다.
	 * @throws MemberNotFoundException 멤버를 찾지 못했을 때 발생
	 * @throws PlanetNotFoundException 플래닛을 찾지 못했을 때 발생
	 */
	@Override
	public OngoingPlanetDto getOngoingPlanet(Long memberId, Long planetId) {
		Member querriedMember = memberRepository.findById(memberId)
			.orElseThrow(MemberNotFoundException::new);
		Planet planet = planetRepository.findById(planetId)
			.orElseThrow(PlanetNotFoundException::new);
		List<Resident> residents = residentRepositoryCustom.getResidentsNotBanned(planetId);
		return OngoingPlanetDto.builder()
			.planetId(planet.getId())
			.planetImg(planet.getPlanetImgUrl())
			.category(planet.getCategory().toString())
			.content(planet.getContent())
			.startDate(planet.getStartDate())
			.endDate(planet.getEndDate())
			.name(planet.getName())
			.totalVerificationCnt(planet.calcTotalVerificationCnt())
			.residents(toResidentDto(memberId, planetId, residents, querriedMember))
			.build();
	}

	private List<ResidentDto> toResidentDto(Long memberId, Long planetId, List<Resident> residents,
		Member qurriedMember) {
		List<ResidentDto> dtoList = residents.stream()
			.map(resident -> {
				Member member = resident.getMember();
				List<VerificationRecord> verificationInfo = verificationRecordRepositoryCustom.findVerificationRecordsByMemberIdAndPlanetId(
					memberId, planetId);
				return ResidentDto.builder()
					.memberId(member.getId())
					.nickname(member.getNickname())
					.querriedMember(qurriedMember.equals(member))
					.verificationCnt(verificationInfo.size())
					.verificationContinuityPoint(calcContinuityPoint(verificationInfo))
					.build();
			})
			.sorted((o1, o2) -> {
				if (o1.getVerificationCnt() == o2.getVerificationCnt()) {
					return Double.compare(o1.getVerificationContinuityPoint(), o2.getVerificationContinuityPoint())
						* -1;
				}
				return Integer.compare(o1.getVerificationCnt(), o2.getVerificationCnt()) * -1;
			})
			.toList();
		return dtoList;
	}

	private double calcContinuityPoint(List<VerificationRecord> list) {
		if (list == null || list.isEmpty()) {
			return 0;
		}
		double sum = 1.0;
		double stdPoint = 1.0;
		for (int idx = 1; idx < list.size(); idx++) {
			VerificationRecord beforeRecord = list.get(idx - 1);
			VerificationRecord currentRecord = list.get(idx);
			LocalDate beforeDate = beforeRecord.getUploadDate().toLocalDate();
			LocalDate currentDate = currentRecord.getUploadDate().toLocalDate();
			long daysBetween = ChronoUnit.DAYS.between(beforeDate, currentDate);
			log.info("beforeDate = {}", beforeDate);
			log.info("currentDate = {}", currentDate);
			log.info("daysBetween = {}", daysBetween);
			if (daysBetween == 1) {
				stdPoint += 0.1;
			} else {
				stdPoint = 1.0;
			}
			sum += stdPoint;
		}
		return sum;
	}

	/**
	 * {@inheritDoc}
	 * @param memberId
	 * @return
	 */
	@Override
	public List<GetMyPlanetListDto> getMyPlanetList(Long memberId) {
		return planetRepositoryCustom.getMyPlanetList(memberId);
	}

	/**
	 * {@inheritDoc}
	 * @param memberId
	 * @return
	 */
	@Override
	public List<GetMainPlanetListDto> getMainPlanetList(Long memberId) {
		return planetRepositoryCustom.getMainPlanetList(memberId);
	}

	private boolean isNotNull(Long memberId) {
		return memberId != null;
	}

}
