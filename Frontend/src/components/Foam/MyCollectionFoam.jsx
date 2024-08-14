import { useState, useEffect, useRef, useCallback } from "react";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";
import "../../styles/MyCollection.css";
import useCategoryStore from "../../store/categoryLabelStore";

const MyCollection = () => {
  const [collections, setCollections] = useState([]);
  const [hasNext, setHasNext] = useState(true);
  const [lastPlanetId, setLastPlanetId] = useState(null);
  const observer = useRef();
  const getCategoryLabel = useCategoryStore((state) => state.getCategoryLabel);

  const fetchCollections = async (lastPlanetId = null, isLoadMore = false) => {
    try {
      const params = {
        size: 10,
        "lh-id": lastPlanetId || undefined,
      };
      const response = await instance.get("/members/collections", { params });
      const data = response.data.data;
      const planets = data.planetCollection || [];

      if (isLoadMore) {
        setCollections((prevCollections) => [...prevCollections, ...planets]);
      } else {
        setCollections(planets);
      }

      if (planets.length > 0) {
        setLastPlanetId(planets[planets.length - 1].historyId);
      }
      setHasNext(data.hasNext);
    } catch (error) {
      console.error("Failed to fetch collections", error);
    }
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNext) {
        fetchCollections(lastPlanetId, true);
      }
    },
    [hasNext, lastPlanetId]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(handleObserver, option);
    const loadMoreElement = document.querySelector(".loadMore");
    if (loadMoreElement) observer.current.observe(loadMoreElement);

    return () => {
      if (observer.current && loadMoreElement) {
        observer.current.unobserve(loadMoreElement);
      }
    };
  }, [handleObserver]);

  return (
    <div className="my-collection">
      {collections.length > 0 ? (
        collections.map((collection, index) => (
          <div key={index} className="collection-item">
            <div>
              <img
                className="collection-img"
                src={collection.imageUrl}
                alt={collection.name}
              />
            </div>
            <div className="collection-info">
              <div className="name-box">
                <p className="collection-cate">
                  {getCategoryLabel(collection.category)}
                </p>
                <p>{collection.name}</p>
              </div>
              <h4 className="collection-content">{collection.content}</h4>
              <div className="progress-info">
                <div className="progress-bar-container">
                  <div
                    className={`progress-bar ${
                      collection.progress < 70
                        ? "low-progress"
                        : "normal-progress"
                    }`}
                    style={{ width: `${collection.progress}%` }}
                  ></div>
                </div>
                <div className="collection-number">{collection.progress} %</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>콜렉션이 없습니다.</p>
      )}
      <div className="loadMore"></div>
    </div>
  );
};

export default MyCollection;
