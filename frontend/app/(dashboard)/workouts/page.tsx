"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function WorkoutsPage() {
  const { data: workouts, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      const res = await api.get("/workouts/");
      return res.data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Workouts</h1>
        <button className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Create Template</button>
      </div>

      {isLoading ? (
        <p>Loading templates...</p>
      ) : workouts?.length === 0 ? (
        <div className="p-8 text-center bg-white border rounded shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No workout templates yet</h3>
          <p className="mt-1 text-gray-500">Create your first workout template to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts?.map((workout: any) => (
            <div key={workout.id} className="p-4 bg-white border rounded shadow-sm">
              <h3 className="text-lg font-bold">{workout.name}</h3>
              <p className="text-sm text-gray-500">{workout.exercises?.length || 0} exercises</p>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700">Start</button>
                <button className="flex-1 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
