import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EssayPage from './pages/EssayPage';
import GradedEssayPage from './pages/GradedEssayPage';
import NotFound from './pages/NotFoundPage';
import About from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import MenuDrawer from './components/MenuDrawer';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import LoadingPage from './pages/LoadingPage';
import ErrorPopup from './components/ErrorPopup';


const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [loading, setLoading] = useState(true);

  // State to store the graded essay
  const [gradedEssay, setGradedEssay] = React.useState(null);

  // Function to handle grading success
  const handleGradingSuccess = (essay) => {
    setGradedEssay(essay);
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <ErrorPopup></ErrorPopup>
      <Router>
        {isAuthenticated && <MenuDrawer />}
        {loading ? (
          <LoadingPage />
        ) : (
          <Routes>
            {isAuthenticated ? (
            <>
              <Route path="/" element={<EssayPage onSuccess={handleGradingSuccess} />} />
              <Route path="/graded" element={<GradedEssayPage gradedEssay={gradedEssay} />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </>
            ) : (
              <Route path="/" element={<LoginPage />} />
            )}
            {/* Add other routes here */}
          </Routes>
        )}
      </Router>
    </>
  );
};

export default App;
