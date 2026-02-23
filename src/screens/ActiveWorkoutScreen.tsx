import React, { useState, useEffect } from "react";
import { useAppStore } from "../store";
import { POPULAR_EXERCISES } from "../data/exercises";
import {
  SessionExercise,
  WorkoutSet,
  DropSetPart,
  WorkoutSession,
} from "../types";
import {
  Plus,
  Check,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Dumbbell,
  MoreVertical,
} from "lucide-react";

export const ActiveWorkoutScreen: React.FC<{ onFinish: () => void }> = ({
  onFinish,
}) => {
  const {
    sessions,
    activeWorkoutId,
    updateSession,
    deleteSession,
    setActiveWorkoutId,
    addSession,
  } = useAppStore();
  const session = sessions.find((s) => s.id === activeWorkoutId);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white p-6 text-center">
        <Dumbbell size={48} className="text-zinc-700 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Active Workout</h2>
        <p className="text-zinc-400 mb-8">
          Start a new workout from the Home or Templates tab.
        </p>
        <button
          onClick={() => {
            const newSession: WorkoutSession = {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              name: "Freestyle Workout",
              exercises: [],
            };
            addSession(newSession);
            setActiveWorkoutId(newSession.id);
          }}
          className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-full transition-colors mb-4"
        >
          Start Freestyle Workout
        </button>
        <button
          onClick={onFinish}
          className="text-zinc-400 hover:text-white font-medium py-3 px-8 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleFinish = () => {
    updateSession({ ...session, endTime: new Date().toISOString() });
    setActiveWorkoutId(null);
    onFinish();
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this workout?")) {
      deleteSession(session.id);
      onFinish();
    }
  };

  const addExercise = (exerciseId: string) => {
    const newExercise: SessionExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      sets: [
        {
          id: crypto.randomUUID(),
          type: "normal",
          reps: 10,
          weight: 0,
          dropSets: [],
          completed: false,
        },
      ],
    };
    updateSession({
      ...session,
      exercises: [...session.exercises, newExercise],
    });
    setShowAddExercise(false);
  };

  const addSet = (exerciseId: string, type: "normal" | "drop") => {
    const exIndex = session.exercises.findIndex((e) => e.id === exerciseId);
    if (exIndex === -1) return;

    const ex = session.exercises[exIndex];
    const lastSet = ex.sets[ex.sets.length - 1];

    const newSet: WorkoutSet = {
      id: crypto.randomUUID(),
      type,
      reps: lastSet ? lastSet.reps : 10,
      weight: lastSet ? lastSet.weight : 0,
      dropSets:
        type === "drop"
          ? [{ id: crypto.randomUUID(), reps: 10, weight: 0 }]
          : [],
      completed: false,
    };

    const newExercises = [...session.exercises];
    newExercises[exIndex] = { ...ex, sets: [...ex.sets, newSet] };
    updateSession({ ...session, exercises: newExercises });
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: keyof WorkoutSet,
    value: any,
  ) => {
    const exIndex = session.exercises.findIndex((e) => e.id === exerciseId);
    if (exIndex === -1) return;

    const ex = session.exercises[exIndex];
    const setIndex = ex.sets.findIndex((s) => s.id === setId);
    if (setIndex === -1) return;

    const newSets = [...ex.sets];
    newSets[setIndex] = { ...newSets[setIndex], [field]: value };

    const newExercises = [...session.exercises];
    newExercises[exIndex] = { ...ex, sets: newSets };
    updateSession({ ...session, exercises: newExercises });
  };

  const addDropSetPart = (exerciseId: string, setId: string) => {
    const exIndex = session.exercises.findIndex((e) => e.id === exerciseId);
    if (exIndex === -1) return;

    const ex = session.exercises[exIndex];
    const setIndex = ex.sets.findIndex((s) => s.id === setId);
    if (setIndex === -1) return;

    const currentSet = ex.sets[setIndex];
    const lastDropSet = currentSet.dropSets[currentSet.dropSets.length - 1];

    const newDropSetPart: DropSetPart = {
      id: crypto.randomUUID(),
      reps: lastDropSet ? lastDropSet.reps : 10,
      weight: lastDropSet ? Math.max(0, lastDropSet.weight - 5) : 0,
    };

    const newSets = [...ex.sets];
    newSets[setIndex] = {
      ...currentSet,
      dropSets: [...currentSet.dropSets, newDropSetPart],
    };

    const newExercises = [...session.exercises];
    newExercises[exIndex] = { ...ex, sets: newSets };
    updateSession({ ...session, exercises: newExercises });
  };

  const updateDropSetPart = (
    exerciseId: string,
    setId: string,
    partId: string,
    field: keyof DropSetPart,
    value: number,
  ) => {
    const exIndex = session.exercises.findIndex((e) => e.id === exerciseId);
    if (exIndex === -1) return;

    const ex = session.exercises[exIndex];
    const setIndex = ex.sets.findIndex((s) => s.id === setId);
    if (setIndex === -1) return;

    const currentSet = ex.sets[setIndex];
    const dropSetIndex = currentSet.dropSets.findIndex((d) => d.id === partId);
    if (dropSetIndex === -1) return;

    const newDropSets = [...currentSet.dropSets];
    newDropSets[dropSetIndex] = {
      ...newDropSets[dropSetIndex],
      [field]: value,
    };

    const newSets = [...ex.sets];
    newSets[setIndex] = { ...currentSet, dropSets: newDropSets };

    const newExercises = [...session.exercises];
    newExercises[exIndex] = { ...ex, sets: newSets };
    updateSession({ ...session, exercises: newExercises });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    const exIndex = session.exercises.findIndex((e) => e.id === exerciseId);
    if (exIndex === -1) return;

    const ex = session.exercises[exIndex];
    const newSets = ex.sets.filter((s) => s.id !== setId);

    const newExercises = [...session.exercises];
    newExercises[exIndex] = { ...ex, sets: newSets };
    updateSession({ ...session, exercises: newExercises });
  };

  const filteredExercises = POPULAR_EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-black text-white pb-24 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-zinc-800 flex justify-between items-center">
        <button
          onClick={handleCancel}
          className="text-red-400 font-medium hover:text-red-300"
        >
          Cancel
        </button>
        <h1 className="text-lg font-bold">{session.name}</h1>
        <button
          onClick={handleFinish}
          className="text-primary-400 font-medium hover:text-primary-300"
        >
          Finish
        </button>
      </div>

      <div className="p-4 space-y-6">
        {session.exercises.map((sessionEx, exIndex) => {
          const exercise = POPULAR_EXERCISES.find(
            (e) => e.id === sessionEx.exerciseId,
          );
          if (!exercise) return null;

          return (
            <div
              key={sessionEx.id}
              className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-primary-400">
                  {exercise.name}
                </h3>
                <button className="text-zinc-500 hover:text-zinc-300">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Sets Header */}
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-500 mb-2 px-2">
                <div className="col-span-2 text-center">SET</div>
                <div className="col-span-4 text-center">LBS</div>
                <div className="col-span-4 text-center">REPS</div>
                <div className="col-span-2 text-center">
                  <Check size={14} className="mx-auto" />
                </div>
              </div>

              {/* Sets List */}
              <div className="space-y-2">
                {sessionEx.sets.map((set, setIndex) => (
                  <div
                    key={set.id}
                    className={`rounded-xl p-2 transition-colors ${set.completed ? "bg-primary-500/10" : "bg-zinc-800/50"}`}
                  >
                    {set.type === "normal" ? (
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-2 text-center font-mono text-sm text-zinc-400">
                          {setIndex + 1}
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.weight || ""}
                            onChange={(e) =>
                              updateSet(
                                sessionEx.id,
                                set.id,
                                "weight",
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-zinc-800 text-center rounded-lg py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.reps || ""}
                            onChange={(e) =>
                              updateSet(
                                sessionEx.id,
                                set.id,
                                "reps",
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-zinc-800 text-center rounded-lg py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() =>
                              updateSet(
                                sessionEx.id,
                                set.id,
                                "completed",
                                !set.completed,
                              )
                            }
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              set.completed
                                ? "bg-primary-500 text-white"
                                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                            }`}
                          >
                            <Check size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                            Drop Set {setIndex + 1}
                          </span>
                          <button
                            onClick={() => removeSet(sessionEx.id, set.id)}
                            className="text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {set.dropSets.map((dropPart, partIndex) => (
                          <div
                            key={dropPart.id}
                            className="grid grid-cols-12 gap-2 items-center"
                          >
                            <div className="col-span-2 text-center font-mono text-xs text-zinc-500">
                              {partIndex + 1}
                            </div>
                            <div className="col-span-4">
                              <input
                                type="number"
                                value={dropPart.weight || ""}
                                onChange={(e) =>
                                  updateDropSetPart(
                                    sessionEx.id,
                                    set.id,
                                    dropPart.id,
                                    "weight",
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full bg-zinc-800 text-center rounded-lg py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                                placeholder="0"
                              />
                            </div>
                            <div className="col-span-4">
                              <input
                                type="number"
                                value={dropPart.reps || ""}
                                onChange={(e) =>
                                  updateDropSetPart(
                                    sessionEx.id,
                                    set.id,
                                    dropPart.id,
                                    "reps",
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full bg-zinc-800 text-center rounded-lg py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                                placeholder="0"
                              />
                            </div>
                            {partIndex === 0 && (
                              <div className="col-span-2 flex justify-center items-center row-span-full h-full">
                                <button
                                  onClick={() =>
                                    updateSet(
                                      sessionEx.id,
                                      set.id,
                                      "completed",
                                      !set.completed,
                                    )
                                  }
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                    set.completed
                                      ? "bg-primary-500 text-white"
                                      : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                                  }`}
                                >
                                  <Check size={16} strokeWidth={3} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addDropSetPart(sessionEx.id, set.id)}
                          className="w-full py-1.5 text-xs text-orange-400 font-medium hover:bg-orange-500/10 rounded-lg transition-colors"
                        >
                          + Add Drop
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Set Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => addSet(sessionEx.id, "normal")}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-2 rounded-xl text-sm transition-colors"
                >
                  + Add Set
                </button>
                <button
                  onClick={() => addSet(sessionEx.id, "drop")}
                  className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-medium py-2 rounded-xl text-sm transition-colors"
                >
                  + Drop Set
                </button>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setShowAddExercise(true)}
          className="w-full bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 font-medium py-4 rounded-2xl transition-colors flex items-center justify-center space-x-2 border border-primary-500/20"
        >
          <Plus size={20} />
          <span>Add Exercise</span>
        </button>
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="p-4 border-b border-zinc-800 flex items-center space-x-3">
            <button
              onClick={() => setShowAddExercise(false)}
              className="p-2 text-zinc-400 hover:text-white rounded-full"
            >
              <X size={24} />
            </button>
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => addExercise(exercise.id)}
                className="w-full flex items-center justify-between p-4 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors text-left"
              >
                <div>
                  <h4 className="font-semibold text-white">{exercise.name}</h4>
                  <p className="text-xs text-zinc-500">
                    {exercise.muscleGroup}
                  </p>
                </div>
                <Plus size={20} className="text-primary-500" />
              </button>
            ))}
            {filteredExercises.length === 0 && (
              <div className="text-center text-zinc-500 mt-8">
                No exercises found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
