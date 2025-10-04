import { Bus } from '@/types';
import { Bus as BusIcon, Clock, IndianRupee, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusInfoProps {
  buses: Bus[];
  destination: string;
}

const BusInfo = ({ buses, destination }: BusInfoProps) => {
  const getBusTypeColor = (type: Bus['type']) => {
    switch (type) {
      case 'AC':
        return 'bg-blue-500/20 text-blue-300';
      case 'Luxury':
        return 'bg-purple-500/20 text-purple-300';
      case 'Express':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <BusIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Bus Routes</h3>
          <p className="text-sm text-muted-foreground">to {destination}</p>
        </div>
      </div>

      <div className="space-y-3">
        {buses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BusIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No bus routes available</p>
            <p className="text-xs mt-1">Configure API to show live bus data</p>
          </div>
        ) : (
          buses.map((bus) => (
            <div key={bus.id} className="glass rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{bus.number}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getBusTypeColor(bus.type)}`}>
                      {bus.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{bus.name}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-accent font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    <span>{bus.fare}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{bus.departureTime}</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{bus.arrivalTime}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="font-semibold">Route:</span> {bus.route}
              </div>
            </div>
          ))
        )}
      </div>

      {buses.length > 0 && (
        <Button variant="glass" className="w-full">
          <Navigation className="w-4 h-4 mr-2" />
          View All Routes
        </Button>
      )}
    </div>
  );
};

export default BusInfo;
