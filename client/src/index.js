import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyB5vhKznDWQ7xXa-szOOOMAYghJjZ0Ysyc",
	authDomain: "keep-notes-25.firebaseapp.com",
	projectId: "keep-notes-25",
	storageBucket: "keep-notes-25.appspot.com",
	messagingSenderId: "1082716994692",
	appId: "1:1082716994692:web:a2b13894c309f41f05d6d1",
	measurementId: "G-652KDW1G36",
};

const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<BrowserRouter>
		<Routes>
			<Route
				path="/"
				element={<App />}
			/>
		</Routes>
	</BrowserRouter>
);
