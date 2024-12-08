import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [admins, setAdmins] = useState([]); // состояние для хранения списка администраторов
  const [editingAdmin, setEditingAdmin] = useState(null); // состояние для редактируемого администратора
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" }); // состояние для нового администратора
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    date_published: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchNews();
    fetchOrders();
    fetchAdmins();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/products", {
        withCredentials: true,
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/news", {
        withCredentials: true,
      });
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/orders", {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/logout",
        {},
        { withCredentials: true }
      );
      sessionStorage.removeItem("isAuthenticated");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/products", newProduct, {
        withCredentials: true,
      });
      setNewProduct({ name: "", description: "", price: "", image_url: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/api/products/${editingProduct.id}`,
        editingProduct,
        { withCredentials: true }
      );
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/products/${id}`, {
        withCredentials: true,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/news", newNews, {
        withCredentials: true,
      });
      setNewNews({ title: "", content: "", date_published: "" });
      fetchNews();
    } catch (error) {
      console.error("Error adding news:", error);
    }
  };

  const handleEditNews = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/api/news/${editingNews.id}`,
        editingNews,
        { withCredentials: true }
      );
      setEditingNews(null);
      fetchNews();
    } catch (error) {
      console.error("Error editing news:", error);
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/news/${id}`, {
        withCredentials: true,
      });
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/orders/${id}`, {
        withCredentials: true,
      });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };



  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/admins", {
        withCredentials: true,
      });
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };


  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/api/admin/register",
        newAdmin,
        { withCredentials: true }
      );
      setNewAdmin({ username: "", password: "" });
      fetchAdmins(); // обновление списка администраторов после добавления
    } catch (error) {
      console.error("Ошибка при добавлении администратора:", error);
    }
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/api/admins/${editingAdmin.id}`,
        editingAdmin,
        { withCredentials: true }
      );
      setEditingAdmin(null); // сброс редактируемого администратора
      fetchAdmins(); // обновление списка администраторов
    } catch (error) {
      console.error("Ошибка при редактировании администратора:", error);
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/admins/${id}`, {
        withCredentials: true,
      });
      fetchAdmins(); // обновление списка администраторов после удаления
    } catch (error) {
      console.error("Ошибка при удалении администратора:", error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Панель администратора</h2>
      <button onClick={handleLogout} className="admin-button">
        Выйти
      </button>

      <div className="admin-section">
        <h3>Товары</h3>
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Название"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Описание"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Цена"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="URL изображения"
            value={newProduct.image_url}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image_url: e.target.value })
            }
          />
          <button type="submit">Добавить товар</button>
        </form>
        <ul className="admin-list">
          {products.map((product) => (
            <li key={product.id} className="admin-list-item">
              {editingProduct && editingProduct.id === product.id ? (
                <form onSubmit={handleEditProduct}>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={editingProduct.image_url}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        image_url: e.target.value,
                      })
                    }
                  />
                  <button type="submit">Сохранить</button>
                  <button onClick={() => setEditingProduct(null)}>
                    Отмена
                  </button>
                </form>
              ) : (
                <>
                  {product.name}
                  <div>
                    <button
                      className="admin-button"
                      onClick={() => setEditingProduct(product)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="admin-button delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-section">
        <h3>Новости</h3>
        <form onSubmit={handleAddNews}>
          <input
            type="text"
            placeholder="Заголовок"
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
          />
          <textarea
            placeholder="Содержание"
            value={newNews.content}
            onChange={(e) =>
              setNewNews({ ...newNews, content: e.target.value })
            }
          />
          <input
            type="date"
            value={newNews.date_published}
            onChange={(e) =>
              setNewNews({ ...newNews, date_published: e.target.value })
            }
          />
          <button type="submit">Добавить новость</button>
        </form>
        <ul className="admin-list">
          {news.map((item) => (
            <li key={item.id} className="admin-list-item">
              {editingNews && editingNews.id === item.id ? (
                <form onSubmit={handleEditNews}>
                  <input
                    type="text"
                    value={editingNews.title}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, title: e.target.value })
                    }
                  />
                  <textarea
                    value={editingNews.content}
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        content: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    value={editingNews.date_published}
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        date_published: e.target.value,
                      })
                    }
                  />
                  <button type="submit">Сохранить</button>
                  <button onClick={() => setEditingNews(null)}>Отмена</button>
                </form>
              ) : (
                <>
                  {item.title}
                  <div>
                    <button
                      className="admin-button"
                      onClick={() => setEditingNews(item)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="admin-button delete"
                      onClick={() => handleDeleteNews(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-section">
        <h3>Заказы</h3>
        <ul className="admin-list">
          {orders.map((order) => (
            <li key={order.id} className="admin-list-item">
              <div>
                <p>
                  <strong>Имя:</strong> {order.first_name} {order.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Телефон:</strong> {order.phone}
                </p>
                <p>
                  <strong>Адрес:</strong> {order.address}, {order.city},{" "}
                  {order.state} {order.zip}
                </p>
                <p>
                  <strong>Товар:</strong> ID {order.product_id}, Количество:{" "}
                  {order.quantity}
                </p>
                <p>
                  <strong>Итоговая цена:</strong> ${order.total_price}
                </p>
                <p>
                  <strong>Комментарии:</strong> {order.comments}
                </p>
                <p>
                  <strong>Дата заказа:</strong>{" "}
                  {new Date(order.order_date).toLocaleString()}
                </p>
              </div>
              <div>
                <button
                  className="admin-button delete"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>






      {/* Секция для добавления нового администратора */}
      <div className="admin-section">
        <h3>Добавить нового администратора</h3>
        <form onSubmit={handleAddAdmin}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={newAdmin.username}
            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
          <button type="submit">Добавить администратора</button>
        </form>
      </div>

      {/* Секция для просмотра и редактирования существующих администраторов */}
      <div className="admin-section">
        <h3>Список администраторов</h3>
        <ul className="admin-list">
          {admins.map((admin) => (
            <li key={admin.id} className="admin-list-item">
              {editingAdmin && editingAdmin.id === admin.id ? (
                <form onSubmit={handleEditAdmin}>
                  <input
                    type="text"
                    value={editingAdmin.username}
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, username: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, password: e.target.value })
                    }
                  />
                  <button type="submit">Сохранить</button>
                  <button onClick={() => setEditingAdmin(null)}>Отмена</button>
                </form>
              ) : (
                <>
                  <span>{admin.username}</span>
                  <div>
                    <button
                      className="admin-button"
                      onClick={() => setEditingAdmin(admin)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="admin-button delete"
                      onClick={() => handleDeleteAdmin(admin.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>




    </div>

    
  );
};

export default AdminPanel;