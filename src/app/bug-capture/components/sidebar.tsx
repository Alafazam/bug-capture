"use client";

import { Menu, ChevronLeft, ChevronRight, Smartphone, RotateCcw, Accessibility, Maximize2, Bookmark, Settings, MapPin, Eye, Image, Square } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  isSidebarCollapsed: boolean;
  isAppLiveMode: boolean;
  onToggleSidebar: () => void;
  onSwitchBrowser: () => void;
  onStopSession?: () => void;
}

export function Sidebar({
  isSidebarCollapsed,
  isAppLiveMode,
  onToggleSidebar,
  onSwitchBrowser,
  onStopSession
}: SidebarProps) {
  return (
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
          onClick={onToggleSidebar}
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
          onClick={onSwitchBrowser}
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
        <div 
          className="flex items-center p-2 hover:bg-red-50 rounded cursor-pointer mt-4 border border-red-200"
          onClick={onStopSession}
          title="Stop session and log out"
        >
          <Square className="h-5 w-5 text-red-600" />
          {!isSidebarCollapsed && (
            <span className="ml-3 text-sm font-medium text-red-600">Stop Session & Logout</span>
          )}
        </div>
      </div>
    </div>
  );
}
