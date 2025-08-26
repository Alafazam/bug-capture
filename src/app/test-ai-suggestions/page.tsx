'use client';

import { useState } from 'react';
import { AISuggestions } from '../bug-capture/components/ai-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestAISuggestionsPage() {
  const [logs, setLogs] = useState(`[ERROR] 2024-01-15 14:30:25 - TypeError: Cannot read property 'length' of undefined
    at processData (/app/src/utils/dataProcessor.js:45:12)
    at async handleUserRequest (/app/src/controllers/userController.js:23:8)
    at async /app/src/routes/api.js:15:4
    at async /app/src/middleware/auth.js:8:2

[WARN] 2024-01-15 14:30:26 - Database connection timeout after 30 seconds
[INFO] 2024-01-15 14:30:27 - User session expired: user123
[ERROR] 2024-01-15 14:30:28 - Failed to process payment: Invalid card number
    at validatePayment (/app/src/services/paymentService.js:67:3)
    at async processOrder (/app/src/controllers/orderController.js:34:1)`);

  const [projectKey, setProjectKey] = useState('PMT');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleApprove = (payload: any) => {
    console.log('Approved payload:', payload);
    alert('Payload approved! Check console for details.');
  };

  const handleDismiss = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Jira Issue Suggestions Test</CardTitle>
            <CardDescription>
              Test the AI system that analyzes console logs and generates Jira issue suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectKey">Jira Project Key</Label>
                <Input
                  id="projectKey"
                  value={projectKey}
                  onChange={(e) => setProjectKey(e.target.value)}
                  placeholder="e.g., PMT, PROJ"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => setShowSuggestions(true)}
                  className="w-full"
                >
                  Test AI Suggestions
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="logs">Console Logs (Sample)</Label>
              <Textarea
                id="logs"
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                rows={8}
                placeholder="Paste your console logs here..."
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {showSuggestions && (
          <AISuggestions
            logs={logs}
            projectKey={projectKey}
            onApprove={handleApprove}
            onDismiss={handleDismiss}
          />
        )}
      </div>
    </div>
  );
}
