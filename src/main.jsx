import React from "react";
import { createRoot } from "react-dom/client";
import ParisLocalStudio from "./ParisLocalStudio.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ParisLocalStudio />
  </React.StrictMode>,
);
