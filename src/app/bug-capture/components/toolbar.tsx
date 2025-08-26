"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Video, Monitor, Settings, Tag, ChevronDown, Mic, Webcam, MicOff, VideoOff, GripVertical, MoveLeft, MoveRight } from "lucide-react";

interface ToolbarProps {
  isVideoRecording: boolean;
  isRecordingPaused: boolean;
  recordingTime: number;
  isSessionCapturing: boolean;
  isMicrophoneOn: boolean;
  isWebcamOn: boolean;
  isDragging: boolean;
  toolbarPosition: { x: number; y: number };
  hasRecordedVideo: boolean;
  currentSection: 'cross-browser' | 'captured';
  onScreenshotCapture: () => void;
  onVideoToggle: () => void;
  onRecordingPause: () => void;
  onStopRecording: () => void;
  onSessionToggle: () => void;
  onMicrophoneToggle: (enabled: boolean) => void;
  onWebcamToggle: (enabled: boolean) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onIntegrations: () => void;
  onNavigateToCaptured: () => void;
  onNavigateToCrossBrowser: () => void;
}

export function Toolbar({
  isVideoRecording,
  isRecordingPaused,
  recordingTime,
  isSessionCapturing,
  isMicrophoneOn,
  isWebcamOn,
  isDragging,
  toolbarPosition,
  hasRecordedVideo,
  currentSection,
  onScreenshotCapture,
  onVideoToggle,
  onRecordingPause,
  onStopRecording,
  onSessionToggle,
  onMicrophoneToggle,
  onWebcamToggle,
  onMouseDown,
  onIntegrations,
  onNavigateToCaptured,
  onNavigateToCrossBrowser
}: ToolbarProps) {
  const [isJiraSheetOpen, setIsJiraSheetOpen] = useState(false);
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [markerText, setMarkerText] = useState("");

  const handleSaveMarker = () => {
    console.log("Marker added at", recordingTime, "seconds:", markerText);
    setMarkerText("");
    setIsMarkerModalOpen(false);
  };

  return (
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
            onMouseDown={onMouseDown}
            title="Drag Toolbar"
          >
            <GripVertical className="h-4 w-4" />
          </div>



          {/* Capture Screenshot - Only show in cross-browser section */}
          {currentSection === 'cross-browser' && (
            <button
              onClick={onScreenshotCapture}
              className="p-1.5 hover:bg-gray-50 rounded-md transition-colors"
              title="Capture Screenshot"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </button>
          )}

          {/* Video Recording Section - Only show in cross-browser section */}
          {currentSection === 'cross-browser' && (
            !isVideoRecording ? (
              // Video recording button with settings dropdown (when not recording)
              <div className="flex items-center">
                <button
                  onClick={onVideoToggle}
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
                        onCheckedChange={onMicrophoneToggle}
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
                        onCheckedChange={onWebcamToggle}
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
                  onClick={onRecordingPause}
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
                  onClick={onStopRecording}
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                  title="Stop Recording"
                >
                  <div className="w-4 h-4 bg-red-500"></div>
                </button>
              </div>
            )
          )}

          {/* Capture Session Info Toggle */}
          <button
            onClick={onSessionToggle}
            className={`p-2 rounded-md transition-colors ${
              isSessionCapturing 
                ? 'bg-blue-50 text-blue-600' 
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            title="Capture Session Info"
          >
            <Monitor className="h-5 w-5" />
          </button>

          {/* Create Jira with Settings Dropdown - Only show in captured section */}
          {currentSection === 'captured' && (
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
                      <RichTextEditor
                        value=""
                        onChange={() => {}}
                        placeholder="Add more details..."
                        className="w-full"
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
          )}

          {/* Add Marker - Only show when recording */}
          {isVideoRecording && (
            <Dialog open={isMarkerModalOpen} onOpenChange={setIsMarkerModalOpen}>
              <DialogTrigger asChild>
                <button
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

          {/* Integrations */}
          <button
            onClick={onIntegrations}
            className="p-2 hover:bg-gray-50 rounded-md transition-colors"
            title="Integrations"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* Navigation Arrows - Only appear after capture */}
          {hasRecordedVideo && (
            <>
              {currentSection === 'cross-browser' ? (
                <button
                  onClick={onNavigateToCaptured}
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                  title="View Captured Video"
                >
                  <MoveRight className="h-5 w-5 text-gray-600" />
                </button>
              ) : (
                <button
                  onClick={onNavigateToCrossBrowser}
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                  title="Back to Browser View"
                >
                  <MoveLeft className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
