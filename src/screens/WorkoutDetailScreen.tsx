import React from "react";
import { useAppStore } from "../store";
import { POPULAR_EXERCISES } from "../data/exercises";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export const WorkoutDetailScreen: React.FC<{
  sessionId: string;
  onBack: () => void;
}> = ({ sessionId, onBack }) => {
  const { sessions } = useAppStore();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div className="flex flex-col h-full bg-black text-white p-4">
        <button
          onClick={onBack}
          className="text-emerald-500 mb-4 flex items-center"
        >
          <ArrowLeft size={20} className="mr-1" /> Back
        </button>
        <p>Workout not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white pb-24 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-zinc-800 flex items-center">
        <button
          onClick={onBack}
          className="text-emerald-500 mr-4 p-1 hover:bg-zinc-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{session.name}</h1>
          <p className="text-zinc-400 text-sm">
            {format(new Date(session.date), "MMMM do, yyyy - h:mm a")}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {session.exercises.map((sessionEx, index) => {
          const exercise = POPULAR_EXERCISES.find(
            (e) => e.id === sessionEx.exerciseId,
          );
          if (!exercise) return null;

          return (
            <div
              key={sessionEx.id}
              className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
            >
              <h3 className="font-bold text-lg text-emerald-400 mb-4">
                {index + 1}. {exercise.name}
              </h3>

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-500 mb-2 px-2">
                  <div className="col-span-2 text-center">SET</div>
                  <div className="col-span-5 text-center">LBS</div>
                  <div className="col-span-5 text-center">REPS</div>
                </div>

                {sessionEx.sets.map((set, setIndex) => (
                  <div key={set.id} className="bg-zinc-800/50 rounded-xl p-2">
                    {set.type === "normal" ? (
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-2 text-center font-mono text-sm text-zinc-400">
                          {setIndex + 1}
                        </div>
                        <div className="col-span-5 text-center font-mono text-sm">
                          {set.weight}
                        </div>
                        <div className="col-span-5 text-center font-mono text-sm">
                          {set.reps}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-orange-400 uppercase tracking-wider px-2">
                          Drop Set {setIndex + 1}
                        </div>
                        {set.dropSets.map((dropPart, partIndex) => (
                          <div
                            key={dropPart.id}
                            className="grid grid-cols-12 gap-2 items-center"
                          >
                            <div className="col-span-2 text-center font-mono text-xs text-zinc-500">
                              {partIndex + 1}
                            </div>
                            <div className="col-span-5 text-center font-mono text-sm">
                              {dropPart.weight}
                            </div>
                            <div className="col-span-5 text-center font-mono text-sm">
                              {dropPart.reps}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {session.exercises.length === 0 && (
          <p className="text-zinc-500 text-center py-8">
            No exercises recorded.
          </p>
        )}
      </div>
    </div>
  );
};
