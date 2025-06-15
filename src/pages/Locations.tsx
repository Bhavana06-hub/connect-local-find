
import { useState, useMemo } from "react";
import { wifiSpots } from "@/data/wifi-spots";
import { WiFiLocation } from "@/lib/types";
import LocationCard from "@/components/LocationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Library, Utensils, Wifi } from "lucide-react";

const filterTypes = [
  { label: "All", value: "all", icon: null },
  { label: "Free Only", value: "free", icon: null },
  { label: "Libraries", value: "Library", icon: <Library className="w-4 h-4 mr-2" /> },
  { label: "Cafes", value: "Cafe", icon: <Wifi className="w-4 h-4 mr-2" /> },
  { label: "Restaurants", value: "Restaurant", icon: <Utensils className="w-4 h-4 mr-2" /> },
];

const Locations = () => {
  const [allLocations] = useState<WiFiLocation[]>(wifiSpots);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredLocations = useMemo(() => {
    return allLocations
      .filter((location) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "free") return location.isFree;
        return location.type === activeFilter;
      })
      .filter((location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allLocations, searchQuery, activeFilter]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">All WiFi Locations</CardTitle>
          <p className="text-muted-foreground">Search and filter through all available spots.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filterTypes.map(filter => (
                 <Button
                    key={filter.value}
                    variant={activeFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter.value)}
                    className="flex items-center"
                  >
                   {filter.icon} {filter.label}
                  </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">
                <p>No locations found.</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Locations;
