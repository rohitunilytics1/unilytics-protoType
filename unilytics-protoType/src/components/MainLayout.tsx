import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Fixed Navbar at top */}
      <Navbar />
      
      {/* Main content area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile, visible on sm and up */}
        <Sidebar />
        
        {/* Main content - scrollable area */}
        <main className="flex-1 h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;