"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Maximize, RefreshCw, Sparkles } from "lucide-react";
import { type JiraFieldsResponse } from "@/lib/utils/jira-api";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AISuggestionsPopup } from "./ai-suggestions-popup";

interface CapturedMedia {
  id: string;
  type: 'video' | 'screenshot';
  src: string;
  timestamp: string;
  selected: boolean;
}

interface CapturedSectionProps {
  isSidebarCollapsed: boolean;
  logContent: string;
  capturedMedia: CapturedMedia[];
  jiraProjectData: JiraFieldsResponse | null;
  jiraLoading: boolean;
  jiraError: string | null;
  onRetryJiraFetch: () => Promise<void>;
}

export function CapturedSection({
  isSidebarCollapsed,
  logContent,
  capturedMedia,
  jiraProjectData,
  jiraLoading,
  jiraError,
  onRetryJiraFetch
}: CapturedSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMetadata, setShowMetadata] = useState(false);
  const [selectedIssueType, setSelectedIssueType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);
  const [loadedLogContent, setLoadedLogContent] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load sample.log file on component mount
  useEffect(() => {
    const loadSampleLog = async () => {
      try {
        const response = await fetch('/sample.log');
        if (response.ok) {
          const logText = await response.text();
          setLoadedLogContent(logText);
        }
      } catch (error) {
        console.error('Failed to load sample.log:', error);
      }
    };

    loadSampleLog();
  }, []);

  // Get the selected issue type data
  const selectedIssueTypeData = jiraProjectData?.issueTypes.find(
    it => it.id === selectedIssueType
  );

  // Helper function to filter out common fields
  const filterCommonFields = (fields: any[], excludedFields: string[]) => {
    return fields.filter(field => !excludedFields.includes(field.id));
  };

  // Common field exclusions
  const commonFieldExclusions = ['summary', 'description', 'reporter', 'project', 'issuetype'];
  const additionalFieldExclusions = ['status', 'priority', 'assignee', ...commonFieldExclusions];

  // Set default values when Jira data is loaded
  useEffect(() => {
    if (jiraProjectData && jiraProjectData.issueTypes.length > 0 && !selectedIssueType) {
      const firstIssueType = jiraProjectData.issueTypes[0];
      setSelectedIssueType(firstIssueType.id);
      
      // Set default status if available
      const statusField = firstIssueType.optionalFields.find(f => f.id === 'status');
      if (statusField?.allowedValues && statusField.allowedValues.length > 0) {
        setSelectedStatus(statusField.allowedValues[0].id || statusField.allowedValues[0].value);
      } else {
        setSelectedStatus('triage'); // Default fallback
      }
      
      // Set default priority if available
      const priorityField = firstIssueType.optionalFields.find(f => f.id === 'priority');
      if (priorityField?.allowedValues && priorityField.allowedValues.length > 0) {
        setSelectedPriority(priorityField.allowedValues[0].id || priorityField.allowedValues[0].value);
      } else {
        setSelectedPriority('medium'); // Default fallback
      }
      
      // Set default assignee (Unassigned)
      setSelectedAssignee('');
    }
  }, [jiraProjectData, selectedIssueType]);

  // Update status and priority when issue type changes
  useEffect(() => {
    if (selectedIssueTypeData) {
      // Update status if available
      const statusField = selectedIssueTypeData.optionalFields.find(f => f.id === 'status');
      if (statusField?.allowedValues && statusField.allowedValues.length > 0) {
        const firstStatus = statusField.allowedValues[0].id || statusField.allowedValues[0].value;
        if (firstStatus !== selectedStatus) {
          setSelectedStatus(firstStatus);
        }
      }
      
      // Update priority if available
      const priorityField = selectedIssueTypeData.optionalFields.find(f => f.id === 'priority');
      if (priorityField?.allowedValues && priorityField.allowedValues.length > 0) {
        const firstPriority = priorityField.allowedValues[0].id || priorityField.allowedValues[0].value;
        if (firstPriority !== selectedPriority) {
          setSelectedPriority(firstPriority);
        }
      }
    }
  }, [selectedIssueTypeData, selectedStatus, selectedPriority]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // AI Suggestions handlers
  const handleAIClick = () => {
    setIsAIPopupOpen(true);
  };

  const handleApproveSuggestions = (suggestions: { title: string; summary: string }) => {
    setSummary(suggestions.title);
    setDescription(suggestions.summary);
    setIsAIPopupOpen(false);
  };

  const handleCloseAIPopup = () => {
    setIsAIPopupOpen(false);
  };

  const renderFieldInput = (field: any) => {
    switch (field.schema.type) {
      case 'string':
        return (
          <input
            type="text"
            placeholder={field.name}
            className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
          />
        );
      case 'option':
        return (
          <div className="relative">
            <select className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none rounded">
              <option value="" disabled>
                {field.name}
              </option>
              {field.allowedValues?.map((value: any) => (
                <option key={value.id} value={value.id}>
                  {value.name || value.value}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );
      case 'date':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">{field.name}</span>
            <input
              type="date"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
            />
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.name}
            className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
          />
        );
      case 'array':
        return (
          <input
            type="text"
            placeholder={`${field.name} (comma separated)`}
            className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
          />
        );
      default:
        return (
          <input
            type="text"
            placeholder={field.name}
            className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
          />
        );
    }
  };

  const renderVideoPlayer = (media: CapturedMedia) => {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 relative">
        {/* Checkbox in top right corner */}
        <div className="absolute top-3 right-3 z-10">
          <input
            type="checkbox"
            checked={media.selected}
            onChange={() => {}} // TODO: Add selection handler
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>
        
        {/* Video Player Header */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
          <h3 className="text-gray-700 text-sm font-medium">
            Recorded Session from {media.timestamp}
          </h3>
        </div>
        
        {/* Video Content */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="w-full h-auto"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={media.src} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Video Controls */}
        <div className="bg-gray-800 px-2 py-1">
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-transparent appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f97316 0%, #f97316 ${(currentTime / (duration || 1)) * 100}%, #374151 ${(currentTime / (duration || 1)) * 100}%, #374151 100%)`
              }}
            />
          </div>
          
          {/* Control Bar */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              {/* Play/Pause Button */}
              <button 
                onClick={handlePlayPause}
                className="hover:bg-gray-700 p-1 rounded transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              
              {/* Time Display */}
              <span className="text-xs font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Audio Toggle */}
              <button 
                onClick={handleMuteToggle}
                className="hover:bg-gray-700 p-1 rounded transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              
              {/* Fullscreen Button */}
              <button 
                onClick={handleFullscreen}
                className="hover:bg-gray-700 p-1 rounded transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
                  </div>
      </div>
    </div>
  );
}

  const renderScreenshot = (media: CapturedMedia) => {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 relative">
        {/* Checkbox in top right corner */}
        <div className="absolute top-3 right-3 z-10">
          <input
            type="checkbox"
            checked={media.selected}
            onChange={() => {}} // TODO: Add selection handler
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>
        
        {/* Screenshot Header */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
          <h3 className="text-gray-700 text-sm font-medium">
            Screenshot captured at {media.timestamp}
          </h3>
        </div>
        
        {/* Screenshot Image */}
        <div className="p-4">
          <img 
            src={media.src} 
            alt="Captured Screenshot" 
            className="w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`pt-20 px-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'ml-0' : ''
    }`}>
      <div className="flex gap-6 transition-all duration-500">
        {/* Captured Media Column - 60% width */}
        <div className="w-[60%]">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto space-y-4 pr-2">
            {capturedMedia.map((media) => (
              <div key={media.id} className="relative">
                {media.type === 'video' ? renderVideoPlayer(media) : renderScreenshot(media)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Column - 40% width */}
        <div className="w-[40%] space-y-4">
          {/* Console Log - Collapsible */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="console-log" className="border border-border [&[data-state=closed]]:border-b-border [&[data-state=open]]:border-b-border" style={{ borderBottomWidth: '1px' }}>
              <AccordionTrigger className="bg-muted px-4 py-2 hover:no-underline border-b border-border">
                <h3 className="text-sm font-medium">Console Log</h3>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <textarea
                  value={loadedLogContent || logContent}
                  readOnly
                  className="w-full h-32 resize-none bg-muted border border-input p-3 text-sm font-mono focus:outline-none overflow-y-auto"
                  placeholder="Loading console log..."
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Jira Integrations Card */}
          <div className="bg-card border border-border">
            <div className="bg-muted px-4 py-2 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-medium">Jira Integration</h3>
              {jiraLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Loading Jira data...
                </div>
              )}
            </div>
            <div className="p-4">
              {jiraError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm mb-2">{jiraError}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onRetryJiraFetch}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                </div>
              )}
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create New Jira</TabsTrigger>
                  <TabsTrigger value="update">Update Existing Jira</TabsTrigger>
                </TabsList>
                
                <TabsContent value="create" className="mt-2">
                  <div className="space-y-3"> 
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select 
                          className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none rounded"
                          disabled={jiraLoading || !jiraProjectData}
                          value={selectedIssueType}
                          onChange={(e) => setSelectedIssueType(e.target.value)}
                        >
                          <option value="" disabled>
                            Issue Type
                          </option>
                          {jiraProjectData?.issueTypes.map((issueType) => (
                            <option key={issueType.id} value={issueType.id}>
                              {issueType.name}
                              {issueType.subtask && ' (Subtask)'}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <select 
                          className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none rounded"
                          disabled={!selectedIssueTypeData}
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          <option value="" disabled>
                            Status
                          </option>
                          {selectedIssueTypeData?.optionalFields
                            .find(f => f.id === 'status')?.allowedValues?.map((value: any) => (
                              <option key={value.id} value={value.id}>
                                {value.name || value.value}
                              </option>
                            )) || [
                              { id: 'todo', name: 'To Do' },
                              { id: 'inprogress', name: 'In Progress' },
                              { id: 'done', name: 'Done' }
                            ].map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.name}
                              </option>
                            ))
                          }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Summary and Description */}
                    <div className="space-y-3">
                      {/* Summary */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                          placeholder="Summary"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="AI Assistant"
                          onClick={handleAIClick}
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Description */}
                      <div>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter the issue description here"
                          className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded resize-none"
                          rows={4}
                        />
                      </div>
                      
                      {/* Metadata Toggle */}
                      <div>
                        <button 
                          onClick={() => setShowMetadata(!showMetadata)}
                          className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center"
                        >
                          Additional meta data what will get added with description
                        </button>
                      </div>
                      
                      {/* Metadata Content */}
                      {showMetadata && (
                        <div className="mt-2">
                          <textarea
                            value={`Device: Google Pixel 9
Browser: Mobile_chrome
Operating System: Android 15.0
Resolution: 1080x2424
Screen size: 6.3 in - 5.7 x 2.6 in
Viewport: 412x915 px
Aspect Ratio: 20:9

Screenshot URL: https://live.browserstack.com/issue-tracker/93f8b7833d92c9e734521d0b671238270ec66b78/realdroid_Google_Pixel_9.jpg

Quick Environment URL: https://live.browserstack.com/dashboard#os=OS+X&os_version=Sequoia&browser=Chrome&browser_version=139.0&zoom_to_fit=true&full_screen=true&url=http://localhost:3000/dashboard&speed=1&start=true`}
                            rows={8}
                            className="w-full px-2 py-1 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono rounded"
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Assignee and Priority Fields - Only show if available in Jira */}
                    {(selectedIssueTypeData?.optionalFields.find(f => f.id === 'assignee') || selectedIssueTypeData?.optionalFields.find(f => f.id === 'priority')) && (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Assignee Field */}
                        {selectedIssueTypeData?.optionalFields.find(f => f.id === 'assignee') && (
                          <div className="relative">
                            <select 
                              className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none rounded"
                              value={selectedAssignee}
                              onChange={(e) => setSelectedAssignee(e.target.value)}
                            >
                              <option value="" disabled>
                                Assignee
                              </option>
                              <option value="">Unassigned</option>
                              {selectedIssueTypeData.optionalFields
                                .find(f => f.id === 'assignee')?.allowedValues?.map((value: any) => (
                                  <option key={value.accountId || value.id} value={value.accountId || value.id}>
                                    {value.displayName || value.name}
                                  </option>
                                ))
                              }
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Priority Field */}
                        {selectedIssueTypeData?.optionalFields.find(f => f.id === 'priority') && (
                          <div className="relative">
                            <select 
                              className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none rounded"
                              value={selectedPriority}
                              onChange={(e) => setSelectedPriority(e.target.value)}
                            >
                              <option value="" >
                                Priority
                              </option>
                              {selectedIssueTypeData.optionalFields
                                .find(f => f.id === 'priority')?.allowedValues?.map((value: any) => (
                                  <option key={value.id} value={value.id}>
                                    {value.name}
                                  </option>
                                ))
                              }
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Dynamic Fields Section */}
                    {selectedIssueTypeData && (
                      <div className="space-y-3">

                        {/* Required Fields */}
                        {filterCommonFields(selectedIssueTypeData.requiredFields, commonFieldExclusions).length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-xs font-medium text-red-600">Required Fields *</h5>
                            {filterCommonFields(selectedIssueTypeData.requiredFields, commonFieldExclusions).map((field) => (
                              <div key={field.id} className="space-y-1">
                                {renderFieldInput(field)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Show other fields link */}
                    {selectedIssueTypeData && (
                      filterCommonFields(selectedIssueTypeData.optionalFields, additionalFieldExclusions).length > 0 && (
                        <div className="mt-3">
                          <button 
                            onClick={() => setShowAdditionalFields(!showAdditionalFields)}
                            className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center"
                          >
                            {showAdditionalFields ? 'Hide' : 'Show'} {filterCommonFields(selectedIssueTypeData.optionalFields, additionalFieldExclusions).length} additional fields
                            <svg className={`w-3 h-3 ml-1 transition-transform ${showAdditionalFields ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      )
                    )}
                    
                    {/* Additional Fields Section */}
                    {showAdditionalFields && selectedIssueTypeData && (
                      <div className="mt-3">
                        <div className="grid grid-cols-2 gap-3">
                          {filterCommonFields(selectedIssueTypeData.optionalFields, additionalFieldExclusions).map((field) => (
                            <div key={field.id} className="space-y-1">
                              {renderFieldInput(field)}
                            </div>
                          ))
                          }
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted-foreground">
                          Selected media from the left will be added as attachments to Jira
                        </p>
                        <button className="p-1 hover:bg-muted rounded transition-colors" title="Upload additional files">
                          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>
                      </div>
                      <div className="bg-muted/50 p-2 rounded text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>2 items selected (1 screenshot, 1 video)</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="create-another" className="w-3 h-3" />
                        <label htmlFor="create-another" className="text-xs">
                          Create another
                        </label>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Create
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="update" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Jira Issue Key
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., PROJ-123"
                        className="w-full px-3 py-2 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Update Type
                      </label>
                      <select className="w-full px-3 py-2 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring">
                        <option value="">Select Update Type</option>
                        <option value="comment">Add Comment</option>
                        <option value="attachment">Add Attachment</option>
                        <option value="status">Update Status</option>
                        <option value="priority">Update Priority</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Comment/Description
                      </label>
                      <RichTextEditor
                        value=""
                        onChange={() => {}}
                        placeholder="Enter your comment or description"
                        className="w-full"
                      />
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Update Jira Issue
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions Popup */}
      <AISuggestionsPopup
        isOpen={isAIPopupOpen}
        onClose={handleCloseAIPopup}
        onApprove={handleApproveSuggestions}
        logs={loadedLogContent || logContent}
        projectKey={jiraProjectData?.project?.key || 'PMT'}
      />
    </div>
  );
}
