'use client';

import { createServiceAction } from '@/actions/services';
import { CreateServiceSchema, createServiceSchema } from '@/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const ServicesCreateForm = () => {
  const router = useRouter();

  const form = useForm<CreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: undefined,
      price: undefined,
    },
  });

  const onSubmit = async (data: CreateServiceSchema) => {
    try {
      const response = await createServiceAction(data);

      if (response?.success) {
        toast.success('Service created successfully');
        form.reset();
        router.push('/services');
      }

      if (!response?.success) {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Failed to create service');
    }
  };

  return (
    <div className="col-span-12 rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Create Service</h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Title" {...form.register('title')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Description"
            {...form.register('description')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            placeholder="Duration"
            type="number"
            {...form.register('duration', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            placeholder="Price"
            type="number"
            {...form.register('price', { valueAsNumber: true })}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ServicesCreateForm;
