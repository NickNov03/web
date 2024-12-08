import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./elements/Header";
import Footer from "./elements/Footer";
import News from "./elements/News";
import Catalog from "./elements/Catalog";
import Delivery from "./elements/Delivery";
import Contacts from "./elements/Contacts";
import OrderForm from "./elements/OrderForm";
import LoginPage from "./elements/LoginPage";
import AdminPanel from "./elements/AdminPanel";
import PrivateRoute from "./elements/PrivateRoute";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <section className="section">
                    <News />
                  </section>
                  <section className="section">
                    <Catalog />
                  </section>
                  <section className="section">
                    <Delivery />
                  </section>
                  <section className="section">
                    <Contacts />
                  </section>
                </>
              }
            />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
};

export default App;