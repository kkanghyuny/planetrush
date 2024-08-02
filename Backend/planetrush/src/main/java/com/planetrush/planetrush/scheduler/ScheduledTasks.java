package com.planetrush.planetrush.scheduler;

import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.planetrush.planetrush.member.domain.ChallengeHistory;
import com.planetrush.planetrush.member.repository.ChallengeHistoryRepository;
import com.planetrush.planetrush.planet.domain.Planet;
import com.planetrush.planetrush.planet.domain.Resident;
import com.planetrush.planetrush.planet.repository.ResidentRepository;
import com.planetrush.planetrush.planet.repository.custom.PlanetRepositoryCustom;
import com.planetrush.planetrush.planet.repository.custom.ResidentRepositoryCustom;
import com.planetrush.planetrush.planet.repository.custom.VerificationRecordRepositoryCustom;
import com.planetrush.planetrush.verification.domain.VerificationRecord;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class ScheduledTasks {

	private final ResidentRepository residentRepository;
	private final ChallengeHistoryRepository challengeHistoryRepository;
	private final PlanetRepositoryCustom planetRepositoryCustom;
	private final ResidentRepositoryCustom residentRepositoryCustom;
	private final VerificationRecordRepositoryCustom verificationRecordRepositoryCustom;

	/**
	 * <p매일 자정마다 챌린지가 시작되어야 하는 행성의 상태를 READY에서 IN_PROGRESS로 변경합니다.></p>
	 * <p매일 자정마다 챌린지가 종료되어야 하는 행성의 상태를 IN_PROFRESS에서 UNDER_REVIEW로 변경합니다.></p>
	 */
	@Scheduled(cron = "${scheduled-task.change-planet-status-cron}")
	@Transactional
	void changePlanetReadyToInProgress() {
		planetRepositoryCustom.updateStatusReadyToInProgress();
		planetRepositoryCustom.updateStatusInProgressToUnderReview();
	}

	/**
	 * <p>하루에 한 번, 진행중, 심사중인 행성을 조회합니다.</p>
	 * <p>행성 입주자들을 대상으로 마지막 인증 기록을 조회합니다.</p>
	 * <p>마지막 인증 기록 날짜와 현재 날짜가 4일 차이가 나면 퇴출됩니다. 또한 챌린지는 실패 상태로 기록됩니다.</p>
	 */
	@Scheduled(cron = "${scheduled-task.ban-if-last-verification-older-than-three-days}")
	@Transactional
	void removeIfLastVerificationOlderThanThreeDays() {
		List<Planet> planets = planetRepositoryCustom.findAllStatusIsInProgressAndUnderReview();
		planets.forEach(planet -> {
			List<Resident> residents = residentRepository.findByPlanetId(planet.getId());
			residents.forEach(resident -> {
				VerificationRecord latestRecord = verificationRecordRepositoryCustom.findLatestRecord(
					resident.getMember(), resident.getPlanet());
				if (latestRecord != null && latestRecord.isDifferenceGreaterThanFourDays()) {
					log.info("[중도 퇴소 처리] the last verificationRecordId = {}", latestRecord.getId());
					residentRepositoryCustom.banMemberFromPlanet(latestRecord.getMember(),
						latestRecord.getPlanet());
					planet.participantExpulsion();
				}
			});
		});
	}

	/**
	 * <p>하루에 한 번, 심사 대기중인 행성을 조회합니다.</p>
	 * <p>개인 기록을 저장하고 행성 전체 진행률을 계산합니다.</p>
	 * <p>전체 진행률이 70퍼센트 이상이면 성공, 아니면 실패 상태로 저장됩니다.</p>
	 */
	@Scheduled(cron = "${scheduled-task.planet-complete-destroy}")
	@Transactional
	void completeOrDestroyPlanet() {
		List<Planet> planets = planetRepositoryCustom.findAllStatusIsUnderReview();
		List<ChallengeHistory> challengeHistories = new ArrayList<>();
		planets.forEach(planet -> {
			long totalVerificationCnt = planet.calcTotalVerificationCnt();
			int actualVerificationCnt = 0;
			List<Resident> residents = residentRepository.findByPlanetId(planet.getId());
			for (Resident resident : residents) {
				List<VerificationRecord> records = verificationRecordRepositoryCustom.findAllByMemberAndPlanet(
					resident.getMember(), resident.getPlanet());
				double memberProgress = records.size() / (double)totalVerificationCnt * 100;
				actualVerificationCnt += records.size();
				challengeHistories.add(ChallengeHistory.builder()
					.member(resident.getMember())
					.planetImgUrl(planet.getPlanetImg())
					.planetName(planet.getName())
					.challengeContent(planet.getContent())
					.category(planet.getCategory())
					.progress(memberProgress)
					.build());
			}
			double totalProgressRatio = (double)actualVerificationCnt / totalVerificationCnt * 100;
			if (totalProgressRatio >= 70.0) {
				planet.complete();
				challengeHistoryRepository.saveAll(challengeHistories);
			} else {
				planet.destroy();
			}
		});
	}

}
