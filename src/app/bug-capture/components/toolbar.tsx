"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Video, Monitor, Settings, Tag, ChevronDown, Mic, Webcam, MicOff, VideoOff, GripVertical, MoveLeft, MoveRight } from "lucide-react";
import { fetchJiraProjects, fetchJiraProjectFields, type JiraProject, type JiraIssueType } from "@/lib/utils/jira-api";

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
  selectedProject: string;
  onProjectChange: (projectKey: string) => void;
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
  selectedProject,
  onProjectChange,
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
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [markerText, setMarkerText] = useState("");
  const [jiraProjects, setJiraProjects] = useState<JiraProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Debug log to show current state
  console.log('Toolbar render - jiraProjects:', jiraProjects.length, 'isLoading:', isLoadingProjects, 'selectedProject:', selectedProject);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        console.log('Fetching Jira projects...');
        const response = await fetchJiraProjects();
        console.log('Jira projects fetched successfully:', response.projects);
        console.log('Project keys:', response.projects.map(p => p.key));
        console.log('Project names:', response.projects.map(p => p.name));
        console.log('Number of projects:', response.projects.length);
        setJiraProjects(response.projects);
      } catch (error) {
        console.error('Failed to fetch Jira projects:', error);
        // Keep empty array if fetch fails
        setJiraProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSaveMarker = () => {
    console.log("Marker added at", recordingTime, "seconds:", markerText);
    setMarkerText("");
    setIsMarkerModalOpen(false);
  };

  const handleProjectChange = (projectKey: string) => {
    console.log('Project changed to:', projectKey);
    onProjectChange(projectKey);
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
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-1"
                  title="Jira Settings"
                >
                  <img src="/jira.svg" alt="Jira" className="w-5 h-5" />
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
                    <Select value={selectedProject} onValueChange={handleProjectChange}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={isLoadingProjects ? "Loading projects..." : "Select project"} />
                      </SelectTrigger>

                      <SelectContent>
                        {isLoadingProjects ? (
                          <SelectItem value="loading" disabled>
                            Loading projects...
                          </SelectItem>
                        ) : jiraProjects.length === 0 ? (
                          <SelectItem value="no-projects" disabled>
                            No projects available ({jiraProjects.length} projects loaded)
                          </SelectItem>
                        ) : (
                          jiraProjects.map((project) => (
                            <SelectItem key={project.id} value={project.key}>
                              {project.name} ({project.key})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  

                </div>
              </PopoverContent>
            </Popover>
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
