
import { Button } from "@/components/ui/button";
import { Map, List } from "lucide-react";

interface ViewToggleProps {
  showMap: boolean;
  onToggleView: (showMap: boolean) => void;
}

const ViewToggle = ({ showMap, onToggleView }: ViewToggleProps) => {
  return (
    <div className="flex gap-1 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      <Button
        variant={!showMap ? "default" : "ghost"}
        onClick={() => onToggleView(false)}
        className={`flex-1 transition-all duration-200 rounded-lg font-medium ${
          !showMap 
            ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 hover:shadow-md" 
            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        }`}
      >
        <List className="w-4 h-4 mr-2" />
        List View
      </Button>
      <Button
        variant={showMap ? "default" : "ghost"}
        onClick={() => onToggleView(true)}
        className={`flex-1 transition-all duration-200 rounded-lg font-medium ${
          showMap 
            ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 hover:shadow-md" 
            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        }`}
      >
        <Map className="w-4 h-4 mr-2" />
        Map View
      </Button>
    </div>
  );
};

export default ViewToggle;
