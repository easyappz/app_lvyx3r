import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/profile');
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Ошибка авторизации';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
  };

  return (
    <div className="card" data-easytag="id6-react/src/components/Auth/Login.jsx">
      <h2 style={{marginTop:0}}>Вход</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Почта</label>
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-row">
          <label>Пароль</label>
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <div className="error">{error}</div>}
        <div style={{display:'flex', gap:12, marginTop:8}}>
          <button className="button" type="submit">Войти</button>
          <Link to="/register" className="button secondary">Регистрация</Link>
        </div>
      </form>
    </div>
  );
}
