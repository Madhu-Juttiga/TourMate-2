export interface Location {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  category: 'Temple' | 'Tourist Spot' | 'Park' | 'Monument' | 'Museum';
  description: string;
  location: Location;
  distance: number; // in km from city center
  image: string;
  thumbnail: string;
  rating: number;
  timings: string;
  entryFee: string;
  festivalInfo?: Festival[];
  city: string;
  state: string;
}

export interface Festival {
  id: string;
  name: string;
  date: string;
  description: string;
  images: string[];
  isPast: boolean;
}

export interface Utsav extends Festival {
  city: string;
  category: 'Religious' | 'Cultural' | 'Traditional';
}

export interface Bus {
  id: string;
  number: string;
  name: string;
  type: 'AC' | 'Non-AC' | 'Express' | 'Luxury' | 'Deluxe' | 'Garuda';
  departureTime: string;
  arrivalTime: string;
  fare: number;
  route: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  description: string;
  image: string;
  coordinates: Location;
  popularPlacesCount: number;
}

export interface CityData {
  city: City;
  places: Place[];
  utsavs: Utsav[];
  buses: Bus[];
}

export interface Trip {
  id: string;
  places: Place[];
  date: string;
  userId: string;
}

export type ViewMode = 'list' | 'map';

export type FilterType = 'all' | 'Temple' | 'Tourist Spot' | 'Park' | 'Monument' | 'Museum';

export type SortType = 'distance' | 'rating' | 'entryFee';
