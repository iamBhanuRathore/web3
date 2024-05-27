import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page.tsx";
// import TaskPage from "./pages/task-page.tsx";
import Header from "./components/header.tsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index Component={HomePage} path="/" />
        {/* <Route index Component={TaskPage} path="/task" /> */}
      </Routes>
    </>
  );
}

export default App;
