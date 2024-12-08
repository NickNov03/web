import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "emailjs-com";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    productName: "", // хранит имя товара
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    product: "",
    quantity: 1,
    paymentMethod: "", // Добавлено поле для способа оплаты
    comments: "",
  });

  const [products, setProducts] = useState([]);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    const selectedProductId = parseInt(e.target.value);
    const selectedProduct = products.find((product) => product.id === selectedProductId);
    
    if (selectedProduct) {
        setFormData({
            ...formData,
            product: selectedProductId, // Сохраняем ID продукта
            productName: selectedProduct.name // Можно сохранить имя отдельно, если нужно
        });
    } else {
        // Если товар не найден, сбрасываем значение
        setFormData({ ...formData, product: "", productName: "" });
    }
};


  const validateName = () => {
    const { firstName, lastName } = formData;
    const isValidName =
      /^[а-яА-ЯёЁ]+$/.test(firstName) && /^[а-яА-ЯёЁ]+$/.test(lastName);
    setNameError(isValidName ? "" : "Пожалуйста, введите только русские буквы");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateName();

    if (!nameError) {
        try {
            // Отправка email через emailjs
            console.log("trying to send");

            // Создайте объект FormData
            const form = e.target; // Получите форму из события
            await emailjs.sendForm(
                "service_fga11wz",
                "template_ecxbrns",
                form, // Используем форму
                "q_600CSHI8IkUtPgoxFOP"
            );

            console.log("Order placed and email sent successfully");

            // Сброс формы после успешной отправки
            setFormData({
                productName: "", // Сбросим и имя товара, если нужно
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                product: "",
                quantity: 1,
                paymentMethod: "",
                comments: "",
            });
            setNameError("");
        } catch (error) {
            console.error("Error placing order:", error);
        }
    }
};


  return (
    <div className="order-form-page">
      <h2>Форма заказа</h2>
      <form className="order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Имя:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={validateName}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Фамилия:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={validateName}
            required
          />
        </div>
        {nameError && <div className="error">{nameError}</div>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Телефон:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Адрес:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product">Товар:</label>
          <select
            id="product"
            name="product"
            value={formData.product}
            onChange={handleProductChange}
            required
          >
            <option value="">Выберите товар</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Количество:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentMethod">Способ оплаты:</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Выберите способ оплаты</option>
            <option value="Наличные">Наличные</option>
            <option value="Кредитная карта">Кредитная карта</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comments">Комментарии:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn-submit">
          Отправить заказ
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
