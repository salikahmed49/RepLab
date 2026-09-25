'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BarChart3, Dumbbell, LayoutDashboard, LogOut, Menu, Plus, Settings, Sparkles, Timer, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const queryClient = new QueryClient();
const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/exercises', label: 'Exercise library', icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const navigation = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Dumbbell /></span>
          <span className="text-xl font-bold tracking-tight">Rep<span className="text-[var(--lime)]">Lab</span></span>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></Button>
      </div>
      <div className="px-4 pb-5">
        <Link href="/workouts" onClick={() => setMobileOpen(false)}>
          <Button className="w-full justify-start gap-2 bg-[var(--lime)] text-[var(--ink)] hover:bg-[var(--lime)]/85"><Plus data-icon="inline-start" /> Log workout</Button>
        </Link>
      </div>
      <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', pathname === href && 'bg-sidebar-accent text-sidebar-accent-foreground') }>
            <Icon className="size-4" /> {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-1 border-t border-sidebar-border p-4">
        <Link href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent"><Settings className="size-4" /> Settings</Link>
        <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-destructive"><LogOut className="size-4" /> Sign out</button>
      </div>
    </div>
  );

  return <QueryClientProvider client={queryClient}><div className="min-h-screen bg-background md:flex"><aside className="fixed inset-y-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar md:block">{navigation}</aside><div className={cn('fixed inset-0 z-50 bg-background md:hidden', !mobileOpen && 'hidden')}>{navigation}</div><main className="min-w-0 flex-1 md:ml-64"><header className="flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:px-8"><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button><div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><Timer className="size-4" /> Thursday, September 26</div><div className="ml-auto flex items-center gap-3"><span className="hidden text-right sm:block"><span className="block text-sm font-semibold">Alex Morgan</span><span className="block text-xs text-muted-foreground">Consistency beats intensity.</span></span><span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold">AM</span></div></header><div className="mx-auto max-w-[1440px] p-5 md:p-8">{children}</div></main></div></QueryClientProvider>;
}

export function InsightBadge() { return <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime-soft)] px-2 py-1 text-xs font-semibold text-[var(--ink)]"><Sparkles className="size-3" /> Insight</span>; }
