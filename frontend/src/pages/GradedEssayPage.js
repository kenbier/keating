import React, { useState, useEffect } from 'react';
import styled, {keyframes} from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Define the spin keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Define the Spinner styled component
const Spinner = styled.div`
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite;
`;

// Define styled components
const Container = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  padding: 20px; /* Add padding around the content */
  max-height: 70vh; /* Set maximum height to 100% of the viewport height */
  overflow-y: auto; /* Enable scrolling inside the container if content overflows */
  margin-top: 60px; /* Add space on the top to avoid overlap with the header */

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
  margin: 20px auto;
  display: block;
  &:hover {
    background-color: #4b55c3;
  }
`;

const GradedEssayPage = ({ gradedEssay }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedGradedEssay, setDetailedGradedEssay] = useState(null);

  useEffect(() => {
    if (!gradedEssay) {
      navigate('/');
      return;
    }
    const fetchDetailedGradedEssay = async () => {
      try {
        const response = await fetch('/correct', {  // Adjust the URL as needed
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ essay: gradedEssay.original })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDetailedGradedEssay(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedGradedEssay();
  }, [gradedEssay, navigate]);

  const handleTryAgain = () => {
    navigate('/');
  };

  if (!gradedEssay) {
    return null; // Temporarily render nothing until redirect completes
  }

  return (
    <div>
      <Container>
        <Section>
          <SectionTitle>Score</SectionTitle>
          <TextDiv><pre>{gradedEssay.score}</pre></TextDiv>
        </Section>

        {loading ? (
          <Section>
            <SectionTitle>Loading fully edited essay, can take some time...</SectionTitle>
            <Spinner />
            <TextDiv>Loading corrected essay and explanations...</TextDiv>
          </Section>
        ) : error ? (
          <Section>
            <SectionTitle>Edited Essay</SectionTitle>
            <TextDiv>Error: {error.message}</TextDiv>
          </Section>
        ) : (
          <>
            <Section>
              <SectionTitle>Corrected Essay</SectionTitle>
              <TextDiv dangerouslySetInnerHTML={{ __html: detailedGradedEssay.corrected }}></TextDiv>
            </Section>
          </>
        )}

        <Section>
          <SectionTitle>Sample suggestions and study material (Experimental)</SectionTitle>
          <TextDiv><pre>{gradedEssay.questions}</pre></TextDiv>
        </Section>
      </Container>

      <Button onClick={handleTryAgain}>Try Again</Button>
    </div>
  );
};

export default GradedEssayPage;
