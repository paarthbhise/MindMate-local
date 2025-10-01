import { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUserProfile } from "@/lib/userProfile";
import { isAuthenticated } from "@/lib/auth";
import { ThemeProvider } from './hooks/useTheme.tsx';

import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Mood from "@/pages/Mood";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import AuthForm from './components/AuthForm.tsx';
import NotificationManager from './components/NotificationManager.tsx';

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuth(isAuthenticated());
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    setIsAuth(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background transition-colors duration-300 ease-in-out">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/95 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_45%,var(--gradient-start)/15%,transparent)] dark:bg-[radial-gradient(40%_40%_at_50%_45%,var(--gradient-start)/5%,transparent)]" />
            </div>
            <Navbar onLogout={handleLogout} />
            <main className="transition-all duration-300 ease-in-out animate-fade-in">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/login">
                  {() => (isAuth ? <Redirect to="/" /> : <AuthForm onAuthSuccess={() => setIsAuth(true)} />)}
                </Route>
                <Route path="/signup">
                  {() => (isAuth ? <Redirect to="/" /> : <AuthForm onAuthSuccess={() => setIsAuth(true)} />)}
                </Route>
                <Route path="/chat">
                  {() => (isAuth ? <Chat /> : <Redirect to="/login" />)}
                </Route>
                <Route path="/mood">
                  {() => (isAuth ? <Mood /> : <Redirect to="/login" />)}
                </Route>
                <Route path="/resources">
                  {() => (isAuth ? <Resources /> : <Redirect to="/login" />)}
                </Route>
                <Route path="/profile">
                  {() => (isAuth ? <Profile /> : <Redirect to="/login" />)}
                </Route>
                <Route component={NotFound} />
              </Switch>
            </main>
            <NotificationManager />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
