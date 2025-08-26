"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Check, X, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface AISuggestions {
  title: string;
  summary: string;
}

interface AISuggestionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (suggestions: AISuggestions) => void;
  logs: string;
  projectKey: string;
}

export function AISuggestionsPopup({
  isOpen,
  onClose,
  onApprove,
  logs,
  projectKey
}: AISuggestionsPopupProps) {
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate suggestions when popup opens
  useEffect(() => {
    if (isOpen && !suggestions && !isLoading) {
      handleGenerateSuggestions();
    }
  }, [isOpen]);

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs,
          context: {
            timestamp: new Date().toISOString(),
            source: 'bug-capture-tool'
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        throw new Error(data.error || 'Failed to generate suggestions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error generating AI suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (suggestions) {
      onApprove(suggestions);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Suggestions
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleGenerateSuggestions} disabled={isLoading} size="sm">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Retry
                </Button>
                <Button variant="outline" onClick={onClose} size="sm">
                  Close
                </Button>
              </div>
            </Alert>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-lg font-medium">Analyzing logs...</p>
                <p className="text-sm text-muted-foreground">
                  AI is analyzing your console logs and generating issue suggestions
                </p>
              </div>
            </div>
          ) : suggestions ? (
            <>
              {/* Title */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Title</h3>
                <p className="text-lg font-semibold text-gray-900">{suggestions.title}</p>
              </div>

              {/* Description with Markdown Support */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
                <div className="prose prose-sm max-w-none text-sm text-gray-700 leading-relaxed">
                  <ReactMarkdown>
                    {suggestions.summary}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleGenerateSuggestions}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  Use This Suggestion
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <p className="text-lg font-medium">Ready to generate suggestions</p>
              <p className="text-sm text-muted-foreground mb-4">
                Click generate to start AI analysis
              </p>
              <Button onClick={handleGenerateSuggestions}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Suggestions
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
