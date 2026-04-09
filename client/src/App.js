import React, { useState } from "react";
import StartScreen from "./pages/StartScreen";
import TestScreen from "./pages/TestScreen";
import ResultScreen from "./pages/ResultScreen";
import AdminPage from "./pages/AdminPage";
import "./App.css";

export default function App() {
  const hash = window.location.hash;
  const path = window.location.pathname;

  // Support both /admin and #admin
  const isAdmin = path === "/admin" || hash === "#admin" || hash === "#/admin";
  if (isAdmin) return <AdminPage />;

  const [screen, setScreen] = useState("start");
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