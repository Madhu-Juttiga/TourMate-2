import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
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
    <div className="glass-card p-3 md:p-4 rounded-3xl space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
          <Input
            value={query}
            placeholder="Search temples, spots..."
            className="pl-10 md:pl-12 h-12 md:h-14 bg-background/50 border-border/50 rounded-2xl text-sm md:text-base backdrop-blur-sm"
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button
          onClick={handleSearch}
          size="lg"
          className="px-4 md:px-8 h-12 md:h-14 rounded-2xl font-medium shrink-0"
        >
          <span className="hidden sm:inline">Search</span>
          <Search className="w-5 h-5 sm:hidden" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
