"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Toolbar } from "./components/toolbar";
import { Sidebar } from "./components/sidebar";
import { CrossBrowserSection } from "./components/cross-browser-section";
import { CapturedSection } from "./components/captured-section";
import { fetchJiraProjectFields, type JiraFieldsResponse } from "@/lib/utils/jira-api";
import { CapturedMedia } from "@/types/common";
import { CheckCircle, Clock, FileText, User, Tag, AlertCircle } from "lucide-react";

// Remove this interface since we're importing it from types/common.ts

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
  const [selectedProject, setSelectedProject] = useState<string>("PMT");
  const [screenshotStartTime, setScreenshotStartTime] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [formData, setFormData] = useState<any>(null);

  // Initialize toolbar position to center top
  useEffect(() => {
    const centerX = (window.innerWidth - 600) / 2; // Approximate toolbar width
    setToolbarPosition({ x: centerX, y: 20 });
  }, []);

  const handleScreenshotCapture = () => {
    // Start the timer when screenshot is captured
    setScreenshotStartTime(Date.now());
    
    // Create a new screenshot entry
    const newScreenshot: CapturedMedia = {
      id: Date.now().toString(),
      type: 'screenshot',
      src: currentImage, // Use current browser image as screenshot
      timestamp: new Date().toLocaleTimeString(),
      selected: true,
      annotations: [],
      annotatedSrc: undefined
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
      selected: true,
      annotations: [],
      annotatedSrc: undefined
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

  const handleProjectChange = async (projectKey: string) => {
    console.log('Project changed to:', projectKey);
    setSelectedProject(projectKey);
    await fetchJiraProjectData(projectKey);
  };

  const fetchJiraProjectData = async (projectKey: string = selectedProject) => {
    console.log('🔄 Starting Jira data fetch for project:', projectKey);
    console.log('🔧 Environment check - JIRA_URL:', process.env.NEXT_PUBLIC_JIRA_URL ? 'Set' : 'Not set');
    console.log('🔧 Environment check - JIRA_EMAIL:', process.env.NEXT_PUBLIC_JIRA_EMAIL ? 'Set' : 'Not set');
    console.log('🔧 Environment check - JIRA_API_TOKEN:', process.env.NEXT_PUBLIC_JIRA_API_TOKEN ? 'Set' : 'Not set');
    
    setJiraLoading(true);
    setJiraError(null);
    
    try {
      console.log('📡 Calling fetchJiraProjectFields with', projectKey, '...');
      const projectData = await fetchJiraProjectFields(projectKey);
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

  const handleUpdateCapturedMedia = (updatedMedia: CapturedMedia[]) => {
    setCapturedMedia(updatedMedia);
  };

  const handleCreateJira = (formData: any) => {
    if (screenshotStartTime) {
      const endTime = Date.now();
      const timeElapsed = Math.round((endTime - screenshotStartTime) / 1000); // Convert to seconds
      setTimeTaken(timeElapsed);
      setFormData(formData);
      setShowSuccessModal(true);
    }
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
          selectedProject={selectedProject}
          onProjectChange={handleProjectChange}
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
            key={selectedProject} // Force re-render when project changes
            isSidebarCollapsed={isSidebarCollapsed}
            logContent={logContent}
            capturedMedia={capturedMedia}
            jiraProjectData={jiraProjectData}
            jiraLoading={jiraLoading}
            jiraError={jiraError}
            onRetryJiraFetch={fetchJiraProjectData}
            onUpdateCapturedMedia={handleUpdateCapturedMedia}
            onCreateJira={handleCreateJira}
            isVisible={currentSection === 'captured'}
          />
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-xl font-bold text-white">🎉 Jira Issue Created Successfully!</h2>
                    <p className="text-green-100 text-sm">Your bug report has been submitted</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Time Taken */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      ⚡ Lightning Fast Bug Reporting!
                    </h3>
                    <p className="text-blue-700">
                      You created this Jira issue in just <span className="font-bold text-blue-900">{timeTaken} seconds</span> from screenshot to submission!
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Data Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Issue Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
                    <p className="text-gray-900">{formData?.summary || 'No summary provided'}</p>
                  </div>

                  {/* Project */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      Project
                    </h4>
                    <p className="text-gray-900">{formData?.project || 'PMT'}</p>
                  </div>

                  {/* Issue Type */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Issue Type</h4>
                    <p className="text-gray-900">{formData?.issueType || 'Not specified'}</p>
                  </div>

                  {/* Priority */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Priority</h4>
                    <p className="text-gray-900">{formData?.priority || 'Not specified'}</p>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Status</h4>
                    <p className="text-gray-900">{formData?.status || 'Not specified'}</p>
                  </div>

                  {/* Assignee */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Assignee
                    </h4>
                    <p className="text-gray-900">{formData?.assignee || 'Unassigned'}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData?.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>This is a mockup - no actual Jira issue was created</span>
                  </div>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
