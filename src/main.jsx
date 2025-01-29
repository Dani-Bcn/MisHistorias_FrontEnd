import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="1041836981185-iu04okljfsbhp17iduf46iet5ctmuhiv.apps.googleusercontent.com">
    <HashRouter>
      <App />
    </HashRouter>
  </GoogleOAuthProvider>
);
