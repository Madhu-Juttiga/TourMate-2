import { useState, useEffect, useRef } from 'react';
import { Place, FilterType, SortType, ViewMode, Bus, City } from '@/types';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import PlaceCard from '@/components/PlaceCard';
import PlaceDetails from '@/components/PlaceDetails';
import BusInfo from '@/components/BusInfo';
import CitySelector from '@/components/CitySelector';
import UpcomingFestivals from '@/components/UpcomingFestivals';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-temple.jpg';
import { teluguCitiesData, getAllCities, getCityData, getUpcomingUtsavs } from '@/lib/teluguCitiesData';

const Index = () => {
  const cities = getAllCities();
  const defaultCity = cities.find(c => c.id === 'rajahmundry') || cities[0];
  
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('distance');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for scrolling to sections
  const placesRef = useRef<HTMLDivElement>(null);
  const festivalsRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef<HTMLDivElement>(null);

  // Scroll to section handlers
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNearbyClick = () => {
    scrollToSection(placesRef);
    toast.success('Showing nearby places');
  };

  const handleFestivalsClick = () => {
    scrollToSection(festivalsRef);
    toast.success('Showing upcoming festivals');
  };

  const handleTransportClick = () => {
    scrollToSection(transportRef);
    toast.success('Showing transport options');
  };

  const handleTripsClick = () => {
    toast.info('My Trips feature coming soon!');
  };

  // Load places for selected city
  useEffect(() => {
    const cityData = getCityData(selectedCity.id);
    if (cityData) {
      setPlaces(cityData.places);
      setFilteredPlaces(cityData.places);
      toast.success(`Showing ${cityData.places.length} places in ${selectedCity.name}`);
    }
  }, [selectedCity]);

  // Handle city change
  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    setSearchQuery('');
    setActiveFilter('all');
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...places];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.description.toLowerCase().includes(query) ||
          place.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      result = result.filter((place) => place.category === activeFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'entryFee':
          const aFee = a.entryFee === 'Free' ? 0 : parseInt(a.entryFee.replace(/[^0-9]/g, ''));
          const bFee = b.entryFee === 'Free' ? 0 : parseInt(b.entryFee.replace(/[^0-9]/g, ''));
          return aFee - bFee;
        default:
          return 0;
      }
    });

    setFilteredPlaces(result);
  }, [searchQuery, places, activeFilter, sortBy]);

  const handleViewDetails = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailsOpen(true);
    
    // Load bus info for the city
    const cityData = getCityData(selectedCity.id);
    if (cityData) {
      setBuses(cityData.buses);
    }
  };

  const upcomingFestivals = getUpcomingUtsavs().slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar 
        onNearbyClick={handleNearbyClick}
        onFestivalsClick={handleFestivalsClick}
        onTransportClick={handleTransportClick}
        onTripsClick={handleTripsClick}
      />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold">
              Discover <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sacred Temples</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Explore the spiritual heritage of Telugu lands - Andhra Pradesh & Telangana
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8 -mt-20 relative z-10">
        {/* City Selector */}
        <div className="flex justify-center">
          <CitySelector
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />
        </div>

        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch} 
          currentLocation={`${selectedCity.name}, ${selectedCity.state}`}
        />

        {/* Filters */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Places Grid */}
        <div ref={placesRef} className="space-y-6 scroll-mt-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Places in {selectedCity.name} <span className="text-muted-foreground text-base font-normal">({filteredPlaces.length} found)</span>
            </h2>
          </div>

          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} onViewDetails={handleViewDetails} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
              <MapPin className="w-16 h-16 text-muted-foreground opacity-50" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Map View</h3>
                <p className="text-muted-foreground mb-4">
                  Interactive map coming soon
                </p>
                <Button variant="outline" onClick={() => setViewMode('list')}>
                  View as List
                </Button>
              </div>
            </div>
          )}

          {filteredPlaces.length === 0 && (
            <div className="glass-card rounded-3xl p-8 text-center">
              <p className="text-muted-foreground">No places found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Upcoming Festivals */}
        <div ref={festivalsRef} className="scroll-mt-20">
          {upcomingFestivals.length > 0 && (
            <UpcomingFestivals festivals={upcomingFestivals} />
          )}
        </div>

        {/* Bus Info Section */}
        <div ref={transportRef} className="scroll-mt-20">
          {buses.length > 0 ? (
            <BusInfo buses={buses} destination={selectedPlace?.name || selectedCity.name} />
          ) : (
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-4">Transport Options</h3>
              <p className="text-muted-foreground">
                Select a place to view available bus routes and transport options from {selectedCity.name}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Place Details Modal */}
      <PlaceDetails
        place={selectedPlace}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Index;
