'use client';

import { updateNotificationStatus } from '@/actions/notifications';
import { Tables } from '../../../database.types';
import { Button } from '../ui/button';
import { Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NotificationsList = ({
  notifications,
}: {
  notifications: Tables<'notifications'>[];
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const updateNotificationStatusHandler = async (notificationId: string) => {
    setLoading(true);
    await updateNotificationStatus(notificationId);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your notifications
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="group relative rounded-lg border bg-background p-5 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{notification.title}</h3>
              {!notification.read && (
                <Button
                  disabled={loading}
                  onClick={() =>
                    updateNotificationStatusHandler(notification.id)
                  }
                  size="sm"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Eye className="size-4 mr-1" />
                  )}
                  {loading ? 'Marking as read...' : 'Mark as read'}
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{notification.body}</p>
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {new Date(notification.created_at || '').toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsList;
