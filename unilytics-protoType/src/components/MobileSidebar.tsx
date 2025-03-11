// src/components/layout/MobileSidebar.tsx
import { useState } from "react";

import { Menu, Home, Database, FolderOpen, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

// Moved these components into the MobileSidebar file to avoid display conflicts
type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number | string;
  to: string;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active,
  badge,
  to,
  onClick
}) => {
  return (
    <Link to={to} onClick={onClick}>
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
  onClick?: () => void;
};

const SubNavItem: React.FC<SubNavItemProps> = ({ label, active, to, onClick }) => {
  return (
    <Link to={to} onClick={onClick}>
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

// Mobile sidebar content component
const MobileSidebarContent = ({ onClose }: { onClose: () => void }) => {
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
    <div className="w-full bg-white h-full flex flex-col justify-between">
      {/* Close button */}
      <div className="flex justify-end p-2">
        {/* <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md">
          <X className="h-5 w-5" />
        </button> */}
      </div>
      
      {/* Top navigation section */}
      <div className="flex flex-col pt-2">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="Home"
          active={isHome}
          to="/"
          onClick={onClose}
        />
        <NavItem
          icon={<Database className="h-5 w-5" />}
          label="Datasources"
          active={isDatasources}
          to="/datasources"
          onClick={onClose}
        />
        <NavItem
          icon={<FolderOpen className={`h-5 w-5 ${isProjects ? "text-blue-600" : ""}`} />}
          label="Projects"
          active={isProjects}
          badge="9"
          to="/projects"
          onClick={onClose}
        />

        {/* Sub navigation for Projects */}
        {isProjects && (
          <div className="border-l border-gray-200 ml-6 my-1">
            <SubNavItem
              label="Prepare"
              active={isPrepare}
              to="/projects/prepare"
              onClick={onClose}
            />
            <SubNavItem
              label="Insights"
              active={isInsights}
              to="/projects/insights"
              onClick={onClose}
            />
            <SubNavItem
              label="Chat"
              active={isChat}
              to="/projects/chat"
              onClick={onClose}
            />
            <SubNavItem
              label="Report"
              active={isReport}
              to="/projects/report"
              onClick={onClose}
            />
          </div>
        )}
      </div>

      {/* User profile at the very bottom */}
      <div className="flex flex-col mt-auto">
        <div className="my-2">
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            active={isSettings}
            to="/settings"
            onClick={onClose}
          />
        </div>

        <div className="border-t border-gray-200">
          <div className="mx-2 my-2 flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
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

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 max-w-full">
        <MobileSidebarContent onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;