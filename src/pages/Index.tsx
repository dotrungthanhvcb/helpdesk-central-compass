
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const Index = () => {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Helpdesk Central</h1>
        <p className="text-xl text-gray-600">Redirecting you to the dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
