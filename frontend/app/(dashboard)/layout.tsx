"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        <nav className="w-64 bg-white border-r">
          <div className="p-6 text-xl font-bold text-indigo-600">RepLab</div>
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link href="/dashboard" className={`block p-2 rounded hover:bg-gray-100 ${pathname === "/dashboard" ? "bg-gray-100 font-semibold" : ""}`}>Dashboard</Link>
            </li>
            <li>
              <Link href="/exercises" className={`block p-2 rounded hover:bg-gray-100 ${pathname === "/exercises" ? "bg-gray-100 font-semibold" : ""}`}>Exercises</Link>
            </li>
            <li>
              <Link href="/workouts" className={`block p-2 rounded hover:bg-gray-100 ${pathname === "/workouts" ? "bg-gray-100 font-semibold" : ""}`}>Workouts</Link>
            </li>
          </ul>
          <div className="absolute bottom-0 w-64 p-4 border-t">
            <button onClick={handleLogout} className="w-full p-2 text-left text-red-600 rounded hover:bg-red-50">Logout</button>
          </div>
        </nav>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </QueryClientProvider>
  );
}
