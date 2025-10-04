import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { City } from '@/types';

interface CitySelectorProps {
  cities: City[];
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const CitySelector = ({ cities, selectedCity, onCityChange }: CitySelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-background/80 backdrop-blur-sm border-border/50">
          <MapPin className="w-4 h-4 text-accent" />
          <span className="font-medium">{selectedCity.name}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-background border-border">
        {cities.map((city) => (
          <DropdownMenuItem
            key={city.id}
            onClick={() => onCityChange(city)}
            className="cursor-pointer p-3 focus:bg-accent/10"
          >
            <div className="flex flex-col gap-1 w-full">
              <div className="font-medium">{city.name}</div>
              <div className="text-xs text-muted-foreground">
                {city.state} • {city.popularPlacesCount} places
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CitySelector;
