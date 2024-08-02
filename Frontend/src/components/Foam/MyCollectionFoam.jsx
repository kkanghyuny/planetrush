import { useState, useEffect } from 'react';
import instance from '../../pages/AuthenticaitionPage/Axiosinstance';

const MyCollection = () => {
    const [collections, setCollections] = useState([]);

    const handleShowCollection = async () => {
        try {
            const response = await instance.get("/members/collections");
            const data = response.data.data
            return data;
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const collectionsData = await handleShowCollection();
                setCollections(collectionsData);
            } catch (error) {
                throw error
            }
        };

        fetchCollections();
    }, []);

    return (
        <>
            <div>
                {collections.length > 0 ? (
                    collections.map((collection, index) => (
                        <div key={index}>
                            <h2>{collection.name}</h2>
                            <p>{collection.category}</p>
                            <p>{collection.content}</p>
                            <div>
                                {/* 개인 완주율 70% 미만이면 색을 바꿀까 고민중 (민트에서 빨강으로)*/}
                                {collection.progress}
                            </div>
                            <img src={collection.imageUrl} alt={collection.name} />
                        </div>
                    ))
                ) : (
                    <p>콜렉션이 없습니다.</p>
                )}
            </div>    
        </>
    )   
};

export default MyCollection;