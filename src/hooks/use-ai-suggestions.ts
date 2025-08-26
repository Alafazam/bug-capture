import { useState } from 'react';

export interface AISuggestionRequest {
  logs: string;
  projectKey: string;
  context?: Record<string, any>;
  issueTypeOverride?: string;
}

export interface LogAnalysis {
  ticket: string;
  summary: string;
}

export interface IssueSuggestions {
  fieldValues: {
    summary: string;
    description: string;
    issuetype: { name: string };
    priority: { name: string };
    labels?: string[];
    components?: { name: string }[];
    environment?: string;
    assignee?: string | null;
    reporter?: string | null;
    duedate?: string;
    customfield_10001?: string;
    customfield_10002?: string;
    [key: string]: any; // For any other custom fields
  };
  confidence: {
    overall: number;
    summary: number;
    priority: number;
    issuetype: number;
  };
  reasoning: {
    summary: string;
    priority: string;
    issuetype: string;
    labels: string;
  };
}

export interface AISuggestionResponse {
  success: boolean;
  analysis: LogAnalysis;
  suggestions: IssueSuggestions;
  rawAgent1Response?: string;
  rawAgent2Response?: string;
  jiraMetadata: {
    project: {
      key: string;
      name: string;
      id: string;
    };
    availableIssueTypes: Array<{
      id: string;
      name: string;
      description: string;
    }>;
    selectedIssueType: {
      id: string;
      name: string;
      fieldCount: number;
      fields: Array<{
        id: string;
        name: string;
        required: boolean;
        type: string;
      }>;
    };
  };
  jiraPayload: {
    fields: Record<string, any>;
  };
  timestamp: string;
}

export function useAISuggestions() {
  const [suggestions, setSuggestions] = useState<AISuggestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async (request: AISuggestionRequest) => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const response = await fetch('/api/jira/issue-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSuggestions(result);
        return result;
      } else {
        throw new Error(result.error || 'Failed to generate suggestions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSuggestions = () => {
    setSuggestions(null);
    setError(null);
  };

  return {
    generateSuggestions,
    clearSuggestions,
    suggestions,
    isLoading,
    error,
  };
}
