import React, { useState, useEffect } from "react";
import axios from "axios";
import NewsItem from "./NewsItem";
import "../App.css";

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/api/news");
        setNewsData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to fetch news");
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) return <p>Loading news...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="news">
      <h2>Новости</h2>
      <div className="news-grid">
        {newsData.map((news) => (
          <NewsItem key={news.id} title={news.title} content={news.content} />
        ))}
      </div>
    </section>
  );
};

export default News;