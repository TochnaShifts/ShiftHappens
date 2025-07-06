import { BarChart3 } from "lucide-react";

const PointsHeader = () => {
    return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">נקודות וסטטיסטיקות</h1>
              <p className="text-sm text-gray-600">עקוב אחר הביצועים והדירוג שלך</p>
            </div>
          </div>
        </div>
      </header>
    )
}

export default PointsHeader;