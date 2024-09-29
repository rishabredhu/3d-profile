import React from 'react';
import './App.css';
import DesertSunset from './components/DesertSunset';

/**
 * App Component
 * 
 * This is the main component of the application. It renders the DesertSunset component
 * which is designed to occupy the full viewport.
 * 
 * Note: To ensure the component loads on the entire screen, we've made the following changes:
 * 1. Removed the nested section elements
 * 2. Applied full viewport height and width to the app-container
 * 3. Removed any padding or margin that might prevent full-screen display
 */
const App: React.FC = () => {
  return (
    <div className="app-container" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <DesertSunset />
    </div>
  );
};

export default App;
