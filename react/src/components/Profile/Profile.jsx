import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, changePassword } from '../../api/profile';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    (async () => {
      try {
        const data = await getProfile();
        setName(data.name || '');
        setEmail(data.email || '');
      } catch (err) {
        const detail = err?.response?.data?.detail || 'Не удалось загрузить профиль';
        setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await updateProfile({ name, email });
      setName(data.name);
      setEmail(data.email);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Не удалось сохранить профиль';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    try {
      const res = await changePassword({ old_password: oldPassword, new_password: newPassword });
      setPwdMsg(res.message || 'Пароль изменён');
      setOldPassword(''); setNewPassword('');
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Не удалось изменить пароль';
      setPwdMsg(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
  };

  if (loading) return <div data-easytag="id8-react/src/components/Profile/Profile.jsx">Загрузка...</div>;

  return (
    <div className="card" data-easytag="id8-react/src/components/Profile/Profile.jsx">
      <h2 style={{marginTop:0}}>Профиль</h2>
      {error && <div className="error" style={{marginBottom:12}}>{error}</div>}
      <form onSubmit={onSaveProfile} style={{marginBottom:20}}>
        <div className="form-row">
          <label>Имя</label>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Почта</label>
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <button className="button" type="submit">Сохранить</button>
      </form>

      <h3>Смена пароля</h3>
      <form onSubmit={onChangePassword}>
        <div className="form-row">
          <label>Старый пароль</label>
          <input className="input" type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Новый пароль</label>
          <input className="input" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
        </div>
        {pwdMsg && <div className={pwdMsg.includes('не') || pwdMsg.includes('ош') ? 'error' : 'success'}>{pwdMsg}</div>}
        <button className="button" type="submit">Изменить пароль</button>
      </form>
    </div>
  );
}
