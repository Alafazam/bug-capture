import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('AI Suggestions Test API called');
    
    // Check environment variables
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    return NextResponse.json({
      success: true,
      message: 'AI Suggestions API is working',
      environment: {
        hasOpenAIKey,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
