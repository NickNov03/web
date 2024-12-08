import React from "react";
import "../App.css";

const NewsItem = ({ title, content }) => {
  return (
    <div className="news-item">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

export default NewsItem;