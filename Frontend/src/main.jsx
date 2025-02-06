import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/darkTheme.css";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store/store.js";
import { Provider } from "react-redux";

// Make environment variables available globally
window.env = {
  API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.VITE_NODE_ENV
};

// Set dark theme by default
document.documentElement.setAttribute('data-theme', 'dark');

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>
);
