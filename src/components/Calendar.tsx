import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  workoutDates: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  onDateChange,
  workoutDates,
  selectedDate,
  onSelectDate,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart; // We could pad with previous month days, but let's keep it simple

  // Pad the start of the month to align with Sunday
  const startDayOfWeek = startDate.getDay();
  const paddedStartDate = new Date(startDate);
  paddedStartDate.setDate(startDate.getDate() - startDayOfWeek);

  const paddedEndDate = new Date(monthEnd);
  const endDayOfWeek = monthEnd.getDay();
  paddedEndDate.setDate(monthEnd.getDate() + (6 - endDayOfWeek));

  const days = eachDayOfInterval({
    start: paddedStartDate,
    end: paddedEndDate,
  });

  const nextMonth = () => onDateChange(addMonths(currentDate, 1));
  const prevMonth = () => onDateChange(subMonths(currentDate, 1));

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-zinc-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const hasWorkout = workoutDates.some((d) => isSameDay(d, day));
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={`
                relative flex flex-col items-center justify-center h-10 w-full rounded-full text-sm font-medium transition-all
                ${!isCurrentMonth ? "text-zinc-700" : ""}
                ${isSelected ? "bg-primary-500 text-white" : "hover:bg-zinc-800 text-zinc-300"}
                ${isToday && !isSelected ? "text-primary-400" : ""}
              `}
            >
              <span>{format(day, "d")}</span>
              {hasWorkout && (
                <div
                  className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-primary-500"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
