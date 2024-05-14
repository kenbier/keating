import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EssayPage from './pages/EssayPage';
import GradedEssayPage from './pages/GradedEssayPage';
import NotFound from './pages/NotFoundPage';
import About from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import MenuDrawer from './components/MenuDrawer';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated } = useAuth0();

  // State to store the graded essay
  const [gradedEssay, setGradedEssay] = React.useState(null);

  // Function to handle grading success
  const handleGradingSuccess = (essay) => {
    setGradedEssay(essay);
  };

  return (
    <Router>
      {isAuthenticated && <MenuDrawer />}
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<EssayPage onSuccess={handleGradingSuccess} />} />
            <Route path="/graded" element={<GradedEssayPage gradedEssay={gradedEssay} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <Route path="*" element={<LoginPage />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
