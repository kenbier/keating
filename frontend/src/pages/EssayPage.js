// EssayForm.js
import React, { useState } from 'react';
import IELTSForm from '../components/IELTSForm';
import styled from 'styled-components';
import LoadingIndicator from '../components/LoadingIndicator';


// Container for the entire form

const EssayFormContainer = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  padding: 20px; /* Add padding around the content */
  max-height: 80vh; /* Set maximum height to 100% of the viewport height */
  overflow-y: auto; /* Enable scrolling inside the container if content overflows */
  margin-top: 60px; /* Add space on the top to avoid overlap with the header */

`;

// Label styling for form fields
const FormLabel = styled.label`
  display: block;
  margin: 10px 0;
  font-weight: bold;
  font-size: 16px;
  text-align: left;
`;

// Dropdown for exam type selection
const ExamType = styled.select`
  width: 100%;
  padding: 8px;
  margin: 5px 0 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

// Text displayed when other exam types are selected
const ComingSoonText = styled.p`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
`;
const EssayPage = ({ onSuccess }) => {

  const initialExamType = 'IELTS'
  const [examType, setExamType] = useState(initialExamType);

  const handleInputChange = (event) => {
    setExamType(event.target.value);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <EssayFormContainer>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
        <form>
          <FormLabel htmlFor="examType">Exam Type</FormLabel>
          <ExamType
            name="examType"
            value={examType}
            onChange={handleInputChange}
          >
            <option value="">Select Exam Type</option>
            <option value="IELTS">IELTS</option>
            <option value="TOEFL">TOEFL</option>
            <option value="CAE">CAE</option>
            <option value="OET">OET</option>
            <option value="CPE">CPE</option>
            <option value="TOEIC">TOEIC</option>
            <option value="PTE">PTE</option>
            <option value="IELCA">IELCA</option>
            <option value="Other">Other</option>
          </ExamType>
        </form>
          {examType === 'IELTS' ? (
            <IELTSForm
              examType={examType}
              setIsLoading={setIsLoading}
              onSuccess={onSuccess}
            />
          ) : (
            <ComingSoonText>Coming soon!</ComingSoonText>
          )}
        </>
      )}
    </EssayFormContainer>
  );
};

export default EssayPage;
