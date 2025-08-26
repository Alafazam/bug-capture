import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LOG_ANALYZER_PROMPT, JIRA_ISSUE_CREATOR_PROMPT } from '@/lib/prompts/ai-suggestions';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for the AI responses
interface LogAnalysis {
  ticket: string;
  summary: string;
}

interface IssueSuggestions {
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



// Agent 1: Analyze Logs Function
async function analyzeLogsWithAgent1(logs: string, context: any): Promise<{ analysis: LogAnalysis; rawResponse: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

    const content = response.choices[0].message.content || '';
    
    // Clean up response - sometimes AI adds markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || [null, content];
    
    try {
      const analysis = JSON.parse(jsonMatch[1] || '{}');
      return { analysis, rawResponse: content };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      
      // If parsing fails, create a fallback analysis
      const analysis: LogAnalysis = {
        ticket: "Failed to parse AI response",
        summary: content
      };
      return { analysis, rawResponse: content };
    }
  } catch (error) {
    console.error('Agent 1 Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Log analysis failed: ${errorMessage}`);
  }
}

// Agent 2: Create Issue Suggestions Function
async function createIssueWithAgent2(logs: string, analysis: LogAnalysis, jiraFields: any, projectContext: any): Promise<{ suggestions: IssueSuggestions; rawResponse: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [{
        role: "system",
        content: JIRA_ISSUE_CREATOR_PROMPT
      }, {
        role: "user", 
        content: `Console Logs:\n${logs}\n\nLog Analysis:\n${JSON.stringify(analysis, null, 2)}\n\nJira Fields:\n${JSON.stringify(jiraFields, null, 2)}\n\nProject Context:\n${JSON.stringify(projectContext, null, 2)}`
      }],
      temperature: 0.2,
      max_tokens: 3000
    });

    const content = response.choices[0].message.content || '';
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || [null, content];
    
    try {
      const suggestions = JSON.parse(jsonMatch[1] || '{}');
      return { suggestions, rawResponse: content };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      
      // If parsing fails, create a fallback suggestions
      const suggestions: IssueSuggestions = {
        fieldValues: {
          summary: "Failed to parse AI response",
          description: content,
          issuetype: { name: "Bug" },
          priority: { name: "Medium" },
          labels: ["error", "failed"],
          components: [],
          environment: "Unknown",
          assignee: null,
          reporter: null
        },
        confidence: {
          overall: 0.5,
          summary: 0.5,
          priority: 0.5,
          issuetype: 0.5
        },
        reasoning: {
          summary: "Failed to parse AI response",
          priority: "Default priority due to parsing failure",
          issuetype: "Default issue type due to parsing failure",
          labels: "Default labels due to parsing failure"
        }
      };
      return { suggestions, rawResponse: content };
    }
  } catch (error) {
    console.error('Agent 2 Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Issue creation failed: ${errorMessage}`);
  }
}

