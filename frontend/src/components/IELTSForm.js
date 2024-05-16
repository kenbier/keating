// IELTSForm.js
import React from 'react';
import styled from 'styled-components';

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

const IELTSForm = ({ onInputChange, essayData, canSubmit }) => {
  return (
    <>
      <Fieldset>
        <Label htmlFor="questionType">Question Type</Label>
        <Select
          name="questionType"
          value={essayData.questionType}
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
          value={essayData.question}
          onChange={onInputChange}
          required
        />
      </Fieldset>

      <Fieldset>
        <Label htmlFor="essay">Essay</Label>
        <Textarea
          name="essay"
          rows="10"
          value={essayData.essay}
          onChange={onInputChange}
          required
        />
      </Fieldset>


      <Button type="submit" disabled={!canSubmit}>Submit</Button>
    </>
  );
};

export default IELTSForm;
