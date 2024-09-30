import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import SpaceScene from './components/SpaceScene';
import './App.css';

// Import necessary types from Three.js
import { Vector3 } from 'three';

// Define props interface for SpaceScene
interface SpaceSceneProps {
  scale: Vector3;
  position: Vector3;
}

/**
 * App component
 * 
 * The main component that manages the loading of the LandingPage and Spaceman components.
 * It switches from LandingPage to Spaceman after a simulated loading period.
 */
function App() {
  // State to manage whether the LandingPage has completed loading
  const [isLandingPageLoaded, setIsLandingPageLoaded] = useState(false);

  /**
   * Simulates loading of the LandingPage by setting a timeout.
   * The Spaceman component will be displayed once the LandingPage has completed loading.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLandingPageLoaded(true);
    }, 2000); // Simulates a 2-second loading delay

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, []);

  return (
    <div className="app-container">
      <main className="content-area">
        {/* Render either the LandingPage or the Spaceman component based on loading state */}
        {!isLandingPageLoaded ? (
          <LandingPage />
        ) : (
          <SpaceScene
            scaleVector={new Vector3(1, 1, 1)}
            positionVector={new Vector3(0, 0, 0)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
