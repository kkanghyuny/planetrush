import React, { useState, useEffect, useRef, useCallback } from 'react'; 
// React와 관련된 훅들을 가져옵니다. (훅은 컴포넌트 최상위 레벨에서 호출 가능, 반복문이나 조건문 안에서 호출 불가)
import "../../styles/SearchPlanet.css"; 
// CSS 파일을 가져옵니다.
import challenges from './challengesData'; 
// 더미 데이터를 가져옵니다.

// SearchBar 컴포넌트
function SearchBar() {

  // 컴포넌트가 실행될 때 챌린지를 초기화시킨다.
  useEffect(() => {
    resetChallenges();
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 합니다.

  // 챌린지 내역을 초기화합니다.
  const resetChallenges = () => {
    setAfterFilterChallenges(challenges); // 필터링된 챌린지를 전체 챌린지로 설정합니다.
    setDisplayedChallenges(challenges.slice(0, 3)); // 처음 3개의 챌린지를 화면에 표시합니다.
    setCurrentIndex(3); // 현재 인덱스를 3으로 설정합니다.
    setIsSearchPerformed(false); // 검색 수행 여부를 false로 설정합니다.
  };

  const [afterFilterChallenges, setAfterFilterChallenges] = useState(challenges); 
  // 필터링된 챌린지 목록을 저장하는 상태입니다.
  const [displayedChallenges, setDisplayedChallenges] = useState(challenges.slice(0, 3)); 
  // 화면에 표시되는 챌린지 목록을 저장하는 상태입니다.
  const [currentIndex, setCurrentIndex] = useState(3); 
  // 현재 표시된 챌린지의 인덱스를 저장하는 상태입니다.
  const [isSearchPerformed, setIsSearchPerformed] = useState(false); 
  // 검색 수행 여부를 저장하는 상태입니다.


  const [query, setQuery] = useState(''); 
  // 검색어를 저장하는 상태입니다. (useState는 state와 state를 다른 값으로 업데이트하고 리렌더링을 촉발하는 setState로 구성)
  const [selectedCategory, setSelectedCategory] = useState(''); 
  // 선택된 카테고리를 저장하는 상태입니다.



  const observer = useRef(); 
  // IntersectionObserver를 저장하는 ref입니다. 렌더링에 필요하지 않은 값을 참조할 수 있다.


  const handleInputChange = (event) => {
    setQuery(event.target.value); // 검색어가 변경될 때 상태를 업데이트합니다.
  };

  // 검색창 제어
  const handleSearch = (event) => {
    event.preventDefault(); // 폼의 기본 제출 동작을 막습니다.
    performSearch(query, selectedCategory); // 검색을 수행합니다.
  };

  //// 검색 수행
  const performSearch = (query, category) => {
    const results = filterChallenges(query, category); // 검색어와 카테고리에 따라 챌린지를 필터링합니다.
    setAfterFilterChallenges(results); // 필터링된 챌린지를 상태로 설정합니다.
    setDisplayedChallenges(results.slice(0, 3)); // 처음 3개의 챌린지를 화면에 표시합니다.
    setCurrentIndex(3); // 현재 인덱스를 3으로 설정합니다.
    setIsSearchPerformed(true); // 검색 수행 여부를 true로 설정합니다.
  };

  //// 카테고리 클릭
  const handleCategoryClick = (category) => {
    const newCategory = selectedCategory === category ? '' : category; // 선택된 카테고리를 토글합니다.
    setSelectedCategory(newCategory); // 선택된 카테고리를 상태로 설정합니다.
    performSearch(query, newCategory); // 검색어와 새 카테고리에 따라 검색을 수행합니다.
  };

  //// 챌린지 필터링하기
  const filterChallenges = (query, category) => {
    const lowerCaseQuery = query.toLowerCase(); 
    // 검색어를 소문자로 변환합니다.
    const sortedChallenges = challenges.sort((a, b) => b.planetId - a.planetId); 
    // 챌린지를 최신 순으로 정렬합니다.
    return sortedChallenges.filter((challenge) =>
      (challenge.name.toLowerCase().includes(lowerCaseQuery) ||
        challenge.category.toLowerCase().includes(lowerCaseQuery)) && 
        // 챌린지 이름이나 카테고리가 검색어를 포함하는지 확인합니다.
      (category === '' || challenge.category === category) 
      // 카테고리가 선택되지 않았거나 챌린지 카테고리가 선택된 카테고리와 일치하는지 확인합니다.
    );
  };

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    
    observer.current = new IntersectionObserver(handleObserver, option); 
    // IntersectionObserver(callback, options);
    // callback: 관찰 대상 요소의 교차 상태가 변경될 때 호출되는 함수입니다. 이 함수는 2개의 매개변수를 받습니다.
    const loadMoreElement = document.querySelector('#load-more'); // #load-more 요소를 선택합니다.
    if (loadMoreElement) {
      observer.current.observe(loadMoreElement); // #load-more 요소를 관찰합니다.
    }

    return () => {
      if (observer.current && loadMoreElement) {
        observer.current.unobserve(loadMoreElement); // 컴포넌트가 언마운트될 때 관찰을 중지합니다.
      }
    };
  }, [handleObserver]); // handleObserver가 변경될 때마다 이 useEffect가 실행됩니다.

  const loadMoreChallenges = () => {
    const nextChallenges = afterFilterChallenges.slice(currentIndex, currentIndex + 3); 
    // 필터링한 챌린지 중 다음 3개의 챌린지를 가져옵니다.
    setDisplayedChallenges(prevChallenges => [...prevChallenges, ...nextChallenges]); 
    // 가져온 3개의 챌린지를 기존에 있던 챌린지 다음에 추가로 보여줍니다.
    setCurrentIndex(currentIndex + 3); 
    // 다음 3개를 가져올 준비를 하기 위해 Index를 3 늘려놓는다.
  };

  //// 행성 목록 보여주는 스크롤이 끝에 닿을 때
  const handleObserver = useCallback((entries) => {
    const target = entries[0]; // 관찰 대상의 첫 번째 항목을 가져옵니다.
    if (target.isIntersecting) { // 대상이 교차하면
      loadMoreChallenges(); // 더 많은 챌린지를 로드합니다.
    }
  }, [currentIndex, afterFilterChallenges]); 
  // currentIndex와 filteredChallenges가 변경될 때마다 이 콜백이 변경됩니다.




  const categories = [
    { label: '운동', value: 'EXERCISE' },
    { label: '생활', value: 'LIFE' },
    { label: '미용', value: 'BEAUTY' },
    { label: '학습', value: 'STUDY' },
    { label: '기타', value: 'ETC' }
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
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
            style={{
              backgroundColor: selectedCategory === category.value ? 'blue' : 'grey',
              color: 'white',
              margin: '5px',
              padding: '10px'
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="results-container">
        {isSearchPerformed || selectedCategory !== '' ? ( // 검색 수행 여부나 카테고리가 선택된 경우
          afterFilterChallenges.length > 0 ? ( // 필터링된 챌린지가 있는 경우
            <>
              <h3>검색 결과</h3>
              <ul className="results-list">
                {displayedChallenges.map((challenge) => (
                  <li className='challengeList' key={challenge.planetId}>
                    <img className='challengeImg' src={challenge.planetImg} alt={challenge.name} width={50} />
                    <ul className='challengeExp'>
                      <li>{challenge.category}</li>
                      <li>{challenge.name}</li>
                      <li>{challenge.content}</li>
                      <li>{challenge.startDate}</li>
                      <li>{challenge.endDate}</li>
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
        ) : ( // 검색 수행 여부가 false이고 카테고리가 선택되지 않은 경우
          <>
            <h3>전체 챌린지 목록</h3>
            <ul className="results-list">
              {displayedChallenges.map((challenge) => (
                <li className='challengeList' key={challenge.planetId}>
                  <img className='challengeImg' src={challenge.planetImg} alt={challenge.name} width={50} />
                  <ul className='challengeExp'>
                    <li>{challenge.category}</li>
                    <li>{challenge.name}</li>
                    <li>{challenge.content}</li>
                    <li>{challenge.startDate}</li>
                    <li>{challenge.endDate}</li>
                  </ul>
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
