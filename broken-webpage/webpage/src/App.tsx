import React from 'react';
import './App.css';
import Portfolio from './components/Portfolio';
// import MysticalLandscape from './components/theme1/Landscape';
// import Landscape from './components/theme1/Landscape';
import AuroraEffect from './components/AuroraParticle';
/**
 * App Component
 * 
 * This is the main component of the application. It renders the Portfolio component
 * within a Canvas from @react-three/fiber, which provides a 3D rendering context for Three.js.
 * It also includes the RevolvingText component with the text "Available for Hire".
 */
const App: React.FC = () => {
  return (
    <div className="app-container">
        {/* <Chatbot /> */}
        {/* <ParticleSystem /> */}
        {/* <AuroraEffect /> */}
        <Portfolio />
        {/* <MysticalLandscape /> */}
        {/* <Landscape /> */}
    </div>
  );
};

export default App;
