"use client";

import { LoadingSpinner } from "@/app/components";

export default function TestLoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">LoadingSpinner Component Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Small Size */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h2 className="text-lg font-semibold mb-4">Small Size</h2>
            <div className="flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          </div>

          {/* Medium Size */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h2 className="text-lg font-semibold mb-4">Medium Size (Default)</h2>
            <div className="flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          </div>

          {/* Large Size */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h2 className="text-lg font-semibold mb-4">Large Size</h2>
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>

        {/* Full Page Loading Example */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-center">Full Page Loading Example</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
} 