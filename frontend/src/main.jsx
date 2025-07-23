import App from "./App.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/auth.context.jsx";
import { TrainerSearchFilterProvider } from "./context/trainerSearchFilter.context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TrainerSearchFilterProvider>
          <App />
        </TrainerSearchFilterProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
