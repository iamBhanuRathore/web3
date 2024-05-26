import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";
import SingleTaskPage from "./pages/single-task-page.tsx";
import Header from "./components/header.tsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index Component={HomePage} path="/" />
        <Route index Component={SingleTaskPage} path="/task/:taskId" />
      </Routes>
    </>
  );
}

export default App;
