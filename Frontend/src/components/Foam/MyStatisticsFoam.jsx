import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import '../../styles/Mypage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const MyStatistics = () => {
    const [stats, setStats] = useState({
        allAvg: null,
        completionCnt: null,
        challengeCnt: null,
        myAllAvg: null,
        exerciseAvg: null,
        beautyAvg: null,
        lifeAvg: null,
        studyAvg: null,
        etcAvg: null,
        myBeautyAvg: null,
        myEtcAvg: null,
        myExerciseAvg: null,
        myLifeAvg: null,
        myStudyAvg: null,
    });

    const handleShowStats = async () => {
        try {
          const response = await instance.get("/members/mypage");
          const data = response.data.data; 
          return data; 
        } catch (error) {
          throw error;
        }
      };
    
    useEffect(() => {
    const fetchStats = async () => {
        try {
        const statsData = await handleShowStats(); 
        setStats(statsData); 
        } catch (error) {
        throw error;
        }
    };

    fetchStats();
    }, []); 

    const completeRate = stats.challengeCnt === 0 ? 0 : Math.floor((stats.completionCnt / stats.challengeCnt) * 100);

    const difference = (stats.myAllAvg - stats.allAvg).toFixed(2)
    const data = {
        datasets: [
        {
            data: [completeRate],
            backgroundColor: ["#36A2EB", "#E0E0E0"],
            borderWidth: 0,
        },
        ],
    };

    const options = {
        cutout: "70%", // 도넛 차트의 두께를 설정합니다.
        plugins: {
        tooltip: {
            enabled: false, // 툴팁을 비활성화합니다.
        },
        },
    };

    return (
        <>
            <div className="doughnut-chart-container">
                <Doughnut data={data} options={options} />
                <div className="doughnut-chart-text">
                <span className="doughnut-chart-percentage">{completeRate}%</span>
                <br />
                <span className="doughnut-chart-label">전체 완주율</span>
                </div>
                <div>현재 본인의 완주율은 </div>
            </div>
            {stats !== null && (
                <div className="stats-container">
                <p>완료 횟수: {stats.completionCnt}</p>
                <p>챌린지 횟수: {stats.challengeCnt}</p>
                <p>전체 평균: {stats.allAvg}</p>
                <p>내 전체 평균: {stats.myAllAvg}</p>
                <p>전체 평균보다 {difference}만큼 높습니다</p>
                <p>운동 평균: {stats.exerciseAvg}</p>
                <p>뷰티 평균: {stats.beautyAvg}</p>
                <p>생활 평균: {stats.lifeAvg}</p>
                <p>공부 평균: {stats.studyAvg}</p>
                <p>기타 평균: {stats.etcAvg}</p>
                <p>내 뷰티 평균: {stats.myBeautyAvg}</p>
                <p>내 기타 평균: {stats.myEtcAvg}</p>
                <p>내 운동 평균: {stats.myExerciseAvg}</p>
                <p>내 생활 평균: {stats.myLifeAvg}</p>
                <p>내 공부 평균: {stats.myStudyAvg}</p>
                </div>
            )}
        </>
    )
};

export default MyStatistics;