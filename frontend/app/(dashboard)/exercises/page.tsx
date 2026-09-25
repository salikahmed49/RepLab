"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");

  const { data: exercises, isLoading } = useQuery({
    queryKey: ["exercises", search],
    queryFn: async () => {
      const res = await api.get(`/exercises/?search=${search}`);
      return res.data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
        <button className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Add Custom</button>
      </div>

      <input 
        type="text" 
        placeholder="Search exercises..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded shadow-sm focus:ring focus:ring-indigo-200"
      />

      {isLoading ? (
        <p>Loading exercises...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises?.map((ex: any) => (
            <div key={ex.id} className="p-4 bg-white border rounded shadow-sm">
              <h3 className="text-lg font-semibold">{ex.name}</h3>
              <p className="text-sm text-gray-500">{ex.muscle_group} • {ex.equipment}</p>
              {ex.is_custom && <span className="inline-block mt-2 px-2 py-1 text-xs text-indigo-700 bg-indigo-100 rounded">Custom</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
