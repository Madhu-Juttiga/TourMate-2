import { Place } from '@/types';
import { MapPin, Star, Clock, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceCardProps {
  place: Place;
  onViewDetails: (place: Place) => void;
}

const PlaceCard = ({ place, onViewDetails }: PlaceCardProps) => {
  return (
    <div className="glass-card rounded-3xl overflow-hidden glass-hover cursor-pointer" onClick={() => onViewDetails(place)}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.thumbnail}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 glass-card px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">{place.rating}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-block glass-card px-3 py-1 rounded-full text-xs font-medium">
            {place.category}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">{place.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{place.distance.toFixed(1)} km away</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-accent" />
            <span>{place.timings}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IndianRupee className="w-4 h-4 text-accent" />
            <span>{place.entryFee}</span>
          </div>
        </div>

        <Button variant="glass-primary" className="w-full mt-4">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PlaceCard;
