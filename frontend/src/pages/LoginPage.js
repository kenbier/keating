import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../assets/logo_1.png';

// TODO make this mobile responsive

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <img src={logo} alt="Keating Logo" style={{ width: '100px', margin: '20px auto' }} />
      <h1>Welcome to Keating AI</h1>
      <button 
        onClick={loginWithRedirect} 
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#61DAFB',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          marginTop: '20px', // Added margin-top for spacing
          width: '350px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' // Added box shadow for 3D effect
        }}
      >
        Log In
      </button>
    </div>
  );
};

export default LoginPage;
