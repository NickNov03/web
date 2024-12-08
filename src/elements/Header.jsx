import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Clock from "./Clock";
import logoImage from "./cleaner1.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("ru-RU", options);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
        <img 
          src={logoImage} 
          alt="Logo" 
          width="40" 
          height="40" 
          className="logo-img" 
        />
        </Link>
      </div>
      <Clock />

      <div className="clock">{formattedDate}</div>

      <div className={`burger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div
        className={`overlay ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      ></div>
      <nav className={`navigation ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={toggleMenu}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/order" onClick={toggleMenu}>
              Форма заказа
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/admin" onClick={toggleMenu}>
                  Админ панель
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={toggleMenu}>
                  Вход
                </Link>
              </li>
            </>
          )}
        </ul>
        <button className="close-btn" onClick={toggleMenu}>
          <FaTimes />
        </button>
      </nav>
    </header>
  );
};

export default Header;