"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const previewExercises = [
  { id: 1, name: "Barbell Bench Press", muscle_group: "Chest", equipment: "Barbell" },
  { id: 2, name: "Back Squat", muscle_group: "Quads", equipment: "Barbell" },
  { id: 3, name: "Romanian Deadlift", muscle_group: "Hamstrings", equipment: "Barbell" },
  { id: 4, name: "Overhead Press", muscle_group: "Shoulders", equipment: "Barbell" },
  { id: 5, name: "Pull Up", muscle_group: "Back", equipment: "Bodyweight" },
  { id: 6, name: "Incline Dumbbell Press", muscle_group: "Chest", equipment: "Dumbbells" },
];

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const { data: exercises, isLoading } = useQuery({ queryKey: ["exercises", search], queryFn: async () => (await api.get(`/exercises/?search=${search}`)).data, retry: false });
  const items = exercises?.length ? exercises : previewExercises;
  const filtered = items.filter((exercise: any) => exercise.name.toLowerCase().includes(search.toLowerCase()));

  return <div className="flex flex-col gap-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm text-muted-foreground">Find your next movement</p><h1 className="text-3xl font-semibold tracking-tight">Exercise library</h1><p className="mt-2 text-muted-foreground">Browse movements and build better sessions.</p></div><Button variant="outline">Add custom exercise</Button></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search exercises" placeholder="Search exercises..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" /></div><Button variant="outline" className="w-fit"><SlidersHorizontal data-icon="inline-start" /> Filters</Button></div><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{filtered.length} exercises</p><div className="flex gap-2"><Badge variant="secondary">All muscle groups</Badge><Badge variant="outline">All equipment</Badge></div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{isLoading ? <p className="text-muted-foreground">Loading exercises...</p> : filtered.map((exercise: any) => <Card key={exercise.id} className="border-border/70 shadow-none transition-colors hover:border-foreground/30"><CardContent className="p-5"><div className="mb-8 flex size-11 items-center justify-center rounded-xl bg-secondary text-lg font-semibold">{exercise.name.charAt(0)}</div><h2 className="font-semibold">{exercise.name}</h2><p className="mt-1 text-sm text-muted-foreground">{exercise.muscle_group} · {exercise.equipment}</p><Button variant="link" className="mt-4 h-auto p-0 text-sm">View history</Button></CardContent></Card>)}</div></div>;
}
