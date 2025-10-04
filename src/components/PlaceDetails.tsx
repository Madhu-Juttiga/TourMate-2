import { Place } from '@/types';
import { X, MapPin, Star, Clock, IndianRupee, Navigation, Share2, Calendar, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ImageGallery from '@/components/ImageGallery';
import { toast } from 'sonner';
import { useState } from 'react';

interface PlaceDetailsProps {
  place: Place | null;
  open: boolean;
  onClose: () => void;
}

const PlaceDetails = ({ place, open, onClose }: PlaceDetailsProps) => {
  const [showGallery, setShowGallery] = useState(false);
  
  if (!place) return null;

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`;
    window.open(url, '_blank');
    toast.success('Opening Google Maps...');
  };

  const handleShare = () => {
    const shareText = `Check out ${place.name} on TourMate! ${place.description}`;
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Trip details copied to clipboard!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto border-secondary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{place.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Carousel */}
          {place.gallery && place.gallery.length > 0 ? (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {place.gallery.slice(0, 4).map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-64 rounded-2xl overflow-hidden">
                        <img
                          src={image}
                          alt={`${place.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 glass-card px-4 py-2 rounded-full flex items-center gap-2 z-10">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-bold">{place.rating}</span>
              </div>

              {/* View All Photos Button */}
              <Button
                variant="glass"
                className="w-full mt-3"
                onClick={() => setShowGallery(true)}
              >
                <Images className="w-4 h-4 mr-2" />
                View All {place.gallery.length} Photos
              </Button>
            </div>
          ) : (
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 glass-card px-4 py-2 rounded-full flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-bold">{place.rating}</span>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="flex items-center gap-3">
            <span className="glass-card px-4 py-2 rounded-full text-sm font-medium">
              {place.category}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm">{place.distance.toFixed(1)} km away</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed">{place.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Timings</span>
              </div>
              <p className="text-muted-foreground">{place.timings}</p>
            </div>

            <div className="glass rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <IndianRupee className="w-5 h-5" />
                <span className="font-semibold">Entry Fee</span>
              </div>
              <p className="text-muted-foreground">{place.entryFee}</p>
            </div>
          </div>

          {/* Festivals */}
          {place.festivalInfo && place.festivalInfo.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Festivals & Events
              </h3>
              <div className="space-y-3">
                {place.festivalInfo.map((festival) => (
                  <div key={festival.id} className="glass rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{festival.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${festival.isPast ? 'bg-muted' : 'bg-accent/20 text-accent'}`}>
                        {festival.isPast ? 'Past' : 'Upcoming'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{festival.description}</p>
                    <p className="text-xs text-accent">{new Date(festival.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="glass-primary" className="flex-1" onClick={handleNavigate}>
              <Navigation className="w-4 h-4 mr-2" />
              Navigate Now
            </Button>
            <Button variant="glass" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Image Gallery Modal */}
      {place.gallery && place.gallery.length > 0 && (
        <Dialog open={showGallery} onOpenChange={setShowGallery}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Photo Gallery - {place.name}</DialogTitle>
            </DialogHeader>
            <ImageGallery images={place.gallery} placeName={place.name} />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default PlaceDetails;
