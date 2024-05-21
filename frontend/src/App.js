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
import {trackEvent} from './util.js';


const App = () => {
  const { isAuthenticated, isLoading, user, getIdTokenClaims} = useAuth0();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const trackUserEvent = async () => {
      if (isAuthenticated && user) {
        const claims = await getIdTokenClaims();
        const isSignup = claims['https://trykeating.com/signup'];

        const eventData = {
          event_name: isSignup ? 'Signup' : 'Login',
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: window.location.href,
          user_data: {
            em: user.email,
            client_user_agent: navigator.userAgent
          },
        };
        trackEvent(eventData);
      }
    };
    trackUserEvent();
  }, [isAuthenticated, user, getIdTokenClaims]);


  useEffect(() => {
    if (isAuthenticated) {
      const eventData = {
        event_name: 'Login',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: window.location.href,
        user_data: {
            em: user.email,
            client_user_agent: navigator.userAgent
        },
    };
      trackEvent(eventData);
    }
  }, [isAuthenticated, user]);


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
