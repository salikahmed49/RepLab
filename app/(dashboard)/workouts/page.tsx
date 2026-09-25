"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { ArrowUpRight, Clock3, Dumbbell, MoreHorizontal, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const previewWorkouts = [
  { id: "upper", name: "Upper Body Strength", description: "Chest, back, shoulders & arms", exercises: 6, duration: "45 min", level: "Intermediate", accent: "bg-[var(--lime)]" },
  { id: "lower", name: "Lower Body Power", description: "Quads, hamstrings & glutes", exercises: 5, duration: "50 min", level: "Strength", accent: "bg-[var(--blue)]" },
  { id: "push", name: "Push Day", description: "Chest, shoulders & triceps", exercises: 4, duration: "38 min", level: "Hypertrophy", accent: "bg-[var(--peach)]" },
];

export default function WorkoutsPage() {
  const { data: workouts, isLoading } = useQuery({ queryKey: ["workouts"], queryFn: async () => (await api.get("/workouts/")).data, retry: false });
  const items = workouts?.length ? workouts : previewWorkouts;

  return <div className="flex flex-col gap-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm text-muted-foreground">Your training plans</p><h1 className="text-3xl font-semibold tracking-tight">Workouts</h1><p className="mt-2 text-muted-foreground">Build a plan, then make every set count.</p></div><Button className="w-fit bg-[var(--lime)] text-[var(--ink)] hover:bg-[var(--lime)]/85"><Plus data-icon="inline-start" /> Create template</Button></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{isLoading ? <p className="text-muted-foreground">Loading templates...</p> : items.map((workout: any) => <Card key={workout.id} className="group overflow-hidden border-border/70 shadow-none transition-transform hover:-translate-y-0.5"><div className={`h-2 ${workout.accent || "bg-[var(--lime)]"}`} /><CardHeader><div className="flex items-start justify-between"><Badge variant="secondary">{workout.level || "Template"}</Badge><Button variant="ghost" size="icon" aria-label={`More options for ${workout.name}`}><MoreHorizontal /></Button></div><CardTitle className="pt-3 text-xl">{workout.name}</CardTitle><p className="text-sm text-muted-foreground">{workout.description || "A focused training session"}</p></CardHeader><CardContent><div className="mb-5 flex items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><Dumbbell className="size-4" /> {workout.exercises?.length || workout.exercises || 4} exercises</span><span className="flex items-center gap-1.5"><Clock3 className="size-4" /> {workout.duration || "45 min"}</span></div><Link href={`/workouts/${workout.id}`}><Button variant="outline" className="w-full">Start workout <ArrowUpRight data-icon="inline-end" /></Button></Link></CardContent></Card>)}</div></div>;
}
