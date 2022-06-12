import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { createApp, FirebaseProvider } from "react-hooks-firebase-v9";
import { Flowbite } from "flowbite-react";
import 'react-image-crop/dist/ReactCrop.css'
import "react-toastify/dist/ReactToastify.css";
import "cropperjs/dist/cropper.css";

const app = createApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Router>
    <RecoilRoot>
      <FirebaseProvider app={app}>
        <Flowbite
          theme={{
            dark: true,
          }}
        >
          <App />
        </Flowbite>
      </FirebaseProvider>
    </RecoilRoot>
  </Router>
);
