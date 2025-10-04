import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentLocation?: string;
}

const SearchBar = ({ onSearch, currentLocation }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="glass-card p-4 rounded-3xl space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            placeholder="Search temples, tourist spots, parks..."
            className="pl-12 h-14 bg-background/50 border-border/50 rounded-2xl text-base backdrop-blur-sm"
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button
          onClick={handleSearch}
          size="lg"
          className="px-8 h-14 rounded-2xl font-medium"
        >
          Search
        </Button>
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
