
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const AddLocation = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("New Location Data:", data);
    
    toast({
      title: "Location Submitted!",
      description: "Thank you for contributing. Your new location has been added.",
    });
    e.currentTarget.reset();
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <PlusCircle className="w-6 h-6 mr-3" />
            Add a New WiFi Location
          </CardTitle>
          <CardDescription>
            Help the community grow by adding a new spot you've discovered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input id="name" name="name" placeholder="e.g., Central Library" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="Full address" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Cafe">Cafe</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Park">Park</SelectItem>
                  <SelectItem value="Community Center">Community Center</SelectItem>
                  <SelectItem value="Mall">Mall</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input id="hours" name="hours" placeholder="e.g., 9 AM - 9 PM" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isFree" name="isFree" defaultChecked />
              <Label htmlFor="isFree">Free WiFi</Label>
            </div>
            <div className="space-y-3">
              <Label>Amenities (optional)</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="outlets" name="amenities" value="Power Outlets" />
                <Label htmlFor="outlets">Power Outlets</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="seating" name="amenities" value="Seating" />
                <Label htmlFor="seating">Comfortable Seating</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="food" name="amenities" value="Food Available" />
                <Label htmlFor="food">Food/Drinks Available</Label>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add Location
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddLocation;
