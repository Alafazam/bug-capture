import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LOG_ANALYZER_PROMPT } from '@/lib/prompts/ai-suggestions';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface LogAnalysis {
  ticket: string;
  summary: string;
}

interface AISuggestionsRequest {
  logs: string;
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
      const analysis = JSON.parse(jsonContent);
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

export async function POST(request: NextRequest): Promise<NextResponse<AISuggestionsResponse>> {
  try {
    const body: AISuggestionsRequest = await request.json();
    const { logs, media = [], context = {} } = body;

    // Validate required fields
    if (!logs) {
      return NextResponse.json(
        { success: false, error: 'Logs content is required' },
        { status: 400 }
      );
    }

    // Prepare context for Agent 1
    const agentContext = {
      ...context,
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
    const { analysis: logAnalysis, rawResponse: rawAgent1Response } = await analyzeLogsWithAgent1(logs, agentContext);

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
    return NextResponse.json(response);

  } catch (error) {
    console.error('AI suggestions error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
