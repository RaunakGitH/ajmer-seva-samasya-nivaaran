
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root');

// Ensure the root element exists
if (!container) {
  console.error('Root element not found! Make sure there is a div with id "root" in your HTML.');
} else {
  const root = createRoot(container);
  
  try {
    root.render(<App />);
  } catch (error) {
    console.error('Failed to render the application:', error);
    // Display a simple error message to the user
    container.innerHTML = '<div style="padding: 20px; color: red;">There was an error loading the application. Please check the console for details.</div>';
  }
}
