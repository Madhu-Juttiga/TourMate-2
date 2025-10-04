import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentLocation?: string;
}

const SearchBar = ({ onSearch, currentLocation }: SearchBarProps) => {
  return (
    <div className="glass-card p-4 rounded-3xl space-y-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search temples, tourist spots..."
          className="pl-12 h-14 bg-background/50 border-border/50 rounded-2xl text-base backdrop-blur-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      {currentLocation && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-accent" />
          <span>Current location: {currentLocation}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
