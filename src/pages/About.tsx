
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Users, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="bg-white/90 backdrop-blur-sm text-foreground">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">About ConnectLocal</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Your guide to free and accessible WiFi anywhere.
          </p>
        </CardHeader>
        <CardContent className="max-w-4xl mx-auto text-lg text-foreground/80 space-y-6 py-10">
          <p>
            <strong>ConnectLocal</strong> was born from a simple idea: internet access should be easy to find, whether you're a student, a remote worker, a traveler, or just someone looking to get online. In today's digital world, a reliable internet connection is not a luxury—it's a necessity. We believe that finding that connection shouldn't be a hassle.
          </p>
          <p>
            Our mission is to create a community-driven map of all public WiFi hotspots, from bustling cafes and quiet libraries to public parks and transport hubs. We empower users to not only find WiFi spots but also to contribute by adding new locations, making our platform richer and more accurate for everyone.
          </p>
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-secondary p-3 rounded-full">
                  <Users className="w-6 h-6 text-secondary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Community-Powered</h3>
                <p className="text-foreground/70 mt-1">
                  Our map is constantly growing thanks to users like you. Add new spots, update existing ones, and help build the most comprehensive WiFi database.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-secondary p-3 rounded-full">
                  <Globe className="w-6 h-6 text-secondary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Free & Accessible</h3>
                <p className="text-foreground/70 mt-1">
                  We prioritize free WiFi to bridge the digital divide. Our filters make it simple to find exactly what you need, wherever you are.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
