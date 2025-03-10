// src/components/common/PageStatusMessage.tsx
import { useLocation } from "react-router-dom";

const PageStatusMessage = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md max-w-md">
        <div className="flex items-center mb-2">
          <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-bold">Under Development</p>
        </div>
        <p>The page <span className="font-medium">{location.pathname}</span> is currently under development.</p>
      </div>
    </div>
  );
};

export default PageStatusMessage;