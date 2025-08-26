// jira-fields.js
require('dotenv').config({ path: '.env.local' });

async function getFieldsForIssueType(projectKey, issueTypeName) {
    // Get Jira credentials from environment variables
    const jiraUrl = process.env.JIRA_URL || 'https://increff.atlassian.net/';
    const email = process.env.JIRA_EMAIL || 'alaf.azam@increff.com';
    const apiToken = process.env.JIRA_API_TOKEN;
    
    if (!apiToken) {
        console.error('Error: JIRA_API_TOKEN environment variable is required');
        console.error('Please add JIRA_API_TOKEN to your .env.local file');
        process.exit(1);
    }
    
    try {
      // Get fields for specific issue type
      const response = await fetch(
        `${jiraUrl}/rest/api/3/issue/createmeta?` +
        `projectKeys=${projectKey}&` +
        `issuetypeNames=${issueTypeName}&` +
        `expand=projects.issuetypes.fields`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
            'Accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.projects && data.projects[0] && data.projects[0].issuetypes[0]) {
        const fields = data.projects[0].issuetypes[0].fields;
        
        console.log('=================================');
        console.log(`Fields for ${issueTypeName} in ${projectKey}`);
        console.log('=================================\n');
        
        console.log('REQUIRED FIELDS:');
        console.log('----------------');
        Object.entries(fields).forEach(([key, field]) => {
          if (field.required) {
            console.log(`✓ ${field.name}`);
            console.log(`  ID: ${key}`);
            console.log(`  Type: ${field.schema.type}`);
            console.log('');
          }
        });
        
        console.log('\nOPTIONAL FIELDS:');
        console.log('----------------');
        Object.entries(fields).forEach(([key, field]) => {
          if (!field.required) {
            console.log(`○ ${field.name}`);
            console.log(`  ID: ${key}`);
            console.log(`  Type: ${field.schema.type}`);
            if (field.allowedValues) {
              console.log(`  Allowed Values: ${field.allowedValues.length} options`);
            }
            console.log('');
          }
        });
        
        return fields;
      } else {
        console.log('No data found. Check your project key and issue type name.');
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  }
  
  // CHANGE THESE TO YOUR PROJECT AND ISSUE TYPE
  getFieldsForIssueType('PMT', 'Task');  // Replace 'PMT' with your project key and 'Task' with your issue type