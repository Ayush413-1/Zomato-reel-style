import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/user/login`, {
        email,
        password
      }, { withCredentials: true });

      console.log(response.data);
      setErrorMessage('');
      navigate("/");
    } catch (error) {
      const message = error?.response?.data?.message || 'Invalid email or password.';
      setErrorMessage(message);
    }

  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errorMessage && <p className="auth-error-message">{errorMessage}</p>}
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className='newaccount'>
        <div className="auth-alt-action">
          <a href="/user/register">Create account</a>
        </div>
        <div className="auth-alt-action">
        <a href="/food-partner/login">Login as Restaurant</a> 
        </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;