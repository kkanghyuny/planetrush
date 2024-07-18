import React, { useState, useEffect } from "react";
import "../../styles/SearchPlanet.css";
import axios from "axios";
import challenges from "./challengesData"; // 더미 데이터 불러오기

function SearchBar() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(
        "http://70.12.114.73:8080/api/v1/planets",
        {
          params: {
            size: 5,
            category: selectedCategory,
            keyword: query,
          },
        }
      );
      const backendChallenges = response.data;
      const combinedChallenges = [...backendChallenges, ...challenges];
      setAllChallenges(combinedChallenges);
      setFilteredChallenges(combinedChallenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const filterChallenges = (query, category) => {
    const lowerCaseQuery = query.toLowerCase();
    return allChallenges.filter(
      (challenge) =>
        (challenge.challengeName.toLowerCase().includes(lowerCaseQuery) ||
          challenge.challengeCate.toLowerCase().includes(lowerCaseQuery) ||
          challenge.planetName.toLowerCase().includes(lowerCaseQuery)) &&
        (category === "" || challenge.challengeCate === category)
    );
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const results = filterChallenges(query, selectedCategory);
    setFilteredChallenges(results);
  };

  const handleCategoryClick = (category) => {
    const newCategory = selectedCategory === category ? "" : category;
    setSelectedCategory(newCategory);
    const results = filterChallenges(query, newCategory);
    setFilteredChallenges(results);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const categories = [
    { label: "운동", value: "exercise" },
    { label: "생활", value: "life" },
    { label: "미용", value: "cosmetic" },
    { label: "학습", value: "learning" },
    { label: "기타", value: "etc" },
  ];

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

      {filteredChallenges.length > 0 ? (
        <div>
          <h3>검색 결과:</h3>
          <ul>
            {filteredChallenges.map((challenge) => (
              <li className="challengeList" key={challenge.id}>
                <img
                  className="challengeImg"
                  src={challenge.planetImage}
                  alt={challenge.planetName}
                  width={50}
                />
                <ul className="challengeExp">
                  <li>{challenge.challengeCate}</li>
                  <li>{challenge.planetName}</li>
                  <li>{challenge.challengeName}</li>
                  <li>{challenge.startDate}</li>
                  <li>{challenge.endDate}</li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : query !== "" || selectedCategory !== "" ? (
        <div>
          <h3>검색 결과:</h3>
          <h4>일치하는 검색 결과가 존재하지 않습니다.</h4>
        </div>
      ) : null}

      <div>
        <h3>전체 챌린지 목록:</h3>
        <ul>
          {allChallenges.map((challenge) => (
            <li className="challengeList" key={challenge.id}>
              <img
                className="challengeImg"
                src={challenge.planetImage}
                alt={challenge.planetName}
                width={50}
              />
              <ul className="challengeExp">
                <li>{challenge.challengeCate}</li>
                <li>{challenge.planetName}</li>
                <li>{challenge.challengeName}</li>
                <li>{challenge.startDate}</li>
                <li>{challenge.endDate}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchBar;
