"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Toolbar } from "./components/toolbar";
import { Sidebar } from "./components/sidebar";
import { CrossBrowserSection } from "./components/cross-browser-section";
import { CapturedSection } from "./components/captured-section";
import { fetchJiraProjectFields, type JiraFieldsResponse } from "@/lib/utils/jira-api";

interface CapturedMedia {
  id: string;
  type: 'video' | 'screenshot';
  src: string;
  timestamp: string;
  selected: boolean;
}

export default function BugCapturePage() {
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isSessionCapturing, setIsSessionCapturing] = useState(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentImage, setCurrentImage] = useState("/browser-screnshot.jpg");
  const [isAppLiveMode, setIsAppLiveMode] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [logContent, setLogContent] = useState("");
  const [hasRecordedVideo, setHasRecordedVideo] = useState(false);
  const [currentSection, setCurrentSection] = useState<'cross-browser' | 'captured'>('cross-browser');
  const [capturedMedia, setCapturedMedia] = useState<CapturedMedia[]>([]);
  const [jiraProjectData, setJiraProjectData] = useState<JiraFieldsResponse | null>(null);
  const [jiraLoading, setJiraLoading] = useState(false);
  const [jiraError, setJiraError] = useState<string | null>(null);

  // Initialize toolbar position to center top
  useEffect(() => {
    const centerX = (window.innerWidth - 600) / 2; // Approximate toolbar width
    setToolbarPosition({ x: centerX, y: 20 });
  }, []);

  const handleScreenshotCapture = () => {
    // Create a new screenshot entry
    const newScreenshot: CapturedMedia = {
      id: Date.now().toString(),
      type: 'screenshot',
      src: currentImage, // Use current browser image as screenshot
      timestamp: new Date().toLocaleTimeString(),
      selected: true
    };
    
    // Add to captured media list
    setCapturedMedia(prev => [...prev, newScreenshot]);
    
    // Navigate to captured section
    setHasRecordedVideo(true);
    setCurrentSection('captured');
    
    console.log("Screenshot captured:", newScreenshot);
  };

  const handleVideoToggle = () => {
    if (isVideoRecording) {
      // Stop recording
      setIsVideoRecording(false);
      setIsRecordingPaused(false);
      setRecordingTime(0);
    } else {
      // Start recording
      setIsVideoRecording(true);
      setIsRecordingPaused(false);
      setRecordingTime(0);
    }
    console.log("Video recording:", !isVideoRecording);
  };

  const handleRecordingPause = () => {
    setIsRecordingPaused(!isRecordingPaused);
    console.log("Recording paused:", !isRecordingPaused);
  };

  const handleStopRecording = () => {
    setIsVideoRecording(false);
    setIsRecordingPaused(false);
    setRecordingTime(0);
    
    // Create a new video entry
    const newVideo: CapturedMedia = {
      id: Date.now().toString(),
      type: 'video',
      src: '/recorded-screen.webm',
      timestamp: `${new Date().toLocaleTimeString()} - ${new Date().toLocaleTimeString()}`,
      selected: true
    };
    
    // Add to captured media list
    setCapturedMedia(prev => [...prev, newVideo]);
    
    // Navigate to captured section
    setHasRecordedVideo(true);
    setCurrentSection('captured');
    
    // Load the log content
    fetch('/sample.log')
      .then(response => response.text())
      .then(data => setLogContent(data))
      .catch(error => console.error('Error loading log:', error));
    console.log("Recording stopped");
  };

  const fetchJiraProjectData = async () => {
    console.log('🔄 Starting Jira data fetch...');
    console.log('🔧 Environment check - JIRA_URL:', process.env.NEXT_PUBLIC_JIRA_URL ? 'Set' : 'Not set');
    console.log('🔧 Environment check - JIRA_EMAIL:', process.env.NEXT_PUBLIC_JIRA_EMAIL ? 'Set' : 'Not set');
    console.log('🔧 Environment check - JIRA_API_TOKEN:', process.env.NEXT_PUBLIC_JIRA_API_TOKEN ? 'Set' : 'Not set');
    
    setJiraLoading(true);
    setJiraError(null);
    
    try {
      console.log('📡 Calling fetchJiraProjectFields with PMT...');
      const projectData = await fetchJiraProjectFields('PMT');
      console.log('✅ Jira data received:', projectData);
      setJiraProjectData(projectData);
    } catch (error) {
      console.error('❌ Error fetching Jira project data:', error);
      setJiraError(error instanceof Error ? error.message : 'Failed to fetch Jira project data');
    } finally {
      setJiraLoading(false);
      console.log('🏁 Jira data fetch completed');
    }
  };

  const handleNavigateToCaptured = async () => {
    console.log('🎯 Navigating to captured section...');
    console.log('📊 Current state - jiraProjectData:', jiraProjectData, 'jiraLoading:', jiraLoading);
    
    setCurrentSection('captured');
    
    // Fetch Jira project data when navigating to captured section
    if (!jiraProjectData && !jiraLoading) {
      console.log('🚀 Triggering Jira data fetch...');
      await fetchJiraProjectData();
    } else {
      console.log('⏭️ Skipping Jira data fetch - already loaded or loading');
    }
  };

  const handleNavigateToCrossBrowser = () => {
    setCurrentSection('cross-browser');
  };

  const handleSessionToggle = () => {
    setIsSessionCapturing(!isSessionCapturing);
    console.log("Session capturing:", !isSessionCapturing);
  };

  const handleIntegrations = () => {
    console.log("Integrations clicked");
    // Manually trigger Jira data fetch for testing
    if (!jiraProjectData && !jiraLoading) {
      fetchJiraProjectData();
    }
  };

  const handleStopSession = () => {
    console.log("Stopping session and logging out user");
    
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to stop the session and log out?");
    if (!confirmed) {
      return;
    }
    
    // Stop any ongoing recordings or sessions
    if (isVideoRecording) {
      setIsVideoRecording(false);
      setIsRecordingPaused(false);
      setRecordingTime(0);
    }
    if (isSessionCapturing) {
      setIsSessionCapturing(false);
    }
    // Logout the user and redirect to login page
    signOut({ callbackUrl: '/login' });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSwitchBrowser = () => {
    if (isAppLiveMode) {
      setCurrentImage("/browser-screnshot.jpg");
      setIsAppLiveMode(false);
    } else {
      setCurrentImage("/app-live.jpg");
      setIsAppLiveMode(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX - toolbarPosition.x;
    const startY = e.clientY - toolbarPosition.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Approximate toolbar dimensions (adjust as needed)
      const toolbarWidth = 600;
      const toolbarHeight = 60;
      
      // Constrain to viewport boundaries
      const constrainedX = Math.max(0, Math.min(newX, viewportWidth - toolbarWidth));
      const constrainedY = Math.max(0, Math.min(newY, viewportHeight - toolbarHeight));
      
      setToolbarPosition({
        x: constrainedX,
        y: constrainedY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Timer effect for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isVideoRecording && !isRecordingPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVideoRecording, isRecordingPaused]);

  // Auto-fetch Jira data when component mounts (for testing)
  useEffect(() => {
    console.log('🚀 Component mounted, checking if we should fetch Jira data...');
    if (!jiraProjectData && !jiraLoading) {
      console.log('🔄 Auto-fetching Jira data on mount...');
      fetchJiraProjectData();
    }
  }, []); // Empty dependency array means this runs once on mount

    return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        isAppLiveMode={isAppLiveMode}
        onToggleSidebar={toggleSidebar}
        onSwitchBrowser={handleSwitchBrowser}
        onStopSession={handleStopSession}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Toolbar */}
        <Toolbar
          isVideoRecording={isVideoRecording}
          isRecordingPaused={isRecordingPaused}
          recordingTime={recordingTime}
          isSessionCapturing={isSessionCapturing}
          isMicrophoneOn={isMicrophoneOn}
          isWebcamOn={isWebcamOn}
          isDragging={isDragging}
          toolbarPosition={toolbarPosition}
          hasRecordedVideo={hasRecordedVideo}
          currentSection={currentSection}
          onScreenshotCapture={handleScreenshotCapture}
          onVideoToggle={handleVideoToggle}
          onRecordingPause={handleRecordingPause}
          onStopRecording={handleStopRecording}
          onSessionToggle={handleSessionToggle}
          onMicrophoneToggle={setIsMicrophoneOn}
          onWebcamToggle={setIsWebcamOn}
              onMouseDown={handleMouseDown}
          onIntegrations={handleIntegrations}
          onNavigateToCaptured={handleNavigateToCaptured}
          onNavigateToCrossBrowser={handleNavigateToCrossBrowser}
        />

      {/* Main Content Area */}
        {currentSection === 'cross-browser' ? (
          <CrossBrowserSection
            isSidebarCollapsed={isSidebarCollapsed}
            currentImage={currentImage}
            showVideoPlayer={false}
            logContent={logContent}
          />
        ) : (
          <CapturedSection
            isSidebarCollapsed={isSidebarCollapsed}
            logContent={logContent}
            capturedMedia={capturedMedia}
            jiraProjectData={jiraProjectData}
            jiraLoading={jiraLoading}
            jiraError={jiraError}
            onRetryJiraFetch={fetchJiraProjectData}
          />
        )}
      </div>
    </div>
  );
}
