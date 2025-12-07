'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
}

export function Header({ userEmail, userName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search appointments, services..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
          <span className="sr-only">Notifications</span>
        </Button>

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
