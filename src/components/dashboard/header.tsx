'use client';

import { updateNotificationStatus } from '@/actions/notifications';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { createClient } from '@/lib/supabase/client';
import { Bell, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Tables } from '../../../database.types';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  initialNotifications: Tables<'notifications'>[];
  userId: string;
}

export function Header({
  userEmail,
  userName,
  initialNotifications,
  userId,
}: HeaderProps) {
  const [notifications, setNotifications] =
    useState<Tables<'notifications'>[]>(initialNotifications);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const topic = `user:${userId}:notifications`;

    const channel = supabase
      .channel(topic, { config: { private: true } })
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        setNotifications((prevState) => [...prevState, payload.payload.record]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotifications([]);
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updateNotificationsHandler = async () => {
      if (!notifications?.length) return;

      console.log('Updatng notification status...');
      await Promise.all(
        notifications.map(async (notification) => {
          await updateNotificationStatus(notification.id);
        })
      );
    };

    if (isNotificationsOpen) {
      updateNotificationsHandler();
    }
  }, [isNotificationsOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  };

  const getInitials = () => {
    if (userName) {
      return userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (userEmail) {
      return userEmail[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />

      <div className="flex flex-1 items-center justify-end gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="size-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-md border bg-popover shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
              <div className="p-3 border-b">
                <p className="text-sm font-semibold">Notifications</p>
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="p-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-3 py-3 text-sm hover:bg-accent rounded-sm transition-colors cursor-pointer ${
                          !notification.read ? 'bg-accent/50' : ''
                        }`}
                      >
                        <p className="font-medium mb-1">{notification.title}</p>
                        {notification.body && (
                          <p className="text-muted-foreground text-xs mb-1">
                            {notification.body}
                          </p>
                        )}
                        {notification.created_at && (
                          <p className="text-muted-foreground text-xs">
                            {new Date(
                              notification.created_at
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {getInitials()}
            </div>
            <span className="sr-only">User menu</span>
          </Button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg z-50">
              <div className="p-4 border-b">
                <p className="text-sm font-medium">{userName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userEmail}
                </p>
              </div>
              <div className="p-1">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/profile');
                  }}
                >
                  <User className="size-4" />
                  Profile
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/settings');
                  }}
                >
                  <Settings className="size-4" />
                  Settings
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
