import React from "react";
import "../App.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>
        Цена: {product.price} {product.currency}
      </p>
    </div>
  );
};

export default ProductCard;