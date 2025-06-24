
import { Link, NavLink } from "react-router-dom";
import { Wifi, Menu, MapPin, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Locations", to: "/locations" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] shadow-lg backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Wifi className="h-6 w-6 text-white" />
          <span className="font-bold text-white text-xl">WifiLocator</span>
        </Link>
        <div className="hidden md:flex flex-1 items-center justify-between">
          <nav className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors hover:text-white/80 ${
                    isActive ? "text-white font-semibold" : "text-white/60"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
             <div className="flex items-center text-white/80 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                Visakhapatnam, India
            </div>
            {user ? (
              <>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/add-location">Add Location</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                    {item.label}
                  </NavLink>
                ))}
                <hr className="my-2"/>
                {user ? (
                  <>
                    <div className="text-sm text-gray-600 px-2">
                      Signed in as: {user.email}
                    </div>
                    <Button asChild>
                      <Link to="/add-location">Add Location</Link>
                    </Button>
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/auth">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
