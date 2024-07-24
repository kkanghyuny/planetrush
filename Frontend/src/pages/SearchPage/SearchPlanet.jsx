import React, { useState, useEffect, useRef, useCallback } from "react";
import instance from "../AuthenticaitionPage/Axiosinstance";
import ChallengeList from "../../components/Lists/ChallengeList";
import "../../styles/SearchPlanet.css";
import challenges from "./challengesData";
import "../../App.css";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  // 주어진 조건에 따라 필터된 챌린지들
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  // 필터된 챌린지들을 실질적으로 보여주는 형태
  const [displayedChallenges, setDisplayedChallenges] = useState([]);
  // 검색 수행 여부 (T or F)
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  // 검색어 입력 (default는 미입력 상태)
  const [query, setQuery] = useState("");
  // 카테고리 선택 여부
  const [selectedCategory, setSelectedCategory] = useState("");
  // 스크롤을 내렸을 때 다음 페이지가 필요한 지 여부를 알려주는 변수
  const [hasNext, setHasNext] = useState(true);
  // 가장 최근에 만들어진 행성 (latestPlanetId로 바꾸어야 하나 고민중)
  // null로 설정한 이유는 처음 페이지 로드나 처음 검색 시 페이징 처리가 필요하지 않으므로 
  const [lastPlanetId, setLastPlanetId] = useState(null);

  // 백엔드에서 value를 영어로 받고 있어서 labeling을 위한 객체 내 배열들 생성
  const categories = [
    { label: "운동", value: "EXERCISE" },
    { label: "생활", value: "LIFE" },
    { label: "미용", value: "BEAUTY" },
    { label: "학습", value: "STUDY" },
    { label: "기타", value: "ETC" },
  ];

  // useNavigate 훅을 이용하여 이벤트 발생 시 다른 페이지로 넘길 예정
  const navigate = useNavigate();

  // 뒤로 가기 버튼 눌렀을 시 메인 페이지로 보내는 경로 작성
  const handleClick = () => {
    navigate("../main"); // 이동하려는 경로로 변경하세요.
  };

  // 날짜 데이터가 [2023,8,7] 처럼 JSON 파일 형식의 배열로 오고 있어서
  // YYYY-MM-DD 형태로 바꿔주기 위한 과정이다.
  const formatDate = (dateArray) => {
    // 배열에 연, 월, 일 정보가 모두 들어가 있는 지를 확인
    if (!dateArray || dateArray.length !== 3) return "";
    // 배열에 들어간 정보를 순서대로 연, 월, 일에 할당
    const [year, month, day] = dateArray;
    // .padStart(2, '0')을 사용하여 지정된 길이만큼 글자열을 확장하여, 남는 자리는 '0'으로 채운다.
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  // 카테고리 value가 영문으로 되어 있는 것을 다시 label과 매칭시켜주는 과정
  const getCategoryLabel = (value) => {
    // 주어진 조건(카테고리 내 value가 입력된 value와 같은 지)을 만족하는 경우
    // 배열 내 주어진 조건을 만족하는 첫 번쨰 요소를 출력
    const category = categories.find((cat) => cat.value === value);
    return category ? category.label : value; // 매칭되는 label이 없으면 value 그대로 반환
  };

  // 실제로 백엔드에서 데이터를 가져와 처리하는 과정 (비동기 작업)
  const fetchChallenges = async (
    query = "",
    selectedCategory = "",
    lastPlanetId = null,
    isLoadMore = false
  ) => {
    try {
      // 10개씩 받아올꺼고, 입력된 키워드 혹은 선택된 카테고리가 있는 지 확인하고, 불러올 순서의 Id를 입력한다.
      // Default는 keyword가 category가 없는 상태로 하여 검색창을 들어왔을 때 전체 검색 결과가 불러와지게 만들었다.
      const params = {
        size: 10,
        keyword: query || undefined,
        category: selectedCategory || undefined,
        "lp-id": lastPlanetId || undefined,
      };

      // axios를 instance로 만들어서 가져오는 행위 (AxiosInstace.jsx에 존재)
      const response = await instance.get("/planets", { params });
      // 주어진 조건에 맞는 DB 내 자료들의 집합이다.
      const backendChallenges = response.data.data.planets || [];

      // 입력한 키워드나 선태한 카테고리에 따라 결과물을 필터링한다.
      let filteredBackendChallenges = backendChallenges.filter((challenge) => {
        const matchesQuery = query
          ? challenge.name.includes(query) || challenge.content.includes(query)
          : true;
        const matchesCategory = selectedCategory
          ? challenge.category === selectedCategory
          : true;
        return matchesQuery && matchesCategory;
      });

      // 카테고리와 날짜는 앞에서 봤듯이 자료 형태의 수정이 필요하므로 수정 과정을 거친다.
      const formattedChallenges = filteredBackendChallenges.map(
        (challenge) => ({
          ...challenge,
          category: getCategoryLabel(challenge.category),
          startDate: formatDate(challenge.startDate),
          endDate: formatDate(challenge.endDate),
        })
      );

      // 역순으로 바꾸어 가장 최신으로 만들어진 챌린지를 먼저 불러오게 만든다.
      const sortedChallenges = formattedChallenges.sort(
        (a, b) => b.planetId - a.planetId
      );

      // 10개가 보여지면 다음 
      const challengesToShow = sortedChallenges.slice(
        isLoadMore ? displayedChallenges.length : 0,
        isLoadMore ? displayedChallenges.length + 10 : 10
      );


      // 
      if (isLoadMore) {
        setDisplayedChallenges((prevChallenges) => [
          ...prevChallenges,
          ...sortedChallenges,
        ]);
      } else {
        setFilteredChallenges(sortedChallenges);
        setDisplayedChallenges(sortedChallenges);
        setIsSearchPerformed(true);
      }

      if (sortedChallenges.length > 0) {
        setLastPlanetId(sortedChallenges[sortedChallenges.length - 1].planetId);
      }

      setHasNext(response.data.data.hasNext);
    } catch (error) {
      // axios 안 잡힐 때 Dummy data 이용하라고 만들어둔 로직이다
      useDummyChallenges(isLoadMore, query, selectedCategory);
    }
  };

  // 현재 더미데이터를 사용해서 가지고 있는 거고 위와 로직은 똑같아서 이하 생략
  const useDummyChallenges = (isLoadMore, query, selectedCategory) => {
    let filteredDummyChallenges = challenges.filter((challenge) => {
      const matchesQuery = query
        ? challenge.name.includes(query) || challenge.content.includes(query)
        : true;
      const matchesCategory = selectedCategory
        ? challenge.category === selectedCategory
        : true;
      return matchesQuery && matchesCategory;
    });

    let sortedDummyChallenges = filteredDummyChallenges.sort(
      (a, b) => b.planetId - a.planetId
    );

    const dummyChallengesToShow = sortedDummyChallenges.slice(
      isLoadMore ? displayedChallenges.length : 0,
      isLoadMore ? displayedChallenges.length + 10 : 10
    );

    const formattedChallenges = dummyChallengesToShow.map((challenge) => ({
      ...challenge,
      category: getCategoryLabel(challenge.category),
      startDate: formatDate(challenge.startDate),
      endDate: formatDate(challenge.endDate),
    }));

    if (isLoadMore) {
      setDisplayedChallenges((prevChallenges) => [
        ...prevChallenges,
        ...formattedChallenges,
      ]);
    } else {
      setFilteredChallenges(formattedChallenges);
      setDisplayedChallenges(formattedChallenges);
      setIsSearchPerformed(true);
    }

    if (formattedChallenges.length > 0) {
      setLastPlanetId(
        formattedChallenges[formattedChallenges.length - 1].planetId
      );
    }

    setHasNext(
      filteredDummyChallenges.length > displayedChallenges.length + 10
    );
  };
  // 더미데이터 관련 내용 종료


  // 검색어 입력 시마다 상태가 query에 저장되는 형태로 작동
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // 검색 버튼을 클릭하거나 엔터 쳤을 때 실행되는 로직
  // preventdefault로 설정하여 이벤트 처리 전 동작 실행을 막았다.
  // 처음 검색이므로 LastPlanetId도 null로 처리했고
  // fetchChallenge 역시 검색 당시 주어진 query와 category를 기반으로 실행한다.
  const handleSearch = (event) => {
    event.preventDefault();
    setLastPlanetId(null);
    fetchChallenges(query, selectedCategory, null);
    setIsSearchPerformed(true);
  };

  // 카테고리 버튼 클릭
  // 이미 선택되어 있는 거면 취소, 선택하지 않은 거면 카테고리에 반영
  const handleCategoryClick = (category) => {
    const newCategory = selectedCategory === category ? "" : category;
    setSelectedCategory(newCategory);
    setLastPlanetId(null);
    fetchChallenges(query, newCategory, null);
  };

  // 컴포넌트가 리렌더링될 때도 동일한 ref 객체 유지
  // useRef 훅 내의 current라는 속성은 처음에 null로 되어있고, 변경 가능하다.
  // 이 current 속성이 리렌더링 사이에도 값을 유지한다.
  const observer = useRef();

  // 현재 사용자 화면에 지금 보이는 요소가 아니라고 판단될 때 실행되는 콜백함수
  // IntersectionObserver의 콜백함수로 작동함
  const handleObserver = useCallback(
    (entries) => {
      // entires[0] === .loadMore
      // entries엔 관찰된 모든 요소가 담긴다.
      const target = entries[0];
      // 타겟 데이터가 존재하고 hasNext가 true인, 즉 다음 데이터가 존재할 경우 fetchChallenges 실행
      if (target.isIntersecting && hasNext) {
        fetchChallenges(query, selectedCategory, lastPlanetId, true);
      }
    },
    [hasNext, lastPlanetId, query, selectedCategory]
  );

  // 컴포넌트가 마운트될 때 IntersectionObserver 설정, 언마운트될 때 정리
  useEffect(() => {
    // root: 관찰을 수행할 뷰포트, null일 경우 기본 뷰포트 사용
    // rootMargin: 뷰포트 마진 설정
    // threshold: 타겟 요소가 뷰포트에 얼마나 나타났을 때 콜백을 호출할 지를 결정하는 요소, 1.0은 100%를 뜻함
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    observer.current = new IntersectionObserver(handleObserver, option);

    // loadMoreElement는 .loadMore 클래스를 가진 요소를 선택한다.
    // .loadMore는 하나의 리스트가 끝날 때마다 등장한다.
    const loadMoreElement = document.querySelector(".loadMore");
    // 이걸 관찰하라고 설정
    if (loadMoreElement) {
      observer.current.observe(loadMoreElement);
    }

    // return은 정리함수(clean-up)
    // 컴포넌트가 언마운트 되거나 useEffect가 다시 실행될 경우 호출된다.
    return () => {
      if (observer.current && loadMoreElement) {
        observer.current.unobserve(loadMoreElement);
      }
    };
  }, [handleObserver]);

  return (
    <div>
      {/* 이모티콘 클릭 시 메인 페이지로 */}
      <div onClick={handleClick} className="arrowCircleIcon">
        <BiSolidLeftArrowCircle />
      </div>
      {/* 모양으로 봤을 때 검색 버튼이랑 검색창이랑 하나의 div로 감싸져야 figma처럼 보일 것 같았음 */}
      <div className="searchRegion">
        <form className="search" onSubmit={handleSearch}>
          <input
            className="searchInput"
            type="text"
            placeholder="챌린지 이름으로 검색"
            value={query}
            onChange={handleInputChange}
          />
          <button className="submitButton" type="submit"></button>
        </form>
      </div>

      <div className="categoryButtons">
        {/* db에 있는 value와 우리가 front에서 보여주고 싶은 label이 달라서 생기는 문제 */}
        {categories.map((category) => (
          <button
            className={`cateButton ${
              selectedCategory === category.value ? "selected" : ""
            }`}
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="resultsContainer">
        {isSearchPerformed || selectedCategory !== "" ? (
          filteredChallenges.length > 0 ? (
            <>
              <h3>검색 결과</h3>
              <ChallengeList
                challenges={displayedChallenges}
                displayedChallenges={displayedChallenges}
              />
              <div className="loadMore"></div>
            </>
          ) : (
            <>
              <h3>검색 결과</h3>
              <h4>검색한 결과가 존재하지 않습니다.</h4>
            </>
          )
        ) : (
          <>
            <h3>전체 챌린지 목록</h3>
            <ChallengeList
              challenges={displayedChallenges}
              displayedChallenges={displayedChallenges}
            />
            <div className="loadMore"></div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
