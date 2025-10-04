import { useState, useEffect } from 'react';
import { Place, FilterType, SortType, ViewMode, Bus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import PlaceCard from '@/components/PlaceCard';
import PlaceDetails from '@/components/PlaceDetails';
import BusInfo from '@/components/BusInfo';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-temple.jpg';

const Index = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('distance');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch location name
  const fetchLocationName = async (latitude: number, longitude: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-location-name', {
        body: { latitude, longitude },
      });

      if (error) throw error;

      if (data?.locationName) {
        setCurrentLocation(data.locationName);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setCurrentLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
    }
  };

  // Fetch nearby places from Google Places API
  const fetchNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-nearby-places', {
        body: { latitude, longitude, radius: 50000 },
      });

      if (error) throw error;

      if (data?.places) {
        setPlaces(data.places);
        setFilteredPlaces(data.places);
        toast.success(`Found ${data.places.length} nearby places!`);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      toast.error('Failed to fetch nearby places. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Search places using Google Places Text Search
  const searchPlaces = async (query: string) => {
    if (!query.trim() || !userCoords) {
      // If no query, show nearby places
      setFilteredPlaces(places);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-place-search', {
        body: {
          query,
          latitude: userCoords.lat,
          longitude: userCoords.lng,
          radius: 50000,
        },
      });

      if (error) throw error;

      if (data?.places) {
        setFilteredPlaces(data.places);
        toast.success(`Found ${data.places.length} results for "${query}"`);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch transit routes when a place is selected
  const fetchTransitRoutes = async (destLat: number, destLng: number) => {
    if (!userCoords) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-transit-routes', {
        body: {
          originLat: userCoords.lat,
          originLng: userCoords.lng,
          destLat,
          destLng,
        },
      });

      if (error) throw error;

      if (data?.buses) {
        setBuses(data.buses);
      }
    } catch (error) {
      console.error('Error fetching transit routes:', error);
      setBuses([]);
    }
  };

  // Detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          toast.success('Location detected!');
          fetchLocationName(lat, lng);
          fetchNearbyPlaces(lat, lng);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationError(true);
          setLoading(false);
          toast.error('Unable to detect location.');
        }
      );
    } else {
      setLocationError(true);
      setLoading(false);
      toast.error('Geolocation not supported by your browser.');
    }
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchPlaces(searchQuery);
      } else {
        // If no search query, show all places with filters
        let result = [...places];

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
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, places, activeFilter, sortBy]);

  const handleViewDetails = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailsOpen(true);
    // Fetch transit routes to this place
    fetchTransitRoutes(place.location.lat, place.location.lng);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <div>
            <h2 className="text-xl font-bold mb-2">Detecting your location...</h2>
            <p className="text-muted-foreground">Finding nearby attractions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
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
              Discover <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sacred Places</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Your AI-powered travel companion for temples, festivals, and spiritual journeys
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8 -mt-20 relative z-10">
        {/* Search Bar */}
        <SearchBar 
          onSearch={setSearchQuery} 
          currentLocation={currentLocation}
          isSearching={isSearching}
        />

        {locationError && (
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3 border-destructive/50">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm">Location access denied. Showing default places.</p>
            <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Nearby Places <span className="text-muted-foreground text-base font-normal">({filteredPlaces.length} found)</span>
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
                  Map integration will be available after API configuration
                </p>
                <Button variant="glass-primary" onClick={() => setViewMode('list')}>
                  View as List
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bus Info Section */}
        {selectedPlace && buses.length > 0 && (
          <BusInfo buses={buses} destination={selectedPlace.name} />
        )}

        {/* Live Data Status */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Data Connected
          </h3>
          <p className="text-muted-foreground">
            TourMate is now connected to Google Places API and showing real-time data for nearby sacred places and tourist attractions.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ <strong>Google Places API</strong> - Nearby temples and attractions</li>
            <li>✓ <strong>Google Maps Transit API</strong> - Bus and public transport routes</li>
            <li>• <strong>Enhanced Features</strong> - Maps integration coming soon</li>
          </ul>
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
