import { NextRequest, NextResponse } from 'next/server';

interface JiraField {
  id: string;
  name: string;
  required: boolean;
  schema: {
    type: string;
    system?: string;
  };
  allowedValues?: any[];
}

interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  subtask?: boolean;
  fields: Record<string, JiraField>;
}

interface JiraProject {
  id: string;
  key: string;
  name: string;
  issueTypes: JiraIssueType[];
}

interface ApiResponse {
  project: {
    id: string;
    key: string;
    name: string;
  };
  issueTypes: Array<{
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
    subtask?: boolean;
    requiredFields: JiraField[];
    optionalFields: JiraField[];
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey');

    if (!projectKey) {
      return NextResponse.json(
        { error: 'Project key is required' },
        { status: 400 }
      );
    }

    // Get Jira credentials from environment variables
    const jiraUrl = process.env.JIRA_URL;
    const email = process.env.JIRA_EMAIL;
    const apiToken = process.env.JIRA_API_TOKEN;

    if (!jiraUrl || !email || !apiToken) {
      return NextResponse.json(
        { error: 'Jira credentials not configured' },
        { status: 500 }
      );
    }

    // Step 1: Get all issue types for the project
    const issueTypesResponse = await fetch(
      `${jiraUrl}/rest/api/3/project/${projectKey}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!issueTypesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch project information' },
        { status: issueTypesResponse.status }
      );
    }

    const projectData = await issueTypesResponse.json();
    const issueTypes = projectData.issueTypes || [];

    // Step 2: Get fields for each issue type
    const issueTypesWithFields = await Promise.all(
      issueTypes.map(async (issueType: any) => {
        try {
          const fieldsResponse = await fetch(
            `${jiraUrl}/rest/api/3/issue/createmeta?` +
            `projectKeys=${projectKey}&` +
            `issuetypeNames=${issueType.name}&` +
            `expand=projects.issuetypes.fields`,
            {
              headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json'
              }
            }
          );

          if (!fieldsResponse.ok) {
            console.warn(`Failed to fetch fields for issue type: ${issueType.name}`);
            return {
              id: issueType.id,
              name: issueType.name,
              description: issueType.description,
              iconUrl: issueType.iconUrl,
              subtask: issueType.subtask,
              requiredFields: [],
              optionalFields: []
            };
          }

          const fieldsData = await fieldsResponse.json();
          const fields = fieldsData.projects?.[0]?.issuetypes?.[0]?.fields || {};

          // Separate required and optional fields
          const requiredFields: JiraField[] = [];
          const optionalFields: JiraField[] = [];

          Object.entries(fields).forEach(([key, field]: [string, any]) => {
            const fieldInfo: JiraField = {
              id: key,
              name: field.name,
              required: field.required,
              schema: field.schema,
              allowedValues: field.allowedValues
            };

            if (field.required) {
              requiredFields.push(fieldInfo);
            } else {
              optionalFields.push(fieldInfo);
            }
          });

          return {
            id: issueType.id,
            name: issueType.name,
            description: issueType.description,
            iconUrl: issueType.iconUrl,
            subtask: issueType.subtask,
            requiredFields,
            optionalFields
          };
        } catch (error) {
          console.error(`Error fetching fields for issue type ${issueType.name}:`, error);
          return {
            id: issueType.id,
            name: issueType.name,
            description: issueType.description,
            iconUrl: issueType.iconUrl,
            subtask: issueType.subtask,
            requiredFields: [],
            optionalFields: []
          };
        }
      })
    );

    const response: ApiResponse = {
      project: {
        id: projectData.id,
        key: projectData.key,
        name: projectData.name
      },
      issueTypes: issueTypesWithFields
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in Jira fields API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
