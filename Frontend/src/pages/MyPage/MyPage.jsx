import React from 'react';
import ChallengeList from '../../components/Lists/ChallengeList'; // ChallengeList 컴포넌트 임포트
import challenges from '../SearchPage/challengesData'; // challenges 데이터 임포트
import LogoutButton from "../../components/Button/LogoutButton"; // 로그아웃 버튼 컴포넌트 임포트


function MyPage() {
    return (
        <>
            <h1>마이 페이지</h1>
            <LogoutButton />
            <h3>행성 몇 개나 있을까?</h3>
        </>
    );
}

export default MyPage;
