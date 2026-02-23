import React, { useState } from "react";
import { useAppStore } from "../store";
import { Calendar } from "../components/Calendar";
import { format, isSameDay } from "date-fns";
import { Play } from "lucide-react";

export const HomeScreen: React.FC<{
  onNavigate: (tab: string) => void;
  onViewSession: (id: string) => void;
}> = ({ onNavigate, onViewSession }) => {
  const { sessions, activeWorkoutId } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const workoutDates = sessions.map((s) => new Date(s.date));
  const selectedDayWorkouts = sessions.filter((s) =>
    isSameDay(new Date(s.date), selectedDate),
  );

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 pb-24 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gym Tracker</h1>
          <p className="text-zinc-400 text-sm">
            {format(new Date(), "EEEE, MMMM do")}
          </p>
        </div>
      </div>

      <Calendar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        workoutDates={workoutDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-zinc-800 pb-2">
          Workouts on {format(selectedDate, "MMM do")}
        </h2>

        {selectedDayWorkouts.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-6 text-center border border-zinc-800">
            <p className="text-zinc-500 mb-4">
              No workouts logged on this day.
            </p>
            {isSameDay(selectedDate, new Date()) && (
              <button
                onClick={() => onNavigate("workout")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-full transition-colors inline-flex items-center space-x-2"
              >
                <Play size={18} fill="currentColor" />
                <span>
                  {activeWorkoutId ? "Resume Workout" : "Start Workout"}
                </span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDayWorkouts.map((session) => (
              <div
                key={session.id}
                onClick={() => onViewSession(session.id)}
                className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{session.name}</h3>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">
                    {session.endTime ? "Completed" : "In Progress"}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  {session.exercises.length} exercises
                </p>
                <div className="flex flex-wrap gap-2">
                  {session.exercises.slice(0, 3).map((ex) => (
                    <span
                      key={ex.id}
                      className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md"
                    >
                      {ex.sets.length} sets
                    </span>
                  ))}
                  {session.exercises.length > 3 && (
                    <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-1 rounded-md">
                      +{session.exercises.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
