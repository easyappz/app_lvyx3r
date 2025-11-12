import React, { useEffect } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home/index.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Profile from './components/Profile/Profile.jsx';
import NotFound from './components/NotFound/NotFound.jsx';

function App() {
  useEffect(() => {
    const routes = ['/', '/login', '/register', '/profile', '*'];
    if (typeof window.handleRoutes === 'function') {
      window.handleRoutes(routes);
    }
  }, []);

  return (
    <div className="app-shell" data-easytag="id1-react/src/App.jsx">
      <header className="header" data-easytag="id2-react/src/App.jsx">
        <div className="header-inner">
          <div className="brand">Simple Apple-like</div>
          <nav className="nav">
            <NavLink to="/" end>Главная</NavLink>
            <NavLink to="/profile">Профиль</NavLink>
            <AuthLinks />
          </nav>
        </div>
      </header>
      <main className="container" data-easytag="id3-react/src/App.jsx">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer" data-easytag="id4-react/src/App.jsx">© {new Date().getFullYear()} Simple</footer>
    </div>
  );
}

function AuthLinks() {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    return (
      <button className="button secondary" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
        Выйти
      </button>
    );
  }
  return (
    <>
      <NavLink to="/login">Войти</NavLink>
      <NavLink to="/register">Регистрация</NavLink>
    </>
  );
}

export default App;
