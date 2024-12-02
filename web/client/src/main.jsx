import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./variables.css";
import "./i18n.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import UserProvider from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
  // </StrictMode>
);
