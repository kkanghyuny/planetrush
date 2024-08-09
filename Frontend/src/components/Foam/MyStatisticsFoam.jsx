import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

import '../../styles/Mypage.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MyStatistics = () => {
    const [stats, setStats] = useState({
        completionCnt: null,
        challengeCnt: null,
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
        myTotalAvg: null,
        myTotalPer: null,
        totalAvg: null,
        myExercisePer: null,
        myBeautyPer: null,
        myLifePer: null,
        myStudyPer: null,
        myEtcPer: null,
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

    const doughnutData = {
        datasets: [
            {
                data: [completeRate, 100 - completeRate],
                backgroundColor: ["#31fff3", "rgba(255,255,255,0.7)"],
                borderWidth: 0,
            },
        ],
    };

    const doughnutOptions = {
        cutout: "70%", // 도넛 차트의 두께를 설정합니다.
        plugins: {
            tooltip: {
                enabled: false, // 툴팁을 비활성화합니다.
            },
        },
    };

    const createBarData = (myAvg, avg) => {
        return {
            labels: ['나의 평균', '전체 평균'],
            datasets: [
                {
                    label: '평균',
                    data: [myAvg, avg],
                    backgroundColor: ['#31fff3', '#ffeb79'],
                    borderWidth: 1,
                    barThickness: 20, // 막대의 두께를 조절
                },
            ],
        };
    };

    const createBarOptions = (myAvg, avg) => {
        const minValue = Math.min(myAvg, avg);
        const maxValue = Math.max(myAvg, avg);
        const min = Math.max(0, minValue - 10);
        const max = Math.min(100, maxValue + 10);

        return {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '카테고리별 평균 비교',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    align: 'end',
                    anchor: 'end',
                },
            },
            scales: {
                y: {
                    min: min,
                    max: max,
                }
            }
        };
    };

    return (
        <>
            <div className="doughnut-chart-container">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="doughnut-chart-text">
                    <span className="doughnut-chart-percentage">{completeRate}%</span>
                    <br />
                    <span className="doughnut-chart-label">완주율</span>
                </div>
            </div>
            {stats && (
                <div className="stats-container">
                    <div className="cnt-container">
                        <p>완료 횟수 <span className="text-color">{stats.completionCnt}</span> 회</p>
                        <p>챌린지 횟수 <span className="text-color">{stats.challengeCnt}</span> 회</p>
                    </div>
                    <div className="bar-chart-container">
                        <Bar data={createBarData(stats.myTotalAvg, stats.totalAvg)} options={createBarOptions(stats.myTotalAvg, stats.totalAvg)} />
                        <p>내 평균은 상위 <span className="text-color">{stats.myTotalPer}%</span>입니다.</p>
                    </div>
                    <div className="bar-chart-container">
                        <h3>운동</h3>
                        <Bar data={createBarData(stats.myExerciseAvg, stats.exerciseAvg)} options={createBarOptions(stats.myExerciseAvg, stats.exerciseAvg)} />
                        <p>내 평균은 상위 <span className="text-color">{stats.myExercisePer}%</span>입니다.</p>
                    </div>
                    <div className="bar-chart-container">
                        <h3>뷰티</h3>
                        <Bar data={createBarData(stats.myBeautyAvg, stats.beautyAvg)} options={createBarOptions(stats.myBeautyAvg, stats.beautyAvg)} />
                        <p>내 평균은 상위 <span className="text-color">{stats.myBeautyPer}%</span>입니다.</p>
                    </div>
                    <div className="bar-chart-container">
                        <h3>생활</h3>
                        <Bar data={createBarData(stats.myLifeAvg, stats.lifeAvg)} options={createBarOptions(stats.myLifeAvg, stats.lifeAvg)} />
                        <p>내 평균은 상위 <span className="text-color">{stats.myLifePer}%</span>입니다.</p>
                    </div>
                    <div className="bar-chart-container">
                        <h3>공부</h3>
                        <Bar data={createBarData(stats.myStudyAvg, stats.studyAvg)} options={createBarOptions(stats.myStudyAvg, stats.studyAvg)} />
                        <p>내 평균은 상위 <span className="text-color">{stats.myStudyPer}%</span>입니다.</p>
                    </div>
                    <div className="bar-chart-container">
                        <h3>기타</h3>
                        <Bar data={createBarData(stats.myEtcAvg, stats.etcAvg)} options={createBarOptions(stats.myEtcAvg, stats.etcAvg)} />
                        <p>내 평균은 상위 <span className="text-color">{stats.myEtcPer}%</span>입니다.</p>
                    </div>
                </div>
            )}
        </>
    )
};

export default MyStatistics;
