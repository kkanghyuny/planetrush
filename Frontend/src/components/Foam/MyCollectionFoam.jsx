import { useState, useEffect } from 'react';
import instance from '../../pages/AuthenticaitionPage/Axiosinstance';
import "../../styles/MyCollection.css";
import useCategoryStore from "../../store/categoryLabelStore";

const MyCollection = () => {
    const [collections, setCollections] = useState([]);
    const getCategoryLabel = useCategoryStore((state) => state.getCategoryLabel);

    const handleShowCollection = async () => {
        try {
            const response = await instance.get("/members/collections");
            const data = response.data.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const collectionsData = await handleShowCollection();
                setCollections(collectionsData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCollections();
    }, []);

    return (
        <div className="my-collection">
            {collections.length > 0 ? (
                collections.map((collection, index) => (
                    <div key={index} className="collection-item">
                        <div>
                            <img className="collection-img" src={collection.imageUrl} alt={collection.name} />
                        </div>
                        <div className="collection-info">
                            <div className="name-box">
                                <p className="collection-cate">{getCategoryLabel(collection.category)}</p>
                                <p>{collection.name}</p>
                            </div>
                            <h4 className="collection-content">{collection.content}</h4>
                            <div className="progress-info">
                                <div className="progress-bar-container">
                                    <div
                                        className={`progress-bar ${collection.progress < 70 ? 'low-progress' : 'normal-progress'}`}
                                        style={{ width: `${collection.progress}%` }}
                                    ></div>
                                </div>
                                <div className='collection-number'>
                                    {collection.progress} %
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>콜렉션이 없습니다.</p>
            )}
        </div>
    );
};

export default MyCollection;
