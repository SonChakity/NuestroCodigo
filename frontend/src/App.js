import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Plan502030 from "./components/Plan502030";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Plan502030 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;