
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupMockApi } from './api/mockApiService';

// Initialize the mock API service
setupMockApi();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
