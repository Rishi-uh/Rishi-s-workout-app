export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Full Body";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
}

export type SetType = "normal" | "drop";

export interface DropSetPart {
  id: string;
  reps: number;
  weight: number;
}

export interface WorkoutSet {
  id: string;
  type: SetType;
  reps: number; // For normal set
  weight: number; // For normal set
  dropSets: DropSetPart[]; // For drop set
  completed: boolean;
}

export interface SessionExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: string[]; // Array of Exercise IDs
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string
  templateId?: string;
  name: string;
  exercises: SessionExercise[];
  endTime?: string; // If present, workout is finished
}
