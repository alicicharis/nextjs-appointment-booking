'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteService } from '@/actions/services';
import { Tables } from '../../../database.types';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const ServicesDeleteDialog = ({ service }: { service: Tables<'services'> }) => {
  const router = useRouter();

  const [deleting, setDeleting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const deleteHandler = async () => {
    setDeleting(true);
    const response = await deleteService(service.id);
    if (response?.success) {
      toast.success('Service deleted successfully');
      setOpen(false);
      router.refresh();
    }
    if (response?.error) {
      toast.error(response?.error);
    }
    setDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-destructive">
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Service</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this service?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={deleteHandler}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServicesDeleteDialog;
