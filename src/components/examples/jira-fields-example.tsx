'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fetchJiraProjectFields, fetchRequiredFieldsForIssueType, type JiraFieldsResponse } from '@/lib/utils/jira-api';

export function JiraFieldsExample() {
  const [projectKey, setProjectKey] = useState('PMT');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<JiraFieldsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchFields = async () => {
    if (!projectKey.trim()) {
      setError('Project key is required');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchJiraProjectFields(projectKey);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Jira fields');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRequiredFields = async (issueTypeName: string) => {
    if (!projectKey.trim()) {
      setError('Project key is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requiredFields = await fetchRequiredFieldsForIssueType(projectKey, issueTypeName);
      console.log(`Required fields for ${issueTypeName}:`, requiredFields);
      alert(`Found ${requiredFields.length} required fields for ${issueTypeName}. Check console for details.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch required fields');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Jira Fields API Example</CardTitle>
          <CardDescription>
            Fetch issue types and their fields for a Jira project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Project Key (e.g., PMT)"
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value)}
              className="max-w-xs"
            />
            <Button 
              onClick={handleFetchFields} 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Fields'}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-900">
                  Project: {data.project.name} ({data.project.key})
                </h3>
                <p className="text-blue-700 text-sm">
                  Found {data.issueTypes.length} issue types
                </p>
              </div>

              <div className="space-y-4">
                {data.issueTypes.map((issueType) => (
                  <Card key={issueType.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{issueType.name}</CardTitle>
                          {issueType.description && (
                            <CardDescription>{issueType.description}</CardDescription>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {issueType.subtask && (
                            <Badge variant="secondary">Subtask</Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFetchRequiredFields(issueType.name)}
                            disabled={loading}
                          >
                            Get Required Fields
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">
                            Required Fields ({issueType.requiredFields.length})
                          </h4>
                          {issueType.requiredFields.length > 0 ? (
                            <div className="space-y-1">
                              {issueType.requiredFields.map((field) => (
                                <div key={field.id} className="text-sm">
                                  <span className="font-medium">{field.name}</span>
                                  <span className="text-gray-500 ml-2">({field.schema.type})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No required fields</p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium text-blue-700 mb-2">
                            Optional Fields ({issueType.optionalFields.length})
                          </h4>
                          {issueType.optionalFields.length > 0 ? (
                            <div className="space-y-1">
                              {issueType.optionalFields.slice(0, 5).map((field) => (
                                <div key={field.id} className="text-sm">
                                  <span className="font-medium">{field.name}</span>
                                  <span className="text-gray-500 ml-2">({field.schema.type})</span>
                                </div>
                              ))}
                              {issueType.optionalFields.length > 5 && (
                                <p className="text-sm text-gray-500">
                                  ... and {issueType.optionalFields.length - 5} more
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No optional fields</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
