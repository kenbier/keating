// About.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 60%;
  margin: auto;
  padding: 20px;
  text-align: center;
  background-color: #f2f4f6; // Pleasant light background color
  color: #000; // Black text
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 50px; // Adjusts the top margin for vertical centering
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
`;

const Content = styled.p`
  font-size: 18px;
  line-height: 1.6;
`;

const About = () => {
  return (
    <Container>
      <Title>About</Title>
      <Content>
        Welcome to our application! We aim to provide a seamless experience for users by offering grading
        services with comprehensive feedback. Our team is passionate about helping you achieve your goals and
        improve your skills. Thank you for being a part of our journey!
      </Content>
    </Container>
  );
};

export default About;
