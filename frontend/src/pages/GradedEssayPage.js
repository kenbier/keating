import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Define styled components
const Container = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-weight: bold;
  text-align: left;
`;

const TextDiv = styled.div`
  font-size: 16px;
  margin: 10px 0;
  text-align: left;
  width: 100%; // Ensure it doesn't exceed parent container width
  font-family: Arial, sans-serif;

  pre {
    word-wrap: break-word; // Allow breaking words if too long
    white-space: pre-wrap; // Keep whitespace and line breaks
    overflow-wrap: break-word; // Ensure long words are wrapped
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #5c67f2;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  &:hover {
    background-color: #4b55c3;
  }
`;

// Functional component
const GradedEssayPage = ({ gradedEssay }) => {
  const navigate = useNavigate();

  // Redirect if gradedEssay is null
  useEffect(() => {
    if (!gradedEssay) {
      navigate('/');
    }
  }, [gradedEssay, navigate]);

  const handleTryAgain = () => {
    navigate('/');
  };

  if (!gradedEssay) {
    return null; // Temporarily render nothing until redirect completes
  }

  return (
    <Container>
      <Section>
        <SectionTitle>Score</SectionTitle>
        <TextDiv><pre>{gradedEssay.score}</pre></TextDiv>
      </Section>

      <Section>
        <SectionTitle>Questions</SectionTitle>
        <TextDiv><pre>{gradedEssay.questions}</pre></TextDiv>
      </Section>

      <Button onClick={handleTryAgain}>Try Again</Button>
    </Container>
  );
};

export default GradedEssayPage;
