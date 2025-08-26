"use client";

interface CrossBrowserSectionProps {
  isSidebarCollapsed: boolean;
  currentImage: string;
  showVideoPlayer: boolean;
  logContent: string;
}

export function CrossBrowserSection({
  isSidebarCollapsed,
  currentImage,
  showVideoPlayer,
  logContent
}: CrossBrowserSectionProps) {
  return (
    <div className={`pt-20 px-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'ml-0' : ''
    }`}>
      {!showVideoPlayer ? (
        // Original image view
        <div className={`flex justify-center transition-all duration-500 max-h-[calc(100vh-140px)] ${
          showVideoPlayer ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
        }`}>
          <div className={`transition-all duration-300 relative`}>
            <img 
              src={currentImage} 
              alt="Browser Testing Window" 
              className="w-full h-auto max-h-[calc(100vh-140px)] object-contain rounded-lg shadow-lg border border-gray-200"
            />
          </div>
        </div>
      ) : (
        // Video player and console view
        <div className="flex gap-6 transition-all duration-500">
          {/* Video Player - 60% width */}
          <div className="w-[60%]">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-gray-200">
              {/* Video Player Header */}
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <h3 className="text-white text-sm font-medium">Recorded Session</h3>
              </div>
              
              {/* Video Player Content */}
              <div className="relative bg-black aspect-video">
                {/* 404 Error Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-4xl font-bold mb-2">404</div>
                    <div className="text-white text-lg">This page could not be found.</div>
                  </div>
                </div>
                
                {/* Mouse Cursor */}
                <div className="absolute top-1/2 right-1/3 w-4 h-4 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.64,21.97C13.14,22.16 12.54,22 12.17,21.6L9.26,18.61C9.1,18.45 8.91,18.34 8.7,18.28L6.1,17.5C5.73,17.39 5.4,17.19 5.13,16.92L3.08,14.87C2.81,14.6 2.61,14.27 2.5,13.9L1.72,11.3C1.66,11.09 1.55,10.9 1.39,10.74L-1.6,7.83C-2,7.46 -2.16,6.86 -1.97,6.36L-0.03,-1.64C0.16,-2.14 0.76,-2.3 1.23,-1.93L8.07,3.77C8.23,3.91 8.36,4.08 8.45,4.28L9.23,6.88C9.34,7.25 9.54,7.58 9.81,7.85L11.86,9.9C12.13,10.17 12.46,10.37 12.83,10.48L15.43,11.26C15.64,11.32 15.83,11.43 15.99,11.59L22.83,16.43C23.3,16.8 23.16,17.4 22.66,17.59L13.64,21.97Z"/>
                  </svg>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="bg-gray-800 p-4">
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                
                {/* Control Bar */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button className="hover:bg-gray-700 p-1 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="text-sm">0:13 / 0:19</span>
                    <button className="hover:bg-gray-700 p-1 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.924L4.5 13.5V17a1 1 0 01-2 0V3a1 1 0 012 0v3.5l4.883-2.424z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">1x</span>
                    <button className="hover:bg-gray-700 p-1 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </button>
                    <button className="hover:bg-gray-700 p-1 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM10 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM10 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                    </button>
                    <button className="hover:bg-gray-700 p-1 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM9 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM9 10a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Console Log - 40% width */}
          <div className="w-[40%]">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                <h3 className="text-gray-700 text-sm font-medium">Console Log</h3>
              </div>
              <div className="p-4 h-full">
                <textarea
                  value={logContent}
                  readOnly
                  className="w-full h-full resize-none bg-gray-50 border border-gray-200 rounded p-3 text-sm font-mono text-gray-700 focus:outline-none"
                  placeholder="Loading console log..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
