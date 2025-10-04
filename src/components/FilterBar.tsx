import { FilterType, SortType, ViewMode } from '@/types';
import { Button } from '@/components/ui/button';
import { Filter, ArrowUpDown, List, Map } from 'lucide-react';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Temple', label: 'Temples' },
  { value: 'Tourist Spot', label: 'Tourist Spots' },
  { value: 'Park', label: 'Parks' },
  { value: 'Monument', label: 'Monuments' },
  { value: 'Museum', label: 'Museums' },
];

const sortOptions: { value: SortType; label: string }[] = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'entryFee', label: 'Entry Fee' },
];

const FilterBar = ({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) => {
  return (
    <div className="space-y-4">
      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'glass-primary' : 'glass'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className="whitespace-nowrap"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Sort and View Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="glass-card px-4 py-2 rounded-xl text-sm border-0 outline-none cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-background">
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'glass-primary' : 'glass'}
            size="icon"
            onClick={() => onViewModeChange('list')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'glass-primary' : 'glass'}
            size="icon"
            onClick={() => onViewModeChange('map')}
          >
            <Map className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
