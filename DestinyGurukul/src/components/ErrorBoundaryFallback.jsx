import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 border border-border">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        
        <h1 className="text-2xl font-extrabold text-foreground mb-2">
          Something went wrong
        </h1>
        
        <p className="text-sm text-muted-foreground mb-6">
          We apologize for the inconvenience. An unexpected error occurred.
        </p>

        <div className="bg-red-50 text-red-700 text-xs text-left p-4 rounded-xl overflow-auto max-h-32 mb-6 font-mono border border-red-100">
          {error.message}
        </div>

        <Button 
          onClick={resetErrorBoundary} 
          className="w-full h-12 text-base font-semibold"
        >
          <RefreshCcw size={18} className="mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
