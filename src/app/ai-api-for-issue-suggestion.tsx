// pages/api/jira/create-issue-suggestions.js

import OpenAI from 'openai';
import JiraApi from 'jira-client';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Jira
const jira = new JiraApi({
  protocol: 'https',
  host: process.env.JIRA_HOST || '',
  username: process.env.JIRA_EMAIL || '',
  password: process.env.JIRA_API_TOKEN || '',
  apiVersion: '3',
  strictSSL: true
});

// Agent 1: Log Analyzer Prompt
const LOG_ANALYZER_PROMPT = `You are a technical log analyzer. Analyze console logs and extract structured information for Jira issue creation.

Extract and return JSON with:
{
  "issueType": "Bug|Story|Task|Epic",
  "priority": "Highest|High|Medium|Low|Lowest",
  "severity": "Critical|Major|Minor|Trivial", 
  "components": ["component1", "component2"],
  "errorCategory": "Frontend|Backend|Database|API|Infrastructure",
  "technicalSummary": "Brief technical summary",
  "userImpact": "Description of user impact",
  "suggestedLabels": ["label1", "label2"],
  "keyDetails": {
    "errorMessages": ["error1", "error2"],
    "affectedFiles": ["file1.js", "file2.py"],
    "stackTrace": "relevant stack trace if present",
    "reproductionSteps": ["step1", "step2"],
    "browserInfo": "browser/environment info if available"
  },
  "estimatedEffort": "1d|2d|1w|2w",
  "urgency": "Immediate|Soon|Eventually"
}

Analyze these logs:`;

// Agent 2: Jira Issue Creator Prompt  
const JIRA_ISSUE_CREATOR_PROMPT = `You are a Jira issue creation expert. Create comprehensive issue descriptions and field suggestions.

Given technical analysis and Jira field schema, return JSON:
{
  "descriptions": {
    "executive": "Business impact for management (2-3 sentences)",
    "technical": "Detailed technical description with markdown formatting",
    "userStory": "As a [user], I want [goal] so that [benefit]"
  },
  "fieldSuggestions": {
    "mandatory": {
      "summary": "Clear, concise title (max 255 chars)",
      "description": "Full Jira-formatted description with steps to reproduce",
      "issuetype": { "name": "Bug" },
      "priority": { "name": "High" }
    },
    "optional": {
      "labels": ["frontend", "critical"],
      "components": [{"name": "Web App"}],
      "environment": "Production/Staging/Development",
      "duedate": "YYYY-MM-DD",
      "customfield_10001": "Epic Link if applicable",
      "assignee": null,
      "reporter": "auto-detect"
    }
  },
  "confidence": {
    "issueType": 0.95,
    "priority": 0.85,
    "overall": 0.90
  },
  "recommendations": {
    "assignTeam": "Frontend|Backend|DevOps|QA",
    "nextSteps": ["immediate action 1", "action 2"],
    "relatedIssues": "search terms for finding related issues"
  }
}

Create suggestions for:`;

// Agent 1: Analyze Logs Function
async function analyzeLogsWithAgent1(logs: string, context: Record<string, unknown>) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system", 
        content: LOG_ANALYZER_PROMPT
      }, {
        role: "user",
        content: `Console Logs:\n${logs}\n\nContext:\n${JSON.stringify(context, null, 2)}`
      }],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    
    // Clean up response - sometimes AI adds markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || [null, content];
    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error('Agent 1 Error:', error);
    throw new Error(`Log analysis failed: ${error.message}`);
  }
}

// Agent 2: Create Issue Suggestions Function
async function createIssueWithAgent2(analysis: Record<string, unknown>, jiraFields: Record<string, unknown>, projectContext: Record<string, unknown>) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", 
      messages: [{
        role: "system",
        content: JIRA_ISSUE_CREATOR_PROMPT
      }, {
        role: "user", 
        content: `Technical Analysis:\n${JSON.stringify(analysis, null, 2)}\n\nJira Fields:\n${JSON.stringify(jiraFields, null, 2)}\n\nProject Context:\n${JSON.stringify(projectContext, null, 2)}`
      }],
      temperature: 0.2,
      max_tokens: 3000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || [null, content];
    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error('Agent 2 Error:', error);
    throw new Error(`Issue creation failed: ${error.message}`);
  }
}

