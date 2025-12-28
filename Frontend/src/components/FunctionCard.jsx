// src/components/FunctionCard.jsx
import React from 'react';
import '../styles/FunctionCard.css'; // Sẽ tạo ở Bước 3

const FunctionCard = ({ title, description, imageUrl, linkTo }) => {
  return (
    <div className="function-card" onClick={() => window.location.href = linkTo}>
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={title} className="card-image"/>
      </div>
      <div className="card-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FunctionCard;
