
import { useState, useMemo } from "react";
import { wifiSpots } from "@/data/wifi-spots";
import { WiFiLocation } from "@/lib/types";
import LocationCard from "@/components/LocationCard";
import MapWrapper from "@/components/MapWrapper";
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

const Index = () => {
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
    <div className="container mx-auto p-4 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
       <header className="text-center my-8 md:my-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>Find Your Perfect WiFi Spot</h1>
        <p className="mt-4 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
          Discover free and reliable WiFi hotspots in Hyderabad. Whether you need a quiet library, a bustling cafe, or a comfy restaurant, we've got you covered.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 h-full">
        {/* Left Panel */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 h-[calc(100vh-10rem)]">
          <Card className="h-full flex flex-col bg-white/40 dark:bg-black/20 backdrop-blur-xl border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-6 h-6 mr-2" /> Find WiFi Spots
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Filter by type:</p>
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
               <Card className="mb-4 text-center bg-white/60 dark:bg-black/30 border-none">
                  <CardContent className="p-4">
                    <p className="text-4xl font-bold text-primary">{filteredLocations.length}</p>
                    <p className="text-sm text-muted-foreground">WiFi Spots Found</p>
                  </CardContent>
                </Card>
              <div className="flex-grow overflow-y-auto pr-2">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    <p>No locations found.</p>
                    <p className="text-sm">Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel (Map) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8 h-[60vh] md:h-[calc(100vh-10rem)]">
          <MapWrapper />
        </div>
      </div>
    </div>
  );
};

export default Index;
