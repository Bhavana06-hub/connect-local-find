
import { Button } from "@/components/ui/button";
import { Map, List } from "lucide-react";

interface ViewToggleProps {
  showMap: boolean;
  onToggleView: (showMap: boolean) => void;
}

const ViewToggle = ({ showMap, onToggleView }: ViewToggleProps) => {
  return (
    <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      <Button
        variant={!showMap ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggleView(false)}
        className={`flex-1 transition-all duration-200 rounded-lg ${
          !showMap 
            ? "bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <List className="w-4 h-4 mr-2" />
        List View
      </Button>
      <Button
        variant={showMap ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggleView(true)}
        className={`flex-1 transition-all duration-200 rounded-lg ${
          showMap 
            ? "bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <Map className="w-4 h-4 mr-2" />
        Map View
      </Button>
    </div>
  );
};

export default ViewToggle;
