import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";

function App() {
  return (
    <>
      <Routes>
        <Route index Component={HomePage} path="/" />
      </Routes>
    </>
  );
}

export default App;
