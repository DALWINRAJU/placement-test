import React, { useState } from "react";
import StartScreen from "./pages/StartScreen";
import TestScreen from "./pages/TestScreen";
import ResultScreen from "./pages/ResultScreen";
import AdminPage from "./pages/AdminPage";
import "./App.css";

export default function App() {
  const path = window.location.pathname;
  if (path === "/admin") return <AdminPage />;

  const [screen, setScreen] = useState("start"); // start | test | result
  const [sessionData, setSessionData] = useState(null);

  return (
    <div className="app-root">
      {screen === "start" && (
        <StartScreen onStart={(data) => { setSessionData(data); setScreen("test"); }} />
      )}
      {screen === "test" && (
        <TestScreen
          sessionData={sessionData}
          onFinish={(data) => { setSessionData(data); setScreen("result"); }}
        />
      )}
      {screen === "result" && (
        <ResultScreen sessionData={sessionData} />
      )}
    </div>
  );
}
