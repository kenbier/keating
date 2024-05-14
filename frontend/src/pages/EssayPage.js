// EssayForm.js
import React, { useState } from 'react';
import IELTSForm from '../components/IELTSForm';
import styled from 'styled-components';
import LoadingIndicator from '../components/LoadingIndicator';
import { useNavigate } from 'react-router-dom';

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
  const [formData, setFormData] = useState({
    examType: 'IELTS',
    questionType: 'Question 2',
    question: 'Young people are leaving their homes in rural areas to work or study in cities. What are the reasons? Do the advantages of this development outweigh the drawbacks?',
    essay: `The comparison of standards of the cities and small town or villages has been always a debate. Recently, teenagers choose to live in the cities rather than their home villages because of school or job opportunities. This essay will discuss multiple reasons behind this trend and explain why the advantages of being in a city do indeed outweigh its drawbacks.

  There are several reasons to desire living in urban areas. Firstly, it gives people an opportunity to study in better schools which cannot be found in rural areas. Since in the modern world education means very much for people’s future, it is crucial to have higher education degrees for those individuals to find well-paid jobs. In addition to that, city life provides people with completely different experiences than their home villages. Thanks to the schools, work or social gathering places, they get to meet a greater number of people from all around the country compared to their rural towns which is crucial for one’s personal development. Lastly, in the cities, not only they get bigger number of job options, but also they can earn larger amount of money. It is very well know that job market is significantly limited in the villages also the current jobs barely pay enough.
    
  It is clearly seen that benefits of leaving villages outweigh its few number of deficits. It is worth to mention that people face some issues, such as being away from their extended family, more competitive and challenging job market, and substantially more expensive living cost, when they move to the cities. Advantages like learning and exploring new experiences, getting a better education leading to a better paid job and having an interesting career, however, surpass the number of the drawbacks of this development.
    
  To conclude, there are various reasons for young generation to leave their homes to live in the cities and this movement’s benefits easily outweigh its disadvantages.`
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiUrl = `${process.env.REACT_APP_API_URL}`;

    // Your form submission logic
    // Example: Fetch POST request to the backend with form data
    fetch(apiUrl+"/grade", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        onSuccess(data);
        navigate("/graded");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error:', error);
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
