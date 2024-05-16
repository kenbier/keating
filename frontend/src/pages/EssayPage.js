// EssayForm.js
import React, { useState } from 'react';
import IELTSForm from '../components/IELTSForm';
import styled from 'styled-components';
import LoadingIndicator from '../components/LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DEV_FORM_DATA, EMPTY_FORM_DATA } from '../constants';


// Container for the entire form
const EssayFormContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;  /* This ensures the form uses the entire height of its container */

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
  const initialFormData = process.env.REACT_APP_MODE === 'dev' ? DEV_FORM_DATA : EMPTY_FORM_DATA;
  const [formData, setFormData] = useState(initialFormData);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isEmptyString = value => typeof value === 'string' && value.trim() === '';
  const hasEmptyStrings = Object.values(formData).some(isEmptyString);
  const canSubmit = !hasEmptyStrings;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);


    const apiUrl = `${process.env.REACT_APP_API_URL}`;

    // Your form submission logic
    // Example: Fetch POST request to the backend with form data
    fetch(apiUrl + "/grade", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then((response) => {
      if (!response.ok) {
        // If the server response is not OK, throw an error with the status text
        return response.json().then(err => {
          throw new Error(err.message || `HTTP error: ${response.statusText}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      setIsLoading(false);
      onSuccess(data);
      navigate("/graded");
    })
    .catch((error) => {
      setIsLoading(false);
      // Display the error message via toast
      toast.error(`Error: ${error.message}`, {
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
      });
    });
  };

  return (
    <EssayFormContainer>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <form onSubmit={handleFormSubmit}>
          <FormLabel htmlFor="examType">Exam Type</FormLabel>
          <ExamType
            name="examType"
            value={formData.examType}
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

          {formData.examType === 'IELTS' ? (
            <IELTSForm
              onInputChange={handleInputChange}
              essayData={formData}
              canSubmit={canSubmit}
            />
          ) : (
            <ComingSoonText>Coming soon!</ComingSoonText>
          )}
        </form>
      )}
    </EssayFormContainer>
  );
};

export default EssayPage;
