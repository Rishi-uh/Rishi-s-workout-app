import React from "react";
import { Home, List, Dumbbell, History } from "lucide-react";

interface BottomNavProps {
  currentTab: string;
  onChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChange,
}) => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "history", icon: History, label: "History" },
    { id: "templates", icon: List, label: "Templates" },
    { id: "workout", icon: Dumbbell, label: "Workout" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive
                  ? "text-primary-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
