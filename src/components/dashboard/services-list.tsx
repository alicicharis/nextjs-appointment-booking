import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, Edit, Plus } from 'lucide-react';
import Link from 'next/link';
import { Tables } from '../../../database.types';
import ServicesDeleteDialog from '../services/services-delete-dialog';

export function ServicesList({
  services,
  userRole,
}: {
  services: Tables<'services'>[];
  userRole: 'customer' | 'staff';
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Services</h2>
          {userRole === 'staff' && (
            <p className="text-sm text-muted-foreground mt-1">
              Manage your service offerings
            </p>
          )}
          {userRole === 'customer' && (
            <p className="text-sm text-muted-foreground mt-1">
              Browse our service offerings
            </p>
          )}
        </div>
        {userRole === 'staff' && (
          <Button size="sm" asChild>
            <Link href="/services/create">
              <Plus className="size-4 mr-2" />
              Add Service
            </Link>
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative rounded-lg border bg-background p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {userRole === 'staff' && (
                  <Link href={`/services/update/${service.id}`}>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Edit className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                )}
                {userRole === 'staff' && (
                  <ServicesDeleteDialog service={service} />
                )}
                {userRole === 'customer' && (
                  <Link href={`/services/book/${service.id}`}>
                    {' '}
                    <Button variant="ghost" size="icon" className="size-8">
                      <Calendar className="size-4" />
                      <span className="sr-only">Book</span>
                    </Button>{' '}
                  </Link>
                )}
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
                <span>{service.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
