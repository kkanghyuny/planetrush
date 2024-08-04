import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../AuthenticaitionPage/Axiosinstance";

import ChallengeList from "../../components/Lists/ChallengeList";

import "../../styles/SearchPlanet.css";
import "../../App.css";
import { BiSolidLeftArrowCircle } from "react-icons/bi";

const SearchPlanet = () => {
  const navigate = useNavigate();

  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [displayedChallenges, setDisplayedChallenges] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const [lastPlanetId, setLastPlanetId] = useState(null);
  const [recommends, setRecommends] = useState([]);

  const categories = [
    { label: "운동", value: "EXERCISE" },
    { label: "생활", value: "LIFE" },
    { label: "미용", value: "BEAUTY" },
    { label: "학습", value: "STUDY" },
    { label: "기타", value: "ETC" },
  ];

  const handleClick = () => {
    navigate("/main");
  };

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length !== 3) return "";

    const [year, month, day] = dateArray;
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return formattedDate;
  };

  const getCategoryLabel = (value) => {
    const category = categories.find((cat) => cat.value === value);
    return category ? category.label : value;
  };

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
      let filteredPlanets = planets.filter((challenge) => {
        const matchesQuery = query
          ? challenge.name.includes(query) || challenge.content.includes(query)
          : true;
        const matchesCategory = selectedCategory
          ? challenge.category === selectedCategory
          : true;
        return matchesQuery && matchesCategory;
      });

      const formattedPlanets = filteredPlanets.map((challenge) => ({
        ...challenge,
        category: getCategoryLabel(challenge.category),
        startDate: formatDate(challenge.startDate),
        endDate: formatDate(challenge.endDate),
      }));

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
      console.error("Failed to fetch challenges", error);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLastPlanetId(null);
    fetchChallenges(query, selectedCategory, null);
    setIsSearchPerformed(true);
  };

  const handleCategoryClick = async (category) => {
    const newCategory = selectedCategory === category ? "" : category;

    setSelectedCategory(newCategory);
    setLastPlanetId(null);
    fetchChallenges(query, newCategory, null);

    if (newCategory) {
      try {
        const response = await instance.get("/recommend/keyword", {
          params: { category: newCategory },
        });
        const data = response.data.data;
        setRecommends(data);
      } catch (error) {
        throw error;
      }
    } else {
      setRecommends([]);
    }
  };

  const handleRecommendClick = (keyword) => {
    fetchChallenges(keyword, selectedCategory, null);
    setIsSearchPerformed(true);
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
      <div onClick={handleClick} className="arrow-circle-icon">
        <BiSolidLeftArrowCircle />
      </div>
      <div className="search-region">
        <form className="search" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder="챌린지 이름으로 검색"
            value={query}
            onChange={handleInputChange}
          />
          <button className="submit-button" type="submit"></button>
        </form>
      </div>

      <div className="category-buttons">
        {categories.map((category) => (
          <button
            className={`category-button ${
              selectedCategory === category.value ? "selected" : ""
            }`}
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {recommends.length > 0 && (
        <div className="recommend-container">
          <h4>추천 검색어:</h4>
          <ul className="recommend-list">
            {recommends.map((recommend, index) => (
              <li
                key={index}
                onClick={() => handleRecommendClick(recommend.keyword)}
              >
                {recommend.keyword}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="results-container">
        {isSearchPerformed || selectedCategory !== "" ? (
          filteredChallenges.length > 0 ? (
            <>
              <ChallengeList
                challenges={displayedChallenges}
                displayedChallenges={displayedChallenges}
              />
              <div className="loadMore"></div>
            </>
          ) : (
            <>
              <h4>검색한 결과가 존재하지 않습니다.</h4>
            </>
          )
        ) : (
          <>
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

export default SearchPlanet;
