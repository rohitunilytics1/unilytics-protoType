// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import PageStatusMessage from "./pages/PageStatusMessage";
import MainLayout from "./components/MainLayout";
import ChatPage from "./pages/ChatPage";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<PageStatusMessage />} />
        <Route path="/home" element={<PageStatusMessage />} />
        <Route path="/datasources" element={<PageStatusMessage />} />
        <Route path="/projects" element={<PageStatusMessage />} />
        <Route path="/projects/prepare" element={<PageStatusMessage />} />
        <Route path="/projects/insights" element={<PageStatusMessage />} />
        <Route path="/projects/chat" element={<ChatPage />} />
        <Route path="/projects/report" element={<PageStatusMessage />} />
        <Route path="/settings" element={<PageStatusMessage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default App;