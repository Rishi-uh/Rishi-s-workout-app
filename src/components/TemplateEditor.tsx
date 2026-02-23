import React, { useState } from "react";
import { useAppStore } from "../store";
import { POPULAR_EXERCISES } from "../data/exercises";
import { WorkoutTemplate } from "../types";
import { ArrowLeft, Plus, X, Search, Trash2 } from "lucide-react";

interface TemplateEditorProps {
  templateId?: string;
  onClose: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateId,
  onClose,
}) => {
  const { templates, addTemplate, updateTemplate } = useAppStore();
  const existingTemplate = templateId
    ? templates.find((t) => t.id === templateId)
    : null;

  const [name, setName] = useState(existingTemplate?.name || "");
  const [exercises, setExercises] = useState<string[]>(
    existingTemplate?.exercises || [],
  );
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a template name");
      return;
    }

    if (existingTemplate) {
      updateTemplate({
        ...existingTemplate,
        name: name.trim(),
        exercises,
      });
    } else {
      addTemplate({
        id: crypto.randomUUID(),
        name: name.trim(),
        exercises,
      });
    }
    onClose();
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addExercise = (exerciseId: string) => {
    setExercises((prev) => [...prev, exerciseId]);
    setShowAddExercise(false);
    setSearchQuery("");
  };

  const filteredExercises = POPULAR_EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="absolute inset-0 z-20 bg-black flex flex-col h-full text-white">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-zinc-800 flex justify-between items-center">
        <button
          onClick={onClose}
          className="text-zinc-400 font-medium hover:text-white flex items-center"
        >
          <ArrowLeft size={20} className="mr-1" /> Cancel
        </button>
        <h1 className="text-lg font-bold">
          {existingTemplate ? "Edit Template" : "New Template"}
        </h1>
        <button
          onClick={handleSave}
          className="text-emerald-400 font-medium hover:text-emerald-300"
        >
          Save
        </button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto pb-24">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Template Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Push Day"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-zinc-400">
              Exercises
            </label>
          </div>

          <div className="space-y-3 mb-4">
            {exercises.map((exId, index) => {
              const exercise = POPULAR_EXERCISES.find((e) => e.id === exId);
              if (!exercise) return null;
              return (
                <div
                  key={`${exId}-${index}`}
                  className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800"
                >
                  <div>
                    <h4 className="font-semibold">{exercise.name}</h4>
                    <p className="text-xs text-zinc-500">
                      {exercise.muscleGroup}
                    </p>
                  </div>
                  <button
                    onClick={() => removeExercise(index)}
                    className="text-zinc-500 hover:text-red-400 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
            {exercises.length === 0 && (
              <div className="text-center p-6 border border-dashed border-zinc-800 rounded-xl text-zinc-500">
                No exercises added yet.
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAddExercise(true)}
            className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-medium py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 border border-emerald-500/20"
          >
            <Plus size={20} />
            <span>Add Exercise</span>
          </button>
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="absolute inset-0 z-30 bg-black flex flex-col">
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
                className="w-full bg-zinc-900 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                <Plus size={20} className="text-emerald-500" />
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
