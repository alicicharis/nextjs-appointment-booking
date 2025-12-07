import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  duration: number; // in minutes
  price: number;
  description?: string;
}

const mockServices: Service[] = [
  {
    id: '1',
    title: 'Haircut & Styling',
    duration: 45,
    price: 50,
    description: 'Professional haircut with styling',
  },
  {
    id: '2',
    title: 'Full Service',
    duration: 90,
    price: 120,
    description: 'Complete service package',
  },
  {
    id: '3',
    title: 'Consultation',
    duration: 30,
    price: 25,
    description: 'Initial consultation session',
  },
  {
    id: '4',
    title: 'Color Treatment',
    duration: 120,
    price: 150,
    description: 'Full color treatment service',
  },
];

export function ServicesList() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Services</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your service offerings
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/services/create">
            <Plus className="size-4 mr-2" />
            Add Service
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => (
          <div
            key={service.id}
            className="group relative rounded-lg border bg-background p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="size-8">
                  <Edit className="size-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive"
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            {service.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {service.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <DollarSign className="size-4" />
                <span>${service.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
