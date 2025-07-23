'use client';
import React, { useEffect, useState } from 'react';
import { IArticles } from './(models)/article';
import { getArticles } from './(services)/article.service';
import ArticlesListPage from './(shared-components)/articles-list';

const ArticlePage = () => {
    const [data, setData] = useState<IArticles[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const users = await getArticles();
                setData(users);
                setLoading(false);
            } catch (error) {
                console.error('Error retrieving users:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return <ArticlesListPage data={data} loading={loading} setLoading={setLoading} />;
};

export default ArticlePage;
