import { Place, Festival, Bus } from '@/types';

// Mock data - will be replaced with real API data
export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Meenakshi Amman Temple',
    category: 'Temple',
    description: 'A historic Hindu temple located on the southern bank of the Vaigai River. It is dedicated to Parvati, known as Meenakshi, and her consort, Shiva.',
    location: { lat: 9.9195, lng: 78.1193 },
    distance: 2.5,
    image: '/placeholder.svg',
    thumbnail: '/placeholder.svg',
    rating: 4.8,
    timings: '5:00 AM - 10:00 PM',
    entryFee: 'Free',
    festivalInfo: [
      {
        id: 'f1',
        name: 'Meenakshi Thirukalyanam',
        date: '2024-04-15',
        description: 'Annual celebration of the divine marriage of Meenakshi and Sundareswarar',
        images: ['/placeholder.svg'],
        isPast: false
      }
    ]
  },
  {
    id: '2',
    name: 'Brihadeeswarar Temple',
    category: 'Temple',
    description: 'A UNESCO World Heritage Site, this temple is one of the largest temples in India and an exemplary example of Chola architecture.',
    location: { lat: 10.7824, lng: 79.1318 },
    distance: 5.3,
    image: '/placeholder.svg',
    thumbnail: '/placeholder.svg',
    rating: 4.9,
    timings: '6:00 AM - 8:30 PM',
    entryFee: '₹50',
  },
  {
    id: '3',
    name: 'Gandhi Memorial Museum',
    category: 'Museum',
    description: 'Museum dedicated to Mahatma Gandhi, housed in the historic Rani Mangammal Palace.',
    location: { lat: 9.9312, lng: 78.1215 },
    distance: 3.2,
    image: '/placeholder.svg',
    thumbnail: '/placeholder.svg',
    rating: 4.5,
    timings: '10:00 AM - 5:30 PM',
    entryFee: '₹10',
  },
  {
    id: '4',
    name: 'Thirumalai Nayakkar Palace',
    category: 'Monument',
    description: 'A 17th-century palace built by King Thirumalai Nayak in the Indo-Saracenic style.',
    location: { lat: 9.9174, lng: 78.1210 },
    distance: 1.8,
    image: '/placeholder.svg',
    thumbnail: '/placeholder.svg',
    rating: 4.6,
    timings: '9:00 AM - 5:00 PM',
    entryFee: '₹50',
  },
];

export const mockBuses: Bus[] = [
  {
    id: 'b1',
    number: '21A',
    name: 'City Express',
    type: 'AC',
    departureTime: '08:00 AM',
    arrivalTime: '08:45 AM',
    fare: 35,
    route: 'Central Bus Stand - Meenakshi Temple - Airport'
  },
  {
    id: 'b2',
    number: '15',
    name: 'Temple Route',
    type: 'Non-AC',
    departureTime: '09:00 AM',
    arrivalTime: '09:30 AM',
    fare: 15,
    route: 'Railway Station - Meenakshi Temple - Thirumalai Palace'
  },
  {
    id: 'b3',
    number: '45E',
    name: 'Tourist Express',
    type: 'Luxury',
    departureTime: '10:00 AM',
    arrivalTime: '11:30 AM',
    fare: 75,
    route: 'Central - All Major Temples - Museums'
  },
];
