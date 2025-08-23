"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Video, Monitor, Settings, Tag, ChevronDown, Mic, Webcam, MicOff, VideoOff, GripVertical, Menu, ChevronLeft, ChevronRight, Smartphone, RotateCcw, Accessibility, Maximize2, Bookmark, MapPin, Eye, Image, Square } from "lucide-react";

export default function BugCapturePage() {
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isSessionCapturing, setIsSessionCapturing] = useState(false);
  const [isJiraSheetOpen, setIsJiraSheetOpen] = useState(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [markerText, setMarkerText] = useState("");
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentImage, setCurrentImage] = useState("/browser-screnshot.jpg");
  const [isAppLiveMode, setIsAppLiveMode] = useState(false);

  // Initialize toolbar position to center top
  useEffect(() => {
    const centerX = (window.innerWidth - 600) / 2; // Approximate toolbar width
    setToolbarPosition({ x: centerX, y: 20 });
  }, []);

  const handleScreenshotCapture = () => {
    // Placeholder for screenshot functionality
    console.log("Screenshot captured");
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
    console.log("Recording stopped");
  };

  const handleAddMarker = () => {
    setIsMarkerModalOpen(true);
  };

  const handleSaveMarker = () => {
    console.log("Marker added at", recordingTime, "seconds:", markerText);
    setMarkerText("");
    setIsMarkerModalOpen(false);
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

  const handleSessionToggle = () => {
    setIsSessionCapturing(!isSessionCapturing);
    console.log("Session capturing:", !isSessionCapturing);
  };

  const handleIntegrations = () => {
    console.log("Integrations clicked");
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

    return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isSidebarCollapsed && (
            <button className="p-1 hover:bg-gray-100 rounded">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-100 rounded ml-auto"
          >
            <ChevronLeft className={`h-5 w-5 text-gray-600 transition-transform ${
              isSidebarCollapsed ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <div className="p-2 space-y-1">
          {/* Switch Browser */}
          <div 
            className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={handleSwitchBrowser}
          >
            <Smartphone className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 text-sm font-medium">
                  {isAppLiveMode ? "Switch to App" : "Switch to App Live"}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </>
            )}
          </div>

          {/* Local Testing */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 text-sm font-medium">Local Testing</span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </>
            )}
          </div>

          {/* Accessibility Insights */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer opacity-50">
            <Accessibility className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <span className="ml-3 text-sm text-gray-400">Accessibility Insights</span>
            )}
          </div>

          {/* Resolution */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Maximize2 className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 text-sm font-medium">1920 x 992</span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </>
            )}
          </div>

          {/* Bookmarks */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Bookmark className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 text-sm font-medium">Bookmarks</span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </>
            )}
          </div>

          {/* Settings */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Settings className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 text-sm font-medium">Settings</span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </>
            )}
          </div>

          {/* Change Location */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
            <MapPin className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 text-sm font-medium">Change Location</span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </>
            )}
          </div>

          {/* Screen Reader */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Eye className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 text-sm font-medium">Screen Reader</span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </>
            )}
          </div>

          {/* Files & Media */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Image className="h-5 w-5 text-blue-600" />
            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 text-sm font-medium">Files & Media</span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </>
            )}
          </div>

          {/* Stop Session */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer mt-4">
            <Square className="h-5 w-5 text-red-600" />
            {!isSidebarCollapsed && (
              <span className="ml-3 text-sm font-medium text-red-600">Stop Session</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Toolbar */}
        <div 
          className="fixed z-50"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
        <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            {/* Drag Indicator */}
            <div 
              className="p-1.5 text-gray-400 cursor-grab hover:text-gray-600 transition-colors"
              onMouseDown={handleMouseDown}
              title="Drag Toolbar"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            {/* Capture Screenshot */}
            <button
              onClick={handleScreenshotCapture}
              className="p-1.5 hover:bg-gray-50 rounded-md transition-colors"
              title="Capture Screenshot"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </button>

                        {/* Video Recording Section - Changes based on recording state */}
            {!isVideoRecording ? (
              // Video recording button with settings dropdown (when not recording)
              <div className="flex items-center">
                <button
                  onClick={handleVideoToggle}
                  className="p-2 hover:bg-gray-50 rounded-l-md transition-colors"
                  title="Capture Video"
                >
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="p-2 hover:bg-gray-50 rounded-r-md transition-colors border-l border-gray-200"
                      title="Video Options"
                    >
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2 bg-white text-gray-600 border-gray-200 rounded-md shadow-lg">
                    <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">SETTINGS</div>
                    <div className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded-sm">
                      <div className="flex items-center space-x-2">
                        {isMicrophoneOn ? (
                          <Mic className="h-4 w-4 text-gray-600" />
                        ) : (
                          <MicOff className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">Microphone</span>
                      </div>
                      <Switch
                        checked={isMicrophoneOn}
                        onCheckedChange={setIsMicrophoneOn}
                        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                      />
                    </div>
                    <div className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded-sm">
                      <div className="flex items-center space-x-2">
                        {isWebcamOn ? (
                          <Webcam className="h-4 w-4 text-gray-600" />
                        ) : (
                          <VideoOff className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">Webcam</span>
                      </div>
                      <Switch
                        checked={isWebcamOn}
                        onCheckedChange={setIsWebcamOn}
                        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              // Recording controls (when recording)
              <div className="flex items-center space-x-2">
                {/* Recording Indicator and Time Display - Clickable to pause/resume */}
                <button
                  onClick={handleRecordingPause}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
                  title={isRecordingPaused ? "Resume Recording" : "Pause Recording"}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    isRecordingPaused 
                      ? 'bg-gray-400 border-gray-400' 
                      : 'bg-red-500 border-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-600 font-medium">
                    {isRecordingPaused ? "Paused" : "Recording"} at {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </span>
                </button>

                {/* Stop Recording (Square) */}
                <button
                  onClick={handleStopRecording}
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                  title="Stop Recording"
                >
                  <div className="w-4 h-4 bg-red-500"></div>
                </button>
              </div>
            )}

            {/* Capture Session Info Toggle */}
            <button
              onClick={handleSessionToggle}
              className={`p-2 rounded-md transition-colors ${
                isSessionCapturing 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
              title="Capture Session Info"
            >
              <Monitor className="h-5 w-5" />
            </button>

            {/* Create Jira with Settings Dropdown */}
            <div className="flex items-center">
              <Sheet open={isJiraSheetOpen} onOpenChange={setIsJiraSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2 hover:bg-gray-50 rounded-l-md transition-colors"
                    title="Create Jira Ticket"
                  >
                    <img src="/jira.svg" alt="Jira" className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                      <span>Jira</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Host */}
                    <div className="space-y-2">
                      <Label htmlFor="host" className="text-sm font-medium">
                        Host <span className="text-red-500">*</span>
                      </Label>
                      <Select defaultValue="increff">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increff">increff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Project */}
                    <div className="space-y-2">
                      <Label htmlFor="project" className="text-sm font-medium">
                        Project <span className="text-red-500">*</span>
                      </Label>
                      <Select defaultValue="increff-product-team">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increff-product-team">Increff Product Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                      <button className="flex-1 py-2 px-3 text-sm font-medium bg-white rounded-md shadow-sm">
                        Create issue
                      </button>
                      <button className="flex-1 py-2 px-3 text-sm font-medium text-gray-600">
                        Update existing issue
                      </button>
                    </div>

                    {/* Issue Type */}
                    <div className="space-y-2">
                      <Label htmlFor="issue-type" className="text-sm font-medium">
                        Issue Type <span className="text-red-500">*</span>
                      </Label>
                      <Select defaultValue="task">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assignee */}
                    <div className="space-y-2">
                      <Label htmlFor="assignee" className="text-sm font-medium">
                        Assignee
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user1">User 1</SelectItem>
                          <SelectItem value="user2">User 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2">
                      <Label htmlFor="summary" className="text-sm font-medium">
                        Summary <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="summary"
                        placeholder="Tell your team what went wrong"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Add more details..."
                        rows={4}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsJiraSheetOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button className="flex-1">
                        Create
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="p-2 hover:bg-gray-50 rounded-r-md transition-colors border-l border-gray-200"
                    title="Jira Settings"
                  >
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 bg-white text-gray-600 border-gray-200 rounded-md shadow-lg">
                  <div className="text-xs font-semibold text-gray-500 mb-3 uppercase">JIRA SETTINGS</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="jira-host" className="text-xs font-medium text-gray-600">
                        Host
                      </Label>
                      <Select defaultValue="increff">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increff">increff</SelectItem>
                          <SelectItem value="company2">company2</SelectItem>
                          <SelectItem value="company3">company3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="jira-project" className="text-xs font-medium text-gray-600">
                        Project
                      </Label>
                      <Select defaultValue="increff-product-team">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increff-product-team">Increff Product Team</SelectItem>
                          <SelectItem value="increff-dev-team">Increff Dev Team</SelectItem>
                          <SelectItem value="increff-qa-team">Increff QA Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Add Marker - Only show when recording */}
            {isVideoRecording && (
              <Dialog open={isMarkerModalOpen} onOpenChange={setIsMarkerModalOpen}>
                <DialogTrigger asChild>
                  <button
                    onClick={handleAddMarker}
                    className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                    title="Add Marker"
                  >
                    <Tag className="h-5 w-5 text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Marker</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="marker-text">Marker Text</Label>
                      <Textarea
                        id="marker-text"
                        placeholder="Enter your marker text..."
                        value={markerText}
                        onChange={(e) => setMarkerText(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsMarkerModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveMarker}
                        className="flex-1"
                      >
                        Save Marker
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

             {/* Integrations - Rightmost position */}
             <button
               onClick={handleIntegrations}
               className="p-2 hover:bg-gray-50 rounded-md transition-colors"
               title="Integrations"
             >
               <Settings className="h-5 w-5 text-gray-600" />
             </button>
           </div>
         </div>
       </div>
      </div>

      {/* Main Content Area */}
      <div className={`pt-20 px-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-0' : ''
      }`}>
        <div className="flex justify-center">
          <div className={`transition-all duration-300 ${
            isSidebarCollapsed ? 'w-full' : 'w-full'
          }`}>
            <img 
              src={currentImage} 
              alt="Browser Testing Window" 
              className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
