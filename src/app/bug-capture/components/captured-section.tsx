"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface CapturedMedia {
  id: string;
  type: 'video' | 'screenshot';
  src: string;
  timestamp: string;
  selected: boolean;
}

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
}

export function CapturedSection({
  isSidebarCollapsed,
  logContent,
  capturedMedia
}: CapturedSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMetadata, setShowMetadata] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);



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



  const renderVideoPlayer = (media: CapturedMedia) => {
    return (
      <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-gray-200">
        {/* 1. Video Player Header */}
        <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
          <h3 className="text-white text-sm font-medium">
            Recorded Session from {media.timestamp}
          </h3>
        </div>
        
        {/* 2. Video Content */}
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
        
        {/* 3. Video Controls */}
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
  };

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
            <AccordionItem value="console-log" className="border border-border">
              <AccordionTrigger className="bg-muted px-4 py-2 hover:no-underline">
                <h3 className="text-sm font-medium">Console Log</h3>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <textarea
                  value={logContent}
                  readOnly
                  className="w-full h-32 resize-none bg-muted border border-input p-3 text-sm font-mono focus:outline-none overflow-y-auto"
                  placeholder="Loading console log..."
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Jira Integrations Card */}
          <div className="bg-card border border-border">
            <div className="bg-muted px-4 py-2 border-b border-border">
              <h3 className="text-sm font-medium">Jira Integration</h3>
            </div>
            <div className="p-4">
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create New Jira</TabsTrigger>
                  <TabsTrigger value="update">Update Existing Jira</TabsTrigger>
                </TabsList>
                
                <TabsContent value="create" className="mt-2">
                  <div className="space-y-3">
                    {/* Required fields note */}
                    <p className="text-xs text-muted-foreground">
                      Required fields are marked with an asterisk *
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Work type *
                        </label>
                        <div className="relative">
                          <select className="w-full px-2 py-1 text-sm border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring appearance-none">
                            <option value="">Select Work Type</option>
                            <option value="task">Task</option>
                            <option value="bug">Bug</option>
                            <option value="story">Story</option>
                            <option value="epic">Epic</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <a href="#" className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center">
                          Learn about work types
                          <svg className="w-2 h-2 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Status
                        </label>
                        <div className="relative">
                          <select className="w-full px-2 py-1 text-sm border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring appearance-none">
                            <option value="todo">To Do</option>
                            <option value="inprogress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          This is the initial status upon creation
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <label className="text-xs font-medium">
                          Summary *
                        </label>
                        <button className="px-2 py-1 hover:bg-muted rounded transition-colors bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 flex items-center gap-1.5" title="AI-powered summary generation">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                            <path d="M20 2v4"/>
                            <path d="M22 4h-4"/>
                            <circle cx="4" cy="20" r="2"/>
                          </svg>
                          <span className="text-xs font-medium text-purple-700">Generate with BrowserStack AI</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Brief description of the issue"
                        className="w-full px-2 py-1 text-sm border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <label className="text-xs font-medium">
                          Description
                        </label>
                        <button className="px-2 py-1 hover:bg-muted rounded transition-colors bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 flex items-center gap-1.5" title="AI-powered description generation">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                            <path d="M20 2v4"/>
                            <path d="M22 4h-4"/>
                            <circle cx="4" cy="20" r="2"/>
                          </svg>
                          <span className="text-xs font-medium text-purple-700">Generate with BrowserStack AI</span>
                        </button>
                      </div>
                      <textarea
                        placeholder="Detailed description of the issue"
                        rows={5}
                        className="w-full px-2 py-1 text-sm border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                      />
                      <div className="mt-1">
                        <button 
                          onClick={() => setShowMetadata(!showMetadata)}
                          className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center"
                        >
                          {showMetadata ? '▼' : '▶'} Additional meta data added with description
                        </button>
                      </div>
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
                            className="w-full px-2 py-1 text-sm border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring font-mono"
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Assignee
                        </label>
                        <div className="relative">
                          <select className="w-full px-2 py-1 text-sm border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring appearance-none">
                            <option value="">Unassigned</option>
                            <option value="user1">John Doe</option>
                            <option value="user2">Jane Smith</option>
                            <option value="user3">Mike Johnson</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Priority
                        </label>
                        <div className="relative">
                          <select className="w-full px-2 py-1 text-sm border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring appearance-none">
                            <option value="">Select Priority</option>
                            <option value="highest">Highest</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                            <option value="lowest">Lowest</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <a href="#" className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center">
                        Show more fields
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </a>
                    </div>
                    
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
                      <textarea
                        placeholder="Enter your comment or description"
                        rows={4}
                        className="w-full px-3 py-2 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
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
    </div>
  );
}
