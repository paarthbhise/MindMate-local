import { useState, useEffect } from 'react';
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUserProfile } from "@/lib/userProfile";
import { isAuthenticated } from "@/lib/auth";
import { ThemeProvider } from './hooks/useTheme.tsx';

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import WelcomeSetup from "@/components/WelcomeSetup";
import NotificationManager from "@/components/NotificationManager";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Mood from "@/pages/Mood";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    
    if (authenticated) {
      const profile = getUserProfile();
      setUserProfile(profile);
      setShowWelcome(!profile);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuth(true);
    const profile = getUserProfile();
    setUserProfile(profile);
    setShowWelcome(!profile);
  };

  const handleLogout = () => {
    setIsAuth(false);
    setUserProfile(null);
    setShowWelcome(false);
  };

  const handleWelcomeComplete = (name: string) => {
    setUserProfile(getUserProfile());
    setShowWelcome(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background transition-colors duration-300 ease-in-out">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/95 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_45%,var(--gradient-start)/15%,transparent)] dark:bg-[radial-gradient(40%_40%_at_50%_45%,var(--gradient-start)/5%,transparent)]" />
            </div>
            <ProtectedRoute onAuthSuccess={handleAuthSuccess}>
              <>
                {showWelcome && <WelcomeSetup onComplete={handleWelcomeComplete} />}
                
                <Navbar onLogout={handleLogout} />
                <main className="transition-all duration-300 ease-in-out animate-fade-in">
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/chat" component={Chat} />
                    <Route path="/mood" component={Mood} />
                    <Route path="/resources" component={Resources} />
                    <Route path="/profile" component={Profile} />
                    <Route component={NotFound} />
                  </Switch>
                </main>
                
                <NotificationManager />
              </>
            </ProtectedRoute>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
