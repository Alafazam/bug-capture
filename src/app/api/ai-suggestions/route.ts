import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LOG_ANALYZER_PROMPT } from '@/lib/prompts/ai-suggestions';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate OpenAI configuration
if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is not configured');
}

interface LogAnalysis {
  ticket: string;
  summary: string;
}

interface AISuggestionsRequest {
  logs: string;
  keywords?: string;
  mediaContext?: string;
  media?: Array<{
    type: string;
    timestamp: string;
    selected: boolean;
  }>;
  context?: {
    timestamp?: string;
    userAgent?: string;
    source?: string;
    [key: string]: unknown;
  };
}

interface AISuggestionsResponse {
  success: boolean;
  suggestions?: {
    title: string;
    summary: string;
  };
  error?: string;
}

// Agent 1: Analyze Logs Function (same as in issue-suggestions)
async function analyzeLogsWithAgent1(logs: string, context: Record<string, unknown>): Promise<{ analysis: LogAnalysis; rawResponse: string }> {
  try {
    const keywords = (context.keywords as string) || '';
    const mediaContext = (context.mediaContext as string) || '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system", 
        content: LOG_ANALYZER_PROMPT
      }, {
        role: "user",
        content: `Console Logs:\n${logs}\n\nKeywords: ${keywords.trim() || 'None provided'}\n\nMedia Context: ${mediaContext.trim() || 'None provided'}\n\nContext:\n${JSON.stringify(context, null, 2)}`
      }],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content || '';
    
    // Debug: Log the raw response
    console.log('Raw Agent 1 response:', content);
    
    // Clean up response - sometimes AI adds markdown code blocks
    // Handle various formats: ```json {...} ```, ``` {...} ```, or just {...}
    let jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (!jsonMatch) {
      // Try to find JSON object without markdown blocks
      jsonMatch = content.match(/\{[\s\S]*\}/);
    }
    
    let jsonContent = content;
    if (jsonMatch && jsonMatch[1]) {
      jsonContent = jsonMatch[1];
    }
    
    console.log('JSON content to parse:', jsonContent);
    
    try {
      // Clean up the JSON content - handle unescaped newlines and other common issues
      let cleanedJsonContent = jsonContent;
      
      // Replace unescaped newlines in string values with escaped newlines
      cleanedJsonContent = cleanedJsonContent.replace(/\n/g, '\\n');
      
      // Also handle other common JSON formatting issues
      cleanedJsonContent = cleanedJsonContent.replace(/\r/g, '\\r');
      cleanedJsonContent = cleanedJsonContent.replace(/\t/g, '\\t');
      
      console.log('Cleaned JSON content:', cleanedJsonContent);
      
      const analysis = JSON.parse(cleanedJsonContent);
      return { analysis, rawResponse: content };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      console.error('JSON content to parse:', jsonContent);
      
      // Try a more aggressive cleanup approach
      try {
        // Remove all newlines and extra whitespace from the JSON
        const aggressiveCleanup = jsonContent
          .replace(/\n/g, ' ')
          .replace(/\r/g, ' ')
          .replace(/\t/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        console.log('Aggressive cleanup attempt:', aggressiveCleanup);
        const analysis = JSON.parse(aggressiveCleanup);
        return { analysis, rawResponse: content };
      } catch (secondParseError) {
        console.error('Second parse attempt failed:', secondParseError);
        
        // If all parsing fails, create a fallback analysis
        const analysis: LogAnalysis = {
          ticket: "Failed to parse AI response",
          summary: content
        };
        return { analysis, rawResponse: content };
      }
    }
  } catch (error) {
    console.error('Agent 1 Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Log analysis failed: ${errorMessage}`);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<AISuggestionsResponse>> {
  try {
    console.log('AI Suggestions API called');
    
    const body: AISuggestionsRequest = await request.json();
    const { logs, keywords = '', mediaContext = '', media = [], context = {} } = body;

    console.log('Request data:', {
      logsLength: logs?.length || 0,
      keywords: keywords?.length || 0,
      mediaContext: mediaContext?.length || 0,
      mediaCount: media?.length || 0
    });

    // Validate required fields
    if (!logs) {
      console.log('Validation failed: logs content is required');
      return NextResponse.json(
        { success: false, error: 'Logs content is required' },
        { status: 400 }
      );
    }

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file. See README.md for setup instructions.' 
        },
        { status: 500 }
      );
    }

    // Prepare context for Agent 1
    const agentContext = {
      ...context,
      keywords: keywords.trim(),
      mediaContext: mediaContext.trim(),
      media: media.map(m => ({
        type: m.type,
        timestamp: m.timestamp,
        selected: m.selected
      })),
      timestamp: (context as Record<string, unknown>).timestamp as string || new Date().toISOString(),
      source: (context as Record<string, unknown>).source as string || 'bug-capture-tool'
    };

    // Call Agent 1 - Log Analysis
    console.log('Running Agent 1: Log Analysis...');
    console.log('Logs content length:', logs.length);
    console.log('Logs preview:', logs.substring(0, 200) + '...');
    
    const { analysis: logAnalysis, rawResponse: rawAgent1Response } = await analyzeLogsWithAgent1(logs, agentContext);

    // Validate the analysis response
    if (!logAnalysis.ticket || !logAnalysis.summary) {
      console.error('Invalid analysis response:', logAnalysis);
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI analysis returned invalid response' 
        },
        { status: 500 }
      );
    }

    // Return simplified response with just title and summary
    const response = {
      success: true,
      suggestions: {
        title: logAnalysis.ticket,
        summary: logAnalysis.summary
      },
      rawAgent1Response,
      timestamp: new Date().toISOString()
    };

    console.log('Agent 1 analysis completed successfully');
    console.log('Response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('AI suggestions error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
