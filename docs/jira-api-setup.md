# Jira Fields API Setup

This document explains how to set up and use the Jira Fields API to fetch issue types and their required fields for a Jira project.

## Environment Variables

Create a `.env.local` file in your project root and add the following Jira credentials:

```env
# Jira Configuration
JIRA_URL=https://your-company.atlassian.net/
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

### Getting Your Jira API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label (e.g., "Bug Capture App")
4. Copy the generated token

## API Endpoint

### GET `/api/jira/fields`

Fetches all issue types and their fields for a Jira project.

**Query Parameters:**
- `projectKey` (required): The Jira project key (e.g., 'PMT', 'PROJ')

**Example Request:**
```bash
GET /api/jira/fields?projectKey=PMT
```

**Response:**
```json
{
  "project": {
    "id": "12345",
    "key": "PMT",
    "name": "Project Management Tool"
  },
  "issueTypes": [
    {
      "id": "10001",
      "name": "Bug",
      "description": "A problem which impairs or prevents the functions of the product.",
      "iconUrl": "https://...",
      "subtask": false,
      "requiredFields": [
        {
          "id": "summary",
          "name": "Summary",
          "required": true,
          "schema": {
            "type": "string",
            "system": "summary"
          }
        },
        {
          "id": "description",
          "name": "Description",
          "required": true,
          "schema": {
            "type": "string",
            "system": "description"
          }
        }
      ],
      "optionalFields": [
        {
          "id": "priority",
          "name": "Priority",
          "required": false,
          "schema": {
            "type": "option",
            "system": "priority"
          },
          "allowedValues": [...]
        }
      ]
    }
  ]
}
```

## Frontend Usage

### Using the Utility Functions

```typescript
import { 
  fetchJiraProjectFields, 
  fetchRequiredFieldsForIssueType,
  fetchIssueTypes 
} from '@/lib/utils/jira-api';

// Fetch all issue types and fields for a project
const projectData = await fetchJiraProjectFields('PMT');

// Fetch only required fields for a specific issue type
const requiredFields = await fetchRequiredFieldsForIssueType('PMT', 'Bug');

// Fetch only issue types (without fields)
const issueTypes = await fetchIssueTypes('PMT');
```

### Using the Example Component

```typescript
import { JiraFieldsExample } from '@/components/examples/jira-fields-example';

export default function MyPage() {
  return (
    <div>
      <h1>Jira Integration</h1>
      <JiraFieldsExample />
    </div>
  );
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `400`: Missing project key
- `401`: Invalid Jira credentials
- `404`: Project not found
- `500`: Internal server error or missing environment variables

## Rate Limiting

The API makes multiple requests to Jira (one for project info + one for each issue type). Consider implementing caching if you need to call this frequently.

## Security Notes

- Never commit your `.env.local` file to version control
- The API token should have read access to the projects you want to access
- Consider implementing authentication/authorization for the API endpoint in production

## Troubleshooting

### Common Issues

1. **"Jira credentials not configured"**
   - Check that all environment variables are set in `.env.local`
   - Restart your development server after adding environment variables

2. **"Failed to fetch project information"**
   - Verify the project key is correct
   - Check that your API token has access to the project
   - Ensure the Jira URL is correct (include trailing slash)

3. **"Issue type not found"**
   - Check the exact spelling of the issue type name
   - Issue type names are case-sensitive

### Debug Mode

To see detailed error information, check the browser console and server logs when making API calls.