// Main API Handler
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    logs, 
    projectKey, 
    context = {},
    issueTypeOverride = null 
  } = req.body;

  // Validation
  if (!logs || !projectKey) {
    return res.status(400).json({ 
      error: 'Missing required fields: logs and projectKey are required' 
    });
  }

  try {
    console.log(`Processing request for project: ${projectKey}`);
    
    // Step 1: Get Jira project metadata
    console.log('Fetching Jira project metadata...');
    const createMeta = await jira.getCreateMetadata({
      projectKeys: projectKey,
      expand: 'projects.issuetypes.fields'
    });

    if (!createMeta.projects || createMeta.projects.length === 0) {
      return res.status(404).json({ error: 'Project not found or no permission' });
    }

    const project = createMeta.projects[0];

    // Step 2: Run Agent 1 - Log Analysis
    console.log('Running Agent 1: Log Analysis...');
    const logAnalysis = await analyzeLogsWithAgent1(logs, context);

    // Step 3: Find appropriate issue type
    const suggestedIssueType = issueTypeOverride 
      ? project.issuetypes.find(type => type.name === issueTypeOverride)
      : project.issuetypes.find(type => type.name.toLowerCase() === logAnalysis.issueType.toLowerCase()) 
      || project.issuetypes.find(type => type.name === 'Bug')
      || project.issuetypes[0];

    // Step 4: Run Agent 2 - Issue Creation
    console.log('Running Agent 2: Issue Creation...');
    const issueSuggestions = await createIssueWithAgent2(
      logAnalysis,
      suggestedIssueType.fields,
      { 
        project: project.name, 
        key: projectKey,
        availableIssueTypes: project.issuetypes.map(t => t.name)
      }
    );

    // Step 5: Return comprehensive response with suggestions
    const response = {
      success: true,
      analysis: logAnalysis,
      suggestions: issueSuggestions,
      jiraMetadata: {
        project: {
          key: project.key,
          name: project.name,
          id: project.id
        },
        availableIssueTypes: project.issuetypes.map(type => ({
          id: type.id,
          name: type.name,
          description: type.description
        })),
        selectedIssueType: {
          id: suggestedIssueType.id,
          name: suggestedIssueType.name,
          fieldCount: Object.keys(suggestedIssueType.fields).length,
          fields: Object.values(suggestedIssueType.fields).map(field => ({
            id: field.fieldId,
            name: field.name,
            required: field.required,
            type: field.schema?.type || 'unknown'
          }))
        }
      },
      // Provide ready-to-use Jira payload for when user approves
      jiraPayload: {
        fields: {
          project: { key: projectKey },
          summary: issueSuggestions.fieldSuggestions.mandatory.summary,
          description: issueSuggestions.descriptions.technical,
          issuetype: issueSuggestions.fieldSuggestions.mandatory.issuetype,
          priority: issueSuggestions.fieldSuggestions.mandatory.priority,
          
          // Add optional fields that exist in the project
          ...(issueSuggestions.fieldSuggestions.optional.labels && {
            labels: issueSuggestions.fieldSuggestions.optional.labels
          }),
          ...(issueSuggestions.fieldSuggestions.optional.components && {
            components: issueSuggestions.fieldSuggestions.optional.components
          }),
          ...(issueSuggestions.fieldSuggestions.optional.environment && {
            environment: issueSuggestions.fieldSuggestions.optional.environment
          })
        }
      },
      timestamp: new Date().toISOString()
    };

    console.log(`Request completed successfully - Generated suggestions for ${projectKey}`);
    res.status(200).json(response);

  } catch (error) {
    console.error('Pipeline error:', error);
    res.status(500).json({
      error: 'Failed to process request',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}