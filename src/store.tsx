import React, { createContext, useContext, useEffect, useState } from "react";
import { WorkoutSession, WorkoutTemplate } from "./types";

interface AppState {
  sessions: WorkoutSession[];
  templates: WorkoutTemplate[];
  activeWorkoutId: string | null;
}

interface AppContextType extends AppState {
  addSession: (session: WorkoutSession) => void;
  updateSession: (session: WorkoutSession) => void;
  deleteSession: (id: string) => void;
  addTemplate: (template: WorkoutTemplate) => void;
  updateTemplate: (template: WorkoutTemplate) => void;
  deleteTemplate: (id: string) => void;
  setActiveWorkoutId: (id: string | null) => void;
}

const defaultState: AppState = {
  sessions: [],
  templates: [
    { id: "t1", name: "Pull Day", exercises: ["e6", "e7", "e8", "e21"] },
    { id: "t2", name: "Push Day", exercises: ["e1", "e2", "e17", "e22"] },
    { id: "t3", name: "Leg Day", exercises: ["e11", "e12", "e14", "e15"] },
  ],
  activeWorkoutId: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem("gym-tracker-state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem("gym-tracker-state", JSON.stringify(state));
  }, [state]);

  const addSession = (session: WorkoutSession) => {
    setState((s) => ({ ...s, sessions: [...s.sessions, session] }));
  };

  const updateSession = (session: WorkoutSession) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) => (x.id === session.id ? session : x)),
    }));
  };

  const deleteSession = (id: string) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.filter((x) => x.id !== id),
      activeWorkoutId: s.activeWorkoutId === id ? null : s.activeWorkoutId,
    }));
  };

  const addTemplate = (template: WorkoutTemplate) => {
    setState((s) => ({ ...s, templates: [...s.templates, template] }));
  };

  const updateTemplate = (template: WorkoutTemplate) => {
    setState((s) => ({
      ...s,
      templates: s.templates.map((x) => (x.id === template.id ? template : x)),
    }));
  };

  const deleteTemplate = (id: string) => {
    setState((s) => ({
      ...s,
      templates: s.templates.filter((x) => x.id !== id),
    }));
  };

  const setActiveWorkoutId = (id: string | null) => {
    setState((s) => ({ ...s, activeWorkoutId: id }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addSession,
        updateSession,
        deleteSession,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        setActiveWorkoutId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};
