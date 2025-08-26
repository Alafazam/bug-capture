'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Sparkles, CheckCircle, AlertCircle, Clock, Users, Target, Eye } from 'lucide-react';
import { useAISuggestions, type AISuggestionResponse } from '@/hooks/use-ai-suggestions';

interface AISuggestionsProps {
  logs: string;
  projectKey: string;
  onApprove: (payload: any) => void;
  onDismiss: () => void;
}

export function AISuggestions({ logs, projectKey, onApprove, onDismiss }: AISuggestionsProps) {
  const { generateSuggestions, suggestions, isLoading, error } = useAISuggestions();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    try {
      await generateSuggestions({
        logs,
        projectKey,
        context: {
          timestamp: new Date().toISOString(),
          source: 'bug-capture-tool'
        }
      });
    } catch (err) {
      console.error('Failed to generate suggestions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = () => {
    if (suggestions?.jiraPayload) {
      onApprove(suggestions.jiraPayload);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };



  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            AI Suggestions Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleGenerateSuggestions} disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Retry
            </Button>
            <Button variant="outline" onClick={onDismiss}>
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI-Powered Issue Suggestions
          </CardTitle>
          <CardDescription>
            Let AI analyze your console logs and generate comprehensive Jira issue suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Project: {projectKey}
            </div>
            <Button 
              onClick={handleGenerateSuggestions} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing logs...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Suggestions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Sparkles className="h-5 w-5" />
          AI-Generated Issue Suggestions
        </CardTitle>
        <CardDescription>
          Confidence: <span className={getConfidenceColor(suggestions.suggestions.confidence.overall)}>
            {(suggestions.suggestions.confidence.overall * 100).toFixed(0)}%
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Section */}
        <div className="space-y-3">
          <h4 className="font-semibold">AI Responses</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Agent 1:</span>
              <span className="ml-2 font-medium">Log Analysis</span>
            </div>
            <div>
              <span className="text-muted-foreground">Agent 2:</span>
              <span className="ml-2 font-medium">Jira Issue Creator</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* AI Agent Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agent 1 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Agent 1: Log Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded border overflow-x-auto max-h-96">
                <pre className="text-xs whitespace-pre-wrap">
                  {suggestions.rawAgent1Response || 'No response from Agent 1'}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Agent 2 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Agent 2: Jira Issue Creator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded border overflow-x-auto max-h-96">
                <pre className="text-xs whitespace-pre-wrap">
                  {suggestions.rawAgent2Response || 'No response from Agent 2'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                View Jira Payload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generated Jira Payload</DialogTitle>
                <DialogDescription>
                  This is the complete Jira issue payload that would be sent to create the issue.
                </DialogDescription>
                </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Jira Payload from Agent 2</h4>
                  <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded border overflow-x-auto max-h-96">
                    {JSON.stringify(suggestions.jiraPayload, null, 2)}
                  </pre>
                </div>
              </div>
              </DialogContent>
          </Dialog>
          <Button onClick={handleApprove} className="flex-1">
            <CheckCircle className="mr-2 h-4 w-4" />
            Use This Suggestion
          </Button>
          <Button variant="outline" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
