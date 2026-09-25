"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ChevronRight, Flame, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InsightBadge } from "../layout";

const recentWorkouts = [
  { name: "Upper Body Strength", date: "Yesterday", duration: "48 min", volume: "12,480 lb" },
  { name: "Lower Body Power", date: "Sep 23", duration: "56 min", volume: "18,200 lb" },
  { name: "Push Day", date: "Sep 21", duration: "42 min", volume: "10,850 lb" },
];

const week = [
  { day: "M", value: 72 }, { day: "T", value: 100 }, { day: "W", value: 54 },
  { day: "T", value: 86 }, { day: "F", value: 38 }, { day: "S", value: 0 }, { day: "S", value: 0 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Thursday, September 26, 2024</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Good morning, Alex.</h1>
          <p className="mt-2 text-muted-foreground">Stay consistent. Your next session is waiting.</p>
        </div>
        <Link href="/workouts"><Button className="w-fit bg-[var(--lime)] text-[var(--ink)] hover:bg-[var(--lime)]/85"><Plus data-icon="inline-start" /> Log workout</Button></Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Weekly volume", value: "41,530 lb", detail: "+12.4% vs last week", icon: TrendingUp },
          { label: "Workouts completed", value: "4 / 5", detail: "One more to hit your goal", icon: Check },
          { label: "Current streak", value: "12 days", detail: "Your best is 18 days", icon: Flame },
          { label: "Est. bench 1RM", value: "225 lb", detail: "+10 lb this month", icon: ArrowUpRight },
        ].map(({ label, value, detail, icon: Icon }) => (
          <Card key={label} className="border-border/70 shadow-none">
            <CardContent className="flex min-h-36 flex-col justify-between p-5">
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><Icon className="size-4 text-muted-foreground" /></div>
              <div><p className="text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="border-border/70 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><div><CardTitle className="text-base">Training load</CardTitle><p className="mt-1 text-sm text-muted-foreground">This week&apos;s completed volume</p></div><InsightBadge /></CardHeader>
          <CardContent><div className="flex h-56 items-end justify-between gap-3 pt-6">{week.map(({ day, value }, index) => <div key={`${day}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-3"><div className="flex w-full flex-1 items-end"><div className="w-full rounded-t-md bg-[var(--lime)] transition-all" style={{ height: `${Math.max(value, 5)}%`, opacity: value ? 1 : 0.25 }} /></div><span className="text-xs text-muted-foreground">{day}</span></div>)}</div></CardContent>
        </Card>
        <Card className="border-border/70 bg-[var(--ink)] text-white shadow-none"><CardHeader><Badge className="w-fit border-0 bg-[var(--lime)] text-[var(--ink)]">Next up</Badge><CardTitle className="pt-3 text-2xl">Upper Body Strength</CardTitle><p className="text-white/60">4 exercises · around 45 min</p></CardHeader><CardContent className="flex flex-1 flex-col justify-end"><Link href="/workouts"><Button className="w-full bg-white text-[var(--ink)] hover:bg-white/90">Start workout <ArrowUpRight data-icon="inline-end" /></Button></Link></CardContent></Card>
      </section>

      <Card className="border-border/70 shadow-none"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Recent workouts</CardTitle><Link href="/workouts" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">View all <ChevronRight className="size-4" /></Link></CardHeader><CardContent className="p-0"><div className="divide-y divide-border">{recentWorkouts.map((workout) => <div key={workout.name} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{workout.name}</p><p className="mt-1 text-sm text-muted-foreground">{workout.date} · {workout.duration}</p></div><span className="text-sm font-medium text-muted-foreground">{workout.volume}</span></div>)}</div></CardContent></Card>
    </div>
  );
}

