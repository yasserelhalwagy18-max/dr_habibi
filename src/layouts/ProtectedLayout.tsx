import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const ProtectedLayout: React.FC = () => {
  // In a real app, this layout would check for an auth token or session
  // and redirect to login if not authenticated.
  // For this prototype, we'll just render the outlet (the portal).

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950 relative text-right" style={{ direction: "rtl" }}>
       {/* Absolute top glowing bar for protected routes */}
       <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500 z-50 relative" />

       {/* Protected Content Area */}
       <main className="w-full">
         <Outlet />
       </main>
    </div>
  );
};
