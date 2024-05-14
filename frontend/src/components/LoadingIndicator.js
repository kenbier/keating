// LoadingIndicator.js
import styled, { keyframes } from 'styled-components';

// Keyframes for the spinning animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
`;

const LoadingSpinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 18px;
  color: #333;
`;

const LoadingIndicator = () => (
  <LoadingContainer>
    <LoadingSpinner />
    <LoadingText>Loading, please wait...</LoadingText>
  </LoadingContainer>
);

export default LoadingIndicator;
