import React, { useState } from "react";
import { AppProvider, useAppStore } from "./store";
import { BottomNav } from "./components/BottomNav";
import { HomeScreen } from "./screens/HomeScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { TemplatesScreen } from "./screens/TemplatesScreen";
import { ActiveWorkoutScreen } from "./screens/ActiveWorkoutScreen";
import { WorkoutDetailScreen } from "./screens/WorkoutDetailScreen";
import { WorkoutSession, SessionExercise } from "./types";
import { POPULAR_EXERCISES } from "./data/exercises";

const MainApp = () => {
  const [currentTab, setCurrentTab] = useState("home");
  const [viewingSessionId, setViewingSessionId] = useState<string | null>(null);
  const { activeWorkoutId, setActiveWorkoutId, addSession, templates } =
    useAppStore();

  const handleStartWorkout = (templateId?: string) => {
    if (activeWorkoutId) {
      if (
        !window.confirm(
          "You already have an active workout. Do you want to replace it?",
        )
      ) {
        setCurrentTab("workout");
        return;
      }
    }

    let exercises: SessionExercise[] = [];
    let name = "Freestyle Workout";

    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        name = template.name;
        exercises = template.exercises.map((exId) => ({
          id: crypto.randomUUID(),
          exerciseId: exId,
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
        }));
      }
    }

    const newSession: WorkoutSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name,
      exercises,
      templateId,
    };

    addSession(newSession);
    setActiveWorkoutId(newSession.id);
    setCurrentTab("workout");
  };

  return (
    <div className="h-screen w-full bg-black text-white flex justify-center">
      <div className="w-full max-w-md h-full relative overflow-hidden bg-black shadow-2xl">
        {viewingSessionId ? (
          <WorkoutDetailScreen
            sessionId={viewingSessionId}
            onBack={() => setViewingSessionId(null)}
          />
        ) : (
          <>
            {currentTab === "home" && (
              <HomeScreen
                onNavigate={setCurrentTab}
                onViewSession={setViewingSessionId}
              />
            )}
            {currentTab === "history" && (
              <HistoryScreen onViewSession={setViewingSessionId} />
            )}
            {currentTab === "templates" && (
              <TemplatesScreen onStartWorkout={handleStartWorkout} />
            )}
            {currentTab === "workout" && (
              <ActiveWorkoutScreen onFinish={() => setCurrentTab("home")} />
            )}

            <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
