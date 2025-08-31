"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Check, X, RefreshCw, Loader2, AlertCircle, Tag, MessageSquare } from "lucide-react";
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
  mediaContext?: string;
}

export function AISuggestionsPopup({
  isOpen,
  onClose,
  onApprove,
  logs,
  projectKey,
  mediaContext = ''
}: AISuggestionsPopupProps) {
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState<string>('');

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
          keywords: keywords.trim(), // Include keywords in the request
          mediaContext: mediaContext.trim(), // Include media context
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

  const handleCancel = () => {
    if (suggestions) {
      // Show feedback dropdown when canceling after suggestions are generated
      setShowFeedback(true);
    } else {
      // If no suggestions were generated, just close
      onClose();
    }
  };

  const handleFeedbackSubmit = () => {
    // Here you could send the feedback to your analytics or feedback system
    console.log('AI Suggestions Feedback:', {
      reason: feedbackReason,
      hadSuggestions: !!suggestions,
      keywords: keywords
    });
    
    // Reset and close
    setShowFeedback(false);
    setFeedbackReason('');
    setKeywords('');
    setSuggestions(null);
    onClose();
  };

  const handleFeedbackSkip = () => {
    setShowFeedback(false);
    setFeedbackReason('');
    setKeywords('');
    setSuggestions(null);
    onClose();
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
          {/* Keywords Input Section */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4" />
              Keywords for Better Suggestions
            </Label>
            <Input
              id="keywords"
              placeholder="Enter keywords to help AI generate better suggestions (e.g., 'login error', 'payment failed', 'mobile responsive')"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Add specific keywords or context to help AI understand the issue better
            </p>
          </div>

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
                  {keywords && (
                    <span className="block mt-1">
                      Using keywords: <span className="font-medium">{keywords}</span>
                    </span>
                  )}
                  {mediaContext && (
                    <span className="block mt-1">
                      Using media context: <span className="font-medium">{mediaContext.split('\n').length} context items</span>
                    </span>
                  )}
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
                <div className="text-sm text-gray-700 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      h3: ({children}) => (
                        <h3 className="text-base font-semibold text-gray-900 mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      h4: ({children}) => (
                        <h4 className="text-sm font-medium text-gray-800 mt-3 mb-1">
                          {children}
                        </h4>
                      ),
                      ul: ({children}) => (
                        <ul className="list-disc pl-5 space-y-1">
                          {children}
                        </ul>
                      ),
                      li: ({children}) => (
                        <li className="mb-1">
                          {children}
                        </li>
                      ),
                      p: ({children}) => (
                        <p className="mb-2">
                          {children}
                        </p>
                      )
                    }}
                  >
                    {suggestions.summary.replace(/\\n/g, '\n')}
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
                  onClick={handleCancel}
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

        {/* Feedback Dialog */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Help us improve</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                What didn't you like about the AI suggestions?
              </p>
              <Select value={feedbackReason} onValueChange={setFeedbackReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-relevant">Suggestions not relevant</SelectItem>
                  <SelectItem value="too-vague">Too vague or generic</SelectItem>
                  <SelectItem value="missing-context">Missing important context</SelectItem>
                  <SelectItem value="wrong-priority">Wrong priority level</SelectItem>
                  <SelectItem value="technical-issues">Technical issues</SelectItem>
                  <SelectItem value="other">Other reason</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={handleFeedbackSkip} className="flex-1">
                  Skip
                </Button>
                <Button onClick={handleFeedbackSubmit} className="flex-1">
                  Submit Feedback
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
