import { MapPin, Menu, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onNearbyClick?: () => void;
  onFestivalsClick?: () => void;
  onTransportClick?: () => void;
  onTripsClick?: () => void;
}

const Navbar = ({ onNearbyClick, onFestivalsClick, onTransportClick, onTripsClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'default' | 'sky'>('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'default' | 'sky' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'sky' : 'default';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  const handleMenuClick = (callback?: () => void) => {
    setIsOpen(false);
    callback?.();
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TourMate
            </h1>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="glass" 
                size="icon"
                className="md:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 glass-card border-border/50">
              <div className="flex flex-col gap-4 mt-8">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg"
                  onClick={() => handleMenuClick(onNearbyClick)}
                >
                  Nearby
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg"
                  onClick={() => handleMenuClick(onFestivalsClick)}
                >
                  Festivals
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg"
                  onClick={() => handleMenuClick(onTransportClick)}
                >
                  Transport
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg"
                  onClick={() => handleMenuClick(onTripsClick)}
                >
                  My Trips
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="glass"
            size="icon"
            onClick={toggleTheme}
            className="shrink-0"
            title={theme === 'default' ? 'Switch to Sky Theme' : 'Switch to Default Theme'}
          >
            <Palette className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex gap-3">
            <Button variant="glass" size="sm" onClick={onNearbyClick}>
              Nearby
            </Button>
            <Button variant="glass" size="sm" onClick={onFestivalsClick}>
              Festivals
            </Button>
            <Button variant="glass" size="sm" onClick={onTransportClick}>
              Transport
            </Button>
            <Button variant="glass" size="sm" onClick={onTripsClick}>
              My Trips
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
