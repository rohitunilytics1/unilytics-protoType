// src/components/layout/Sidebar.tsx
import React from "react";
import { Home, Database, FolderOpen, Settings, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number | string;
  to: string;
};

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active,
  badge,
  to
}) => {
  return (
    <Link to={to}>
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
          active ? "bg-blue-50" : "hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={active ? "text-blue-600" : ""}>{icon}</span>
          <span
            className={`text-sm ${active ? "text-blue-600 font-medium" : ""}`}
          >
            {label}
          </span>
        </div>
        {badge && (
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-md">
            {badge}
          </div>
        )}
      </div>
    </Link>
  );
};

type SubNavItemProps = {
  label: string;
  active?: boolean;
  to: string;
};

const SubNavItem: React.FC<SubNavItemProps> = ({ label, active, to }) => {
  return (
    <Link to={to}>
      <div
        className={`pl-10 py-2 text-sm cursor-pointer ${
          active
            ? "text-blue-600 font-medium"
            : "text-gray-400 hover:text-gray-700"
        }`}
      >
        {label}
      </div>
    </Link>
  );
};

const Sidebar = ({ mobileView = false, onClose = () => {} }) => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Determine active nav based on the current path
  const isHome = pathname === "/" || pathname === "/home";
  const isDatasources = pathname === "/datasources";
  const isProjects = pathname.includes("/projects");
  const isSettings = pathname === "/settings";
  
  // Determine active sub-nav for projects
  const isPrepare = pathname === "/projects/prepare";
  const isInsights = pathname === "/projects/insights";
  const isChat = pathname === "/projects/chat";
  const isReport = pathname === "/projects/report";

  return (
    // <div className="w-60 border-r border-gray-200 bg-white h-screen flex flex-col justify-between sm:hidden">

    <div className="hidden sm:flex sm:w-60 border-r border-gray-200 bg-white h-screen flex-col justify-between">
      {/* Mobile close button */}
      {mobileView && (
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Top navigation section */}
      <div className="flex flex-col pt-4">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="Home"
          active={isHome}
          to="/"
        />
        <NavItem
          icon={<Database className="h-5 w-5" />}
          label="Datasources"
          active={isDatasources}
          to="/datasources"
        />
        <NavItem
          icon={<FolderOpen className={`h-5 w-5 ${isProjects ? "text-blue-600" : ""}`} />}
          label="Projects"
          active={isProjects}
          badge="9"
          to="/projects"
        />

        {/* Sub navigation for Projects */}
        {isProjects && (
          <div className="border-l border-gray-200 ml-6 my-1">
            <SubNavItem
              label="Prepare"
              active={isPrepare}
              to="/projects/prepare"
            />
            <SubNavItem
              label="Insights"
              active={isInsights}
              to="/projects/insights"
            />
            <SubNavItem
              label="Chat"
              active={isChat}
              to="/projects/chat"
            />
            <SubNavItem
              label="Report"
              active={isReport}
              to="/projects/report"
            />
          </div>
        )}
      </div>

      {/* User profile at the very bottom */}
      <div className="flex flex-col">
        <div className="my-2 ml-1">
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            active={isSettings}
            to="/settings"
          />
        </div>

        <div className="border-y border-l border-gray-200 mb-22">
          <div className="mx-2 my-2 flex items-center gap-3 p-0.5 rounded-md hover:bg-gray-100 cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
              T
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">User Name</span>
              <span className="text-xs text-gray-500">Trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
