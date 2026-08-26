import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { LogisticsProvider } from './context/LogisticsContext';
import { DemoWalkthroughProvider } from './context/DemoWalkthroughContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LogisticsProvider>
      <DemoWalkthroughProvider>
        <App />
      </DemoWalkthroughProvider>
    </LogisticsProvider>
  </React.StrictMode>
);
