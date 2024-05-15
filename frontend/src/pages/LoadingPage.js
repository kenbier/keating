import React from 'react';
import styled, { keyframes } from 'styled-components';
import logo from '../assets/logo_1.png'; // Ensure the path is correct

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 1s linear infinite; /* Adjusted for faster spinning */
  margin-top: 20px;
`;

const StyledLogo = styled.img`
  width: 100px;
  margin-top: 20px;
`;

const LoadingPage = () => {
  return (
    <Container>
      <h1>Keating AI</h1>
      <Spinner />
      <StyledLogo src={logo} alt="Logo" />
    </Container>
  );
};

export default LoadingPage;
