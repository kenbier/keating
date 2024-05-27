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

/*
  return (
    <div>
    <Container>
      <Section>
        <SectionTitle>Score</SectionTitle>
        <TextDiv><pre>{gradedEssay.score}</pre></TextDiv>
      </Section>

      <Section>
          <SectionTitle>Original Essay</SectionTitle>
          <TextDiv><pre>{gradedEssay.original}</pre></TextDiv>
        </Section>

        <Section>
          <SectionTitle>Corrected Essay</SectionTitle>
          <TextDiv dangerouslySetInnerHTML={{ __html: gradedEssay.corrected}}></TextDiv>
        </Section>

      <Section>
          <SectionTitle>Grammar Corrections and Explanations</SectionTitle>
          <ul>
            {gradedEssay.explanations.map((exp, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: exp}} />
            ))}
          </ul>
        </Section>

      <Section>
        <SectionTitle> Sample edits and suggestions (Experimental)</SectionTitle>
        <TextDiv><pre>{gradedEssay.questions}</pre></TextDiv>
      </Section>

    </Container>
    <Button onClick={handleTryAgain}>Try Again</Button>
    </div>
  );
};
*/


  return (
    <div>
    <Container>
      <Section>
        <SectionTitle>Score</SectionTitle>
        <TextDiv><pre>{gradedEssay.score}</pre></TextDiv>
      </Section>

      <Section>
        <SectionTitle> Sample edits and suggestions (Experimental)</SectionTitle>
        <TextDiv><pre>{gradedEssay.questions}</pre></TextDiv>
      </Section>

      <Section>
          <SectionTitle>Original Essay</SectionTitle>
          <TextDiv><pre>{gradedEssay.original}</pre></TextDiv>
        </Section>

        <Section>
          <SectionTitle>Corrected Essay</SectionTitle>
          <TextDiv dangerouslySetInnerHTML={{ __html: gradedEssay.corrected }}></TextDiv>
        </Section>


      <Section>
          <SectionTitle>Grammar Corrections and Explanations</SectionTitle>
          <ul>
            {gradedEssay.explanations.map((exp, index) => (
              <li key={index}>
                <b>Original:</b> {exp.original} <br />
                <b>Correction:</b> {exp.correction.join(', ')} <br />
                <b>Explanation:</b> {exp.explanation}
              </li>
            ))}
          </ul>
        </Section>

    </Container>
    <Button onClick={handleTryAgain}>Try Again</Button>
    </div>
  );
};

export default GradedEssayPage;
