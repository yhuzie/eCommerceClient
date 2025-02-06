import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './custom.scss';


// Find the root DOM node where the app will be rendered
const container = document.getElementById('root');

// Create a root using createRoot and render the App component
const root = createRoot(container);
root.render(<App />);