import React, { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [challenges] = useState([
    {
      id: 1,
      planetImage: "path/to/planet1.jpg",
      planetName: "Mars",
      challengeName: "React Challenge",
      date: "2024-07-18",
    },
    {
      id: 2,
      planetImage: "path/to/planet2.jpg",
      planetName: "Venus",
      challengeName: "JavaScript Challenge",
      date: "2024-07-19",
    },
    {
      id: 3,
      planetImage: "path/to/planet3.jpg",
      planetName: "Earth",
      challengeName: "CSS Challenge",
      date: "2024-07-20",
    },
    {
      id: 4,
      planetImage: "path/to/planet4.jpg",
      planetName: "Jupiter",
      challengeName: "HTML Challenge",
      date: "2024-07-21",
    },
    {
      id: 5,
      planetImage: "path/to/planet5.jpg",
      planetName: "Saturn",
      challengeName: "Node.js Challenge",
      date: "2024-07-22",
    },
    {
      id: 6,
      planetImage: "path/to/planet6.jpg",
      planetName: "Mercury",
      challengeName: "Python Challenge",
      date: "2024-07-23",
    },
    {
      id: 7,
      planetImage: "path/to/planet7.jpg",
      planetName: "Neptune",
      challengeName: "Java Challenge",
      date: "2024-07-24",
    },
    {
      id: 8,
      planetImage: "path/to/planet8.jpg",
      planetName: "Uranus",
      challengeName: "Pycharm Challenge",
      date: "2024-07-25",
    },
  ]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const results = challenges.filter((challenge) =>
      challenge.challengeName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredChallenges(results);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="하고 싶은 챌린지를 검색해주세요"
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit">검색</button>
      </form>
      <div>
        <h3>전체 챌린지 목록:</h3>
        <ul>
          {challenges.map((challenge) => (
            <li className="challengeList" key={challenge.id}>
              <img
                src={challenge.planetImage}
                alt={challenge.planetName}
                width={50}
              />
              <span>{challenge.planetName}</span>
              <span>{challenge.challengeName}</span>
              <span>{challenge.date}</span>
            </li>
          ))}
        </ul>
      </div>
      {filteredChallenges.length > 0 && (
        <div>
          <h3>검색 결과:</h3>
          <ul>
            {filteredChallenges.map((challenge) => (
              <li key={challenge.id}>
                <img
                  src={challenge.planetImage}
                  alt={challenge.planetName}
                  width={50}
                />
                <span>{challenge.planetName}</span>
                <span>{challenge.challengeName}</span>
                <span>{challenge.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
