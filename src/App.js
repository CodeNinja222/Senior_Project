import React from "react";
import CompManag from './components/Comp_Manag'
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Analytics from "./components/Analytics";

function App() {
  
  return (
    <>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/registerCompany" element={<CompManag/>}/>
    <Route path="/Analytics" element={<Analytics/>}/>
    </Routes>
    
    </>
  );
}

export default App;
