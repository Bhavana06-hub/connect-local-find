
import { Button } from "@/components/ui/button";
import { Map, List } from "lucide-react";

interface ViewToggleProps {
  showMap: boolean;
  onToggleView: (showMap: boolean) => void;
}

const ViewToggle = ({ showMap, onToggleView }: ViewToggleProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={!showMap ? "default" : "outline"}
        size="sm"
        onClick={() => onToggleView(false)}
        className="flex-1"
      >
        <List className="w-4 h-4 mr-2" />
        List
      </Button>
      <Button
        variant={showMap ? "default" : "outline"}
        size="sm"
        onClick={() => onToggleView(true)}
        className="flex-1"
      >
        <Map className="w-4 h-4 mr-2" />
        Map
      </Button>
    </div>
  );
};

export default ViewToggle;
