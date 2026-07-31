import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodPartnerLogin = () => {

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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/food-partner/login`, {
        email,
        password
      }, { withCredentials: true });

      console.log(response.data);
      setErrorMessage('');
      navigate("/create-food");
    } catch (error) {
      const message = error?.response?.data?.message || 'Invalid email or password.';
      setErrorMessage(message);
    }

  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errorMessage && <p className="auth-error-message">{errorMessage}</p>}
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className='newaccount'>
        <div className="auth-alt-action">
          <a href="/food-partner/register">Create an new account</a>
        </div>
        <div className="auth-alt-action">
          <a href="/user/login">Login as User</a>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;