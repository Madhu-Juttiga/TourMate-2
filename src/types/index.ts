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
  distance: number; // in km
  image: string;
  thumbnail: string;
  rating: number;
  timings: string;
  entryFee: string;
  festivalInfo?: Festival[];
}

export interface Festival {
  id: string;
  name: string;
  date: string;
  description: string;
  images: string[];
  isPast: boolean;
}

export interface Bus {
  id: string;
  number: string;
  name: string;
  type: 'AC' | 'Non-AC' | 'Express' | 'Luxury';
  departureTime: string;
  arrivalTime: string;
  fare: number;
  route: string;
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
