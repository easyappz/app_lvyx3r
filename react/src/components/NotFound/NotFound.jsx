import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card" data-easytag="id9-react/src/components/NotFound/NotFound.jsx">
      <h2 style={{marginTop:0}}>Страница не найдена (404)</h2>
      <p>Похоже, такой страницы нет.</p>
      <Link to="/" className="button" style={{display:'inline-block', marginTop:8}}>На главную</Link>
    </div>
  );
}
