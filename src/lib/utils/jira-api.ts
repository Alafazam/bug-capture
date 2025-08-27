import { z } from 'zod';

// Schema for the API response
const JiraFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  required: z.boolean(),
  schema: z.object({
    type: z.string(),
    system: z.string().optional(),
  }),
  allowedValues: z.array(z.any()).optional(),
});

const JiraIssueTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  subtask: z.boolean().optional(),
  requiredFields: z.array(JiraFieldSchema),
  optionalFields: z.array(JiraFieldSchema),
});

const JiraFieldsResponseSchema = z.object({
  project: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }),
  issueTypes: z.array(JiraIssueTypeSchema),
});

const JiraProjectSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  projectTypeKey: z.string(),
  simplified: z.boolean(),
  style: z.string(),
  isPrivate: z.boolean(),
  lead: z.object({
    accountId: z.string(),
    displayName: z.string(),
  }).optional(),
  avatarUrls: z.object({
    '16x16': z.string(),
    '24x24': z.string(),
    '32x32': z.string(),
    '48x48': z.string(),
  }),
});

const JiraProjectsResponseSchema = z.object({
  projects: z.array(JiraProjectSchema),
});

export type JiraField = z.infer<typeof JiraFieldSchema>;
export type JiraIssueType = z.infer<typeof JiraIssueTypeSchema>;
export type JiraFieldsResponse = z.infer<typeof JiraFieldsResponseSchema>;
export type JiraProject = z.infer<typeof JiraProjectSchema>;
export type JiraProjectsResponse = z.infer<typeof JiraProjectsResponseSchema>;

/**
 * Fetches all available Jira projects (top 5)
 * @returns Promise with the list of projects
 */
export async function fetchJiraProjects(): Promise<JiraProjectsResponse> {
  console.log('Making API call to: /api/jira/projects');
  
  const response = await fetch('/api/jira/projects?t=' + Date.now());
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('API Error:', errorData);
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Raw API response:', data);
  
  const parsedData = JiraProjectsResponseSchema.parse(data);
  console.log('Parsed data:', parsedData);
  
  return parsedData;
}

/**
 * Fetches all issue types and their fields for a Jira project
 * @param projectKey - The Jira project key (e.g., 'PMT', 'PROJ')
 * @returns Promise with the project's issue types and their fields
 */
export async function fetchJiraProjectFields(projectKey: string): Promise<JiraFieldsResponse> {
  console.log('Making API call to:', `/api/jira/fields?projectKey=${encodeURIComponent(projectKey)}`);
  
  const response = await fetch(`/api/jira/fields?projectKey=${encodeURIComponent(projectKey)}`);
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('API Error:', errorData);
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Raw API response:', data);
  
  const parsedData = JiraFieldsResponseSchema.parse(data);
  console.log('Parsed data:', parsedData);
  
  return parsedData;
}

/**
 * Gets all required fields for a specific issue type
 * @param projectKey - The Jira project key
 * @param issueTypeName - The name of the issue type (e.g., 'Bug', 'Task', 'Story')
 * @returns Promise with the required fields for the issue type
 */
export async function fetchRequiredFieldsForIssueType(
  projectKey: string, 
  issueTypeName: string
): Promise<JiraField[]> {
  const projectData = await fetchJiraProjectFields(projectKey);
  
  const issueType = projectData.issueTypes.find(
    it => it.name.toLowerCase() === issueTypeName.toLowerCase()
  );
  
  if (!issueType) {
    throw new Error(`Issue type '${issueTypeName}' not found in project '${projectKey}'`);
  }
  
  return issueType.requiredFields;
}

/**
 * Gets all available issue types for a project
 * @param projectKey - The Jira project key
 * @returns Promise with the list of issue types
 */
export async function fetchIssueTypes(projectKey: string): Promise<JiraIssueType[]> {
  const projectData = await fetchJiraProjectFields(projectKey);
  return projectData.issueTypes;
}
