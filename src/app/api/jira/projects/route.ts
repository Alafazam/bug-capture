import { NextRequest, NextResponse } from 'next/server';

interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  lead: {
    accountId: string;
    displayName: string;
  };
  avatarUrls: {
    '16x16': string;
    '24x24': string;
    '32x32': string;
    '48x48': string;
  };
  archived?: boolean; // Optional since not all projects have this field
}

interface ApiResponse {
  projects: JiraProject[];
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔗 Jira Projects API called');
    
    // Get Jira credentials from environment variables
    const jiraUrl = process.env.JIRA_URL;
    const email = process.env.JIRA_EMAIL;
    const apiToken = process.env.JIRA_API_TOKEN;

    console.log('📋 Environment variables check:');
    console.log('  JIRA_URL:', jiraUrl ? 'Set' : 'Missing');
    console.log('  JIRA_EMAIL:', email ? 'Set' : 'Missing');
    console.log('  JIRA_API_TOKEN:', apiToken ? 'Set' : 'Missing');

    if (!jiraUrl || !email || !apiToken) {
      console.error('❌ Missing Jira credentials');
      return NextResponse.json(
        { error: 'Jira credentials not configured' },
        { status: 500 }
      );
    }

    const apiUrl = `${jiraUrl}/rest/api/3/project`;
    console.log('🔗 Making request to:', apiUrl);

    // Fetch projects from Jira API
    const projectsResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    });

    console.log('📡 Response status:', projectsResponse.status);
    console.log('📡 Response ok:', projectsResponse.ok);

    if (!projectsResponse.ok) {
      const errorText = await projectsResponse.text();
      console.error('❌ Failed to fetch projects from Jira:', projectsResponse.status, projectsResponse.statusText);
      console.error('❌ Error response:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch projects from Jira', details: errorText },
        { status: projectsResponse.status }
      );
    }

    const projectsData = await projectsResponse.json();
    console.log('Raw projects data:', projectsData);
    console.log('Number of projects received:', projectsData.length);
    
    // Filter out archived projects and sort by name, then take top 10
    const activeProjects = projectsData.filter((project: JiraProject) => !project.archived);
    console.log('Number of active projects:', activeProjects.length);
    
    // Sort projects: PMT first (if exists), then alphabetically
    const sortedProjects = activeProjects
      .sort((a: JiraProject, b: JiraProject) => {
        // PMT should come first
        if (a.key === 'PMT') return -1;
        if (b.key === 'PMT') return 1;
        // Then sort alphabetically
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10); // Increased to 10 to see more projects

    console.log('Sorted and filtered projects:', sortedProjects.map((p: JiraProject) => ({ key: p.key, name: p.name })));

    const response: ApiResponse = {
      projects: sortedProjects
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error in Jira projects API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
