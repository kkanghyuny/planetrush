import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import instance from "../AuthenticaitionPage/Axiosinstance";
import "../../styles/SearchPlanet.css";

// SearchBar 컴포넌트
function SearchBar() {
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [displayedChallenges, setDisplayedChallenges] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const [lastPlanetId, setLastPlanetId] = useState(null);

  // Date yyyy-mm-dd 형태로 보이게 변경
  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length !== 3) return "";
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  // 10개씩 해당 데이터 받아온다.
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

      console.log("Request Params:", params);

      const response = await instance.get("/planets", { params });
      console.log("Response Data:", response.data.data);

      const backendChallenges = response.data.data.planets || [];

      const formattedChallenges = backendChallenges.map((challenge) => ({
        ...challenge,
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

      setHasNext(response.data.data.hasNext);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      if (!isLoadMore) {
        setFilteredChallenges([]);
        setDisplayedChallenges([]);
      }
    }
  };

  // 검색창 입력
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // 검색창에 입력 전에는 반영 안 되게 막는다.
  const handleSearch = (event) => {
    event.preventDefault();
    setLastPlanetId(null);
    fetchChallenges(query, selectedCategory, null);
    setIsSearchPerformed(true);
  };

  // 카테고리 클릭
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
    const loadMoreElement = document.querySelector("#load-more");
    if (loadMoreElement) {
      observer.current.observe(loadMoreElement);
    }

    return () => {
      if (observer.current && loadMoreElement) {
        observer.current.unobserve(loadMoreElement);
      }
    };
  }, [handleObserver]);

  const categories = [
    { label: "운동", value: "EXERCISE" },
    { label: "생활", value: "LIFE" },
    { label: "미용", value: "BEAUTY" },
    { label: "학습", value: "STUDY" },
    { label: "기타", value: "ETC" },
  ];

  // 리팩토링 이전
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="챌린지 이름, 카테고리, 행성 이름으로 검색"
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit">검색</button>
      </form>

      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
            style={{
              backgroundColor:
                selectedCategory === category.value ? "blue" : "grey",
              color: "white",
              margin: "5px",
              padding: "10px",
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="results-container">
        {isSearchPerformed || selectedCategory !== "" ? (
          filteredChallenges.length > 0 ? (
            <>
              <h3>검색 결과</h3>
              <ul className="results-list">
                {displayedChallenges.map((challenge) => (
                  <li className="challengeList" key={challenge.planetId}>
                    <img
                      className="challengeImg"
                      src={challenge.planetImg}
                      alt={challenge.name}
                      width={50}
                    />
                    <ul className="challengeExp">
                      <li>{challenge.category}</li>
                      <li>{challenge.name}</li>
                      <li>{challenge.content}</li>
                      <li>
                        {challenge.startDate} ~ {challenge.endDate}
                      </li>
                      <li>
                        {challenge.currentParticipants} /{" "}
                        {challenge.maxParticipants}
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
              <div id="load-more"></div>
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
            <ul className="results-list">
              {displayedChallenges.map((challenge) => (
                <li className="challengeList" key={challenge.planetId}>
                  <div className="challengeImgArea">
                    <img
                      className="challengeImg"
                      src={challenge.planetImg}
                      alt={challenge.name}
                      width={50}
                    />
                    <div className="participantsNumber">
                      {challenge.currentParticipants} /{" "}
                      {challenge.maxParticipants}
                    </div>
                  </div>
                  <div>
                    <ul className="challengeExp">
                      <li>{challenge.category}</li>
                      <li>{challenge.name}</li>
                      <li>{challenge.content}</li>
                      <li>
                        <div class="date_participant">
                          {challenge.startDate} ~ {challenge.endDate} |{" "}
                          {challenge.currentParticipants} /{" "}
                          {challenge.maxParticipants}
                        </div>
                      </li>
                      <li>
                        {challenge.currentParticipants} /{" "}
                        {challenge.maxParticipants}
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
            <div id="load-more"></div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
