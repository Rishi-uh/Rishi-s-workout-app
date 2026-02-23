import React, { useState } from "react";
import { useAppStore } from "../store";
import { Plus, Play, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { POPULAR_EXERCISES } from "../data/exercises";
import { TemplateEditor } from "../components/TemplateEditor";

export const TemplatesScreen: React.FC<{
  onStartWorkout: (templateId: string) => void;
}> = ({ onStartWorkout }) => {
  const { templates, deleteTemplate } = useAppStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating || editingTemplateId) {
    return (
      <TemplateEditor
        templateId={editingTemplateId || undefined}
        onClose={() => {
          setIsCreating(false);
          setEditingTemplateId(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 pb-24 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-zinc-400 text-sm">Save your favorite routines</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors text-emerald-400"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 group transition-all hover:border-zinc-700"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-xl">{template.name}</h3>
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === template.id ? null : template.id,
                    )
                  }
                  className="text-zinc-500 hover:text-white p-1 rounded-md transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
                {openMenuId === template.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-10">
                    <button
                      onClick={() => {
                        setEditingTemplateId(template.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center border-b border-zinc-700"
                    >
                      <Edit2 size={16} className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this template?")) {
                          deleteTemplate(template.id);
                        }
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-700 flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-6 line-clamp-2">
              {template.exercises
                .map((exId) => {
                  const ex = POPULAR_EXERCISES.find((e) => e.id === exId);
                  return ex ? ex.name : "";
                })
                .join(", ")}
            </p>

            <button
              onClick={() => onStartWorkout(template.id)}
              className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-medium py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Play size={18} fill="currentColor" />
              <span>Start Routine</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
