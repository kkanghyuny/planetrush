import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../AuthenticaitionPage/Axiosinstance";

import ChallengeList from "../../components/Lists/ChallengeList";

import "../../styles/SearchPlanet.css";
import "../../App.css";
import { BiSolidLeftArrowCircle } from "react-icons/bi";

const SearchBPlanet = () => {
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [displayedChallenges, setDisplayedChallenges] = useState([]);

  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [hasNext, setHasNext] = useState(true);
  const [lastPlanetId, setLastPlanetId] = useState(null);

  const categories = [
    { label: "운동", value: "EXERCISE" },
    { label: "생활", value: "LIFE" },
    { label: "미용", value: "BEAUTY" },
    { label: "학습", value: "STUDY" },
    { label: "기타", value: "ETC" },
  ];

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/main");
  };

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length !== 3) return "";

    const [year, month, day] = dateArray;

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  // 카테고리 value가 영문으로 되어 있는 것을 다시 label과 매칭시켜주는 과정
  const getCategoryLabel = (value) => {
    const category = categories.find((cat) => cat.value === value);

    return category ? category.label : value;
  };

  // 실제로 백엔드에서 데이터를 가져와 처리하는 과정 (비동기 작업)
  const fetchChallenges = async (
    query = "",
    selectedCategory = "",
    lastPlanetId = null,
    isLoadMore = false
  ) => {
    try {
      const params = {
        size: 10,
        keyword: query || undefined,
        category: selectedCategory || undefined,
        "lp-id": lastPlanetId || undefined,
      };

      const response = await instance.get("/planets", { params });
      const data = response.data.data;

      const planets = data.planets || [];

      // 입력한 키워드나 선태한 카테고리에 따라 결과물을 필터링한다.
      let filteredPlanets = planets.filter((challenge) => {
        const matchesQuery = query
          ? challenge.name.includes(query) || challenge.content.includes(query)
          : true;

        const matchesCategory = selectedCategory
          ? challenge.category === selectedCategory
          : true;

        return matchesQuery && matchesCategory;
      });

      // 카테고리와 날짜는 앞에서 봤듯이 자료 형태의 수정이 필요하므로 수정 과정을 거친다.
      const formattedPlanets = filteredPlanets.map((challenge) => ({
        ...challenge,
        category: getCategoryLabel(challenge.category),
        startDate: formatDate(challenge.startDate),
        endDate: formatDate(challenge.endDate),
      }));

      // 역순으로 바꾸어 가장 최신으로 만들어진 챌린지를 먼저 불러오게 만든다.
      const sortedPlanets = formattedPlanets.sort(
        (a, b) => b.planetId - a.planetId
      );

      if (isLoadMore) {
        setDisplayedChallenges((prevChallenges) => [
          ...prevChallenges,
          ...sortedPlanets,
        ]);
      } else {
        setFilteredChallenges(sortedPlanets);
        setDisplayedChallenges(sortedPlanets);
        setIsSearchPerformed(true);
      }

      if (sortedPlanets.length > 0) {
        setLastPlanetId(sortedPlanets[sortedPlanets.length - 1].planetId);
      }

      setHasNext(data.hasNext);
    } catch (error) {
      console.error(error);
    }
  };

  // 검색어 입력 시마다 상태가 query에 저장되는 형태로 작동
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // 검색 버튼을 클릭하거나 엔터 쳤을 때 실행되는 로직
  const handleSearch = (e) => {
    e.preventDefault();
    setLastPlanetId(null);
    fetchChallenges(query, selectedCategory, null);
    setIsSearchPerformed(true);
  };

  // 카테고리 버튼 클릭
  const handleCategoryClick = (category) => {
    const newCategory = selectedCategory === category ? "" : category;

    setSelectedCategory(newCategory);
    setLastPlanetId(null);
    fetchChallenges(query, newCategory, null);
  };

  const observer = useRef();

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];

      if (target.isIntersecting && hasNext) {
        fetchChallenges(query, selectedCategory, lastPlanetId, true);
      }
    },
    [hasNext, lastPlanetId, query, selectedCategory]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(handleObserver, option);

    const loadMoreElement = document.querySelector(".loadMore");
    if (loadMoreElement) {
      observer.current.observe(loadMoreElement);
    }

    return () => {
      if (observer.current && loadMoreElement) {
        observer.current.unobserve(loadMoreElement);
      }
    };
  }, [handleObserver]);

  return (
    <div>
      <div onClick={handleClick} className="arrowCircleIcon">
        <BiSolidLeftArrowCircle />
      </div>
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
};

export default SearchBPlanet;
