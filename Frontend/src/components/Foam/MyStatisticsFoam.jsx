import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import useStatisticsStore from "../../store/statisticsStore";  // 추가
import '../../styles/Mypage.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MyStatistics = () => {
    const setStatistics = useStatisticsStore((state) => state.setStatistics); // 상태 업데이트 함수 가져오기

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

                // zustand 스토어에 challengeCnt와 completionCnt 저장
                setStatistics(statsData.challengeCnt, statsData.completionCnt);
            } catch (error) {
                throw error;
            }
        };

        fetchStats();
    }, [setStatistics]);

    let completeRate = stats.challengeCnt === 0 ? 0 : ((stats.completionCnt / stats.challengeCnt) * 100).toFixed(2);
    completeRate = Math.max(0, Math.min(completeRate, 100));
    
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
        cutout: "70%",
        plugins: {
            tooltip: {
                enabled: false,
            },
        },
    };

    const createBarData = (myAvg, avg) => {
        return {
            labels: ['나의 평균', '전체 평균'],
            datasets: [
                {
                    label: '',
                    data: [myAvg, avg],
                    backgroundColor: ['#31fff3', '#ffeb79'],
                    borderWidth: 1,
                    barThickness: 15,
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
                    display: false,
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
            },
            scales: {
                y: {
                    min: min,
                    max: max,
                }
            }
        };
    };

    const categories = [
        { title: "전체", myAvg: stats.myTotalAvg, avg: stats.totalAvg, percentage: stats.myTotalPer },
        { title: "운동", myAvg: stats.myExerciseAvg, avg: stats.exerciseAvg, percentage: stats.myExercisePer },
        { title: "뷰티", myAvg: stats.myBeautyAvg, avg: stats.beautyAvg, percentage: stats.myBeautyPer },
        { title: "생활", myAvg: stats.myLifeAvg, avg: stats.lifeAvg, percentage: stats.myLifePer },
        { title: "공부", myAvg: stats.myStudyAvg, avg: stats.studyAvg, percentage: stats.myStudyPer },
        { title: "기타", myAvg: stats.myEtcAvg, avg: stats.etcAvg, percentage: stats.myEtcPer },
    ];

    return (
        <>
            <div className="doughnut-chart-container">
                <Doughnut className="doughnut-canvas" data={doughnutData} options={doughnutOptions} />
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
                    {categories.map((category, index) => (
                        <div key={index} className="bar-chart-container">
                            <h3 className="category-title">{category.title}</h3>
                            {category.percentage !== 0 ? (
                                <>
                                    <Bar data={createBarData(category.myAvg, category.avg)} options={createBarOptions(category.myAvg, category.avg)} />
                                    <p>내 평균은 상위 <span className="text-color">{category.percentage}%</span>입니다.</p>
                                </>
                            ) : (
                                <p>참여한 행성이 없습니다.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MyStatistics;