// Main API Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      logs, 
      projectKey, 
      context = {},
      issueTypeOverride = null 
    } = body;

    // Validation
    if (!logs || !projectKey) {
      return NextResponse.json({ 
        error: 'Missing required fields: logs and projectKey are required' 
      }, { status: 400 });
    }

    console.log(`Processing request for project: ${projectKey}`);
    
    // Step 1: Get Jira project metadata using the existing fields API
    console.log('Fetching Jira project metadata...');
    const jiraUrl = process.env.JIRA_URL;
    const email = process.env.JIRA_EMAIL;
    const apiToken = process.env.JIRA_API_TOKEN;

    if (!jiraUrl || !email || !apiToken) {
      return NextResponse.json(
        { error: 'Jira credentials not configured' },
        { status: 500 }
      );
    }

    // Get project information
    const projectResponse = await fetch(
      `${jiraUrl}/rest/api/3/project/${projectKey}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!projectResponse.ok) {
      return NextResponse.json({ error: 'Project not found or no permission' }, { status: 404 });
    }

    const projectData = await projectResponse.json();
    const issueTypes = projectData.issueTypes || [];

    if (issueTypes.length === 0) {
      return NextResponse.json({ error: 'No issue types found for project' }, { status: 404 });
    }

    // Step 2: Run Agent 1 - Log Analysis
    console.log('Running Agent 1: Log Analysis...');
    const { analysis: logAnalysis, rawResponse: rawAgent1Response } = await analyzeLogsWithAgent1(logs, context);

    // Step 3: Find appropriate issue type (default to Bug since Agent 1 doesn't specify issue type)
    const suggestedIssueType = issueTypeOverride 
      ? issueTypes.find((type: any) => type.name === issueTypeOverride)
      : issueTypes.find((type: any) => type.name === 'Bug')
      || issueTypes[0];

    // Get fields for the selected issue type
    const fieldsResponse = await fetch(
      `${jiraUrl}/rest/api/3/issue/createmeta?` +
      `projectKeys=${projectKey}&` +
      `issuetypeNames=${suggestedIssueType.name}&` +
      `expand=projects.issuetypes.fields`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!fieldsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch issue type fields' }, { status: 500 });
    }

    const fieldsData = await fieldsResponse.json();
    const fields = fieldsData.projects?.[0]?.issuetypes?.[0]?.fields || {};

    // Step 4: Run Agent 2 - Issue Creation (with fallback)
    console.log('Running Agent 2: Issue Creation...');
    let issueSuggestions: IssueSuggestions;
    let rawAgent2Response: string;
    
    try {
      const result = await createIssueWithAgent2(
        logs,
        logAnalysis,
        fields,
        { 
          project: projectData.name, 
          key: projectKey,
          availableIssueTypes: issueTypes.map((t: any) => t.name)
        }
      );
      issueSuggestions = result.suggestions;
      rawAgent2Response = result.rawResponse;
    } catch (error) {
      console.error('Agent 2 failed:', error);
      issueSuggestions = {
        fieldValues: {
          summary: "Agent 2 failed to process",
          description: "Agent 2 failed to process the request",
          issuetype: { name: "Bug" },
          priority: { name: "Medium" },
          labels: ["error", "failed"],
          components: [],
          environment: "Unknown",
          assignee: null,
          reporter: null
        },
        confidence: {
          overall: 0.5,
          summary: 0.5,
          priority: 0.5,
          issuetype: 0.5
        },
        reasoning: {
          summary: "Agent 2 failed to process",
          priority: "Default priority due to failure",
          issuetype: "Default issue type due to failure",
          labels: "Default labels due to failure"
        }
      };
      rawAgent2Response = `Agent 2 failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Step 5: Return comprehensive response with suggestions
    const response = {
      success: true,
      analysis: logAnalysis,
      suggestions: issueSuggestions,
      rawAgent1Response,
      rawAgent2Response,
      jiraMetadata: {
        project: {
          key: projectData.key,
          name: projectData.name,
          id: projectData.id
        },
        availableIssueTypes: issueTypes.map((type: any) => ({
          id: type.id,
          name: type.name,
          description: type.description
        })),
        selectedIssueType: {
          id: suggestedIssueType.id,
          name: suggestedIssueType.name,
          fieldCount: Object.keys(fields).length,
          fields: Object.values(fields).map((field: any) => ({
            id: field.fieldId || field.id,
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
          summary: issueSuggestions.fieldValues.summary,
          description: issueSuggestions.fieldValues.description,
          issuetype: issueSuggestions.fieldValues.issuetype,
          priority: issueSuggestions.fieldValues.priority,
          
          // Add optional fields that exist in the project
          ...(issueSuggestions.fieldValues.labels && {
            labels: issueSuggestions.fieldValues.labels
          }),
          ...(issueSuggestions.fieldValues.components && {
            components: issueSuggestions.fieldValues.components
          }),
          ...(issueSuggestions.fieldValues.environment && {
            environment: issueSuggestions.fieldValues.environment
          }),
          ...(issueSuggestions.fieldValues.assignee && {
            assignee: issueSuggestions.fieldValues.assignee
          }),
          ...(issueSuggestions.fieldValues.reporter && {
            reporter: issueSuggestions.fieldValues.reporter
          })
        }
      },
      timestamp: new Date().toISOString()
    };

    console.log(`Request completed successfully - Generated suggestions for ${projectKey}`);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Pipeline error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Failed to process request',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
