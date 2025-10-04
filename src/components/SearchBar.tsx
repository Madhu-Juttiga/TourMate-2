import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentLocation?: string;
  isSearching?: boolean;
}

const SearchBar = ({ onSearch, currentLocation, isSearching }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="glass-card p-4 rounded-3xl space-y-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          placeholder="Search temples, tourist spots, museums..."
          className="pl-12 pr-12 h-14 bg-background/50 border-border/50 rounded-2xl text-base backdrop-blur-sm"
          onChange={(e) => handleChange(e.target.value)}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        {isSearching && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {currentLocation && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-accent" />
          <span>{currentLocation}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
