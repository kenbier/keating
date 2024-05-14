import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import styled from 'styled-components';


const StyledApp = styled.div`
  background: linear-gradient(to right, #f2e8df, #f9f4e8);
  padding: 20px;
  min-height: 100vh;
  display: flex; /* Add display: flex */
  justify-content: center; /* Center content vertically */
  align-items: center; /* Center content horizontally */
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
const auth0_domain = `${process.env.REACT_APP_AUTH0_DOMAIN}`;
const auth0_client_id = `${process.env.REACT_APP_AUTH0_CLIENT_ID}`;

root.render(
  <StyledApp>
  <React.StrictMode>
    <Auth0Provider
      domain={auth0_domain} 
      clientId={auth0_client_id} 
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
  </StyledApp>
);

reportWebVitals();
