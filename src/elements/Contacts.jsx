import React, { useState, useEffect } from "react";

const Contacts = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <section className="contacts">
      <h2>Контакты</h2>
      <p>Наш адрес: г. Пермь, ул. Букирева, д. 15</p>
      <p>Телефон: +7 (909) 726-26-47</p>
      <p>Email: vacuum.cleaners.perm@gmail.com</p>
      <p>Часы работы:</p>
      <ul>
        <li>Понедельник - Пятница: с 10:00 до 20:00</li>
        <li>Суббота: с 10:00 до 18:00</li>
        <li>Воскресенье: выходной</li>
      </ul>
      {location && (
        <div>
          <h3>Ваше текущее местоположение:</h3>
          <p>Широта: {location.latitude}</p>
          <p>Долгота: {location.longitude}</p>
        </div>
      )}
    </section>
  );
};

export default Contacts;