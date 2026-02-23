import React from "react";
import { useAppStore } from "../store";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

export const HistoryScreen: React.FC<{
  onViewSession: (id: string) => void;
}> = ({ onViewSession }) => {
  const { sessions } = useAppStore();

  // Sort sessions by date descending
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 pb-24 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">History</h1>
          <p className="text-zinc-400 text-sm">Your past workouts</p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedSessions.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-6 text-center border border-zinc-800">
            <p className="text-zinc-500">No workouts logged yet.</p>
          </div>
        ) : (
          sortedSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onViewSession(session.id)}
              className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors text-left flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">{session.name}</h3>
                <p className="text-sm text-zinc-400">
                  {format(new Date(session.date), "MMM do, yyyy")} •{" "}
                  {session.exercises.length} exercises
                </p>
              </div>
              <ChevronRight size={20} className="text-zinc-500" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
