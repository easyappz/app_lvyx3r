import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await register({ name, email, password });
      setSuccess('Регистрация успешно завершена. Теперь войдите.');
      setTimeout(()=>navigate('/login'), 700);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Ошибка регистрации';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
  };

  return (
    <div className="card" data-easytag="id7-react/src/components/Auth/Register.jsx">
      <h2 style={{marginTop:0}}>Регистрация</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Имя</label>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Иван" />
        </div>
        <div className="form-row">
          <label>Почта</label>
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-row">
          <label>Пароль</label>
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="минимум 6 символов" />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <div style={{display:'flex', gap:12, marginTop:8}}>
          <button className="button" type="submit">Создать аккаунт</button>
          <Link to="/login" className="button secondary">Войти</Link>
        </div>
      </form>
    </div>
  );
}
