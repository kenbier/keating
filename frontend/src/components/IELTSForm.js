// IELTSForm.js
import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IELTS_DEV_FORM_DATA, IELTS_EMPTY_FORM_DATA } from '../constants';

// Define styled components
const Fieldset = styled.fieldset`
  border: none;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin: 10px 0;
  font-weight: bold;
  font-size: 16px;
  text-align: left;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const IELTSForm = ({ examType, setIsLoading, onSuccess }) => {
    const navigate = useNavigate();
    const initialFormData = process.env.REACT_APP_MODE === 'dev' ? IELTS_DEV_FORM_DATA : IELTS_EMPTY_FORM_DATA;

    const validateAndLoadFormData = () => {
        const savedData = localStorage.getItem('ieltsFormData');
        if (!savedData) return initialFormData;

        const parsedData = JSON.parse(savedData);
        const requiredKeys = ['questionType', 'question', 'essay'];
        const isValid = requiredKeys.every(key => key in parsedData && parsedData[key].trim() !== '');

        return isValid ? parsedData : initialFormData;
    };

    const [formData, setFormData] = useState(validateAndLoadFormData);

    // UseEffect to update localStorage when formData changes
    useEffect(() => {
        localStorage.setItem('ieltsFormData', JSON.stringify(formData));
    }, [formData]);


    const onInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };

    const isEmptyString = value => typeof value === 'string' && value.trim() === '';
    const hasEmptyStrings = Object.values(formData).some(isEmptyString);
    const canSubmit = !hasEmptyStrings;

    const handleFormSubmit = (e) => {
        formData['examType'] = examType
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
    <>
      <form onSubmit={handleFormSubmit}>
      <Fieldset>
        <Label htmlFor="questionType">Question Type</Label>
        <Select
          name="questionType"
          value={formData.questionType}
          onChange={onInputChange}
        >
          <option value="">Select Type</option>
          <option value="Question 1">Question 1</option>
          <option value="Question 2">Question 2</option>
        </Select>
      </Fieldset>

      <Fieldset>
        <Label htmlFor="question">Question</Label>
        <Input
          type="text"
          name="question"
          value={formData.question}
          onChange={onInputChange}
          required
        />
      </Fieldset>

      <Fieldset>
        <Label htmlFor="essay">Essay</Label>
        <Textarea
          name="essay"
          rows="10"
          value={formData.essay}
          onChange={onInputChange}
          required
        />
      </Fieldset>
      <Button type="submit" disabled={!canSubmit}>Submit</Button>
      </form>
    </>
  );
};

export default IELTSForm;
