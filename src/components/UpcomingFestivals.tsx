import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Utsav } from '@/types';
import { format } from 'date-fns';

interface UpcomingFestivalsProps {
  festivals: Utsav[];
}

const UpcomingFestivals = ({ festivals }: UpcomingFestivalsProps) => {
  if (festivals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Upcoming Utsavs & Festivals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {festivals.map((festival) => (
          <Card key={festival.id} className="p-4 glass-card hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg">{festival.name}</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                  {festival.category}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(festival.date), 'MMM dd, yyyy')}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{festival.city}</span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {festival.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingFestivals;
