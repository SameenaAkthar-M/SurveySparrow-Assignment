import React, { useContext } from "react";
import { SelectedDateContext } from "../../context/SelectedDateContext.jsx";
import { startOfWeek, addDays, format, isToday, parseISO } from "date-fns";
import events from "../../data/events.json";
import "./weeklyCalendar.css";

const WeeklyCalendar = () => {
  const { selectedDate, setSelectedDate } = useContext(SelectedDateContext);
  const selected = new Date(selectedDate);
  const start = startOfWeek(selected, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="weekly-calendar">
      <div className="week-grid">
        {days.map((date, idx) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const today = isToday(date) ? "today" : "";
          const isSelected = selectedDate === dateStr ? "selected" : "";

          const dayEvents = events
            .filter((event) => event.date === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time));

          return (
            <div
              key={idx}
              className={`week-day ${today} ${isSelected}`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <div className="day-header">
                <div className="day-name">{format(date, "EEE")}</div>
                <div className="day-number">{format(date, "d")}</div>
              </div>

              <div className="day-events">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`day-event priority-${event.priority}`}
                    >
                      <span className="event-time">
                        {format(
                          parseISO(`${event.date}T${event.time}`),
                          "hh:mm a"
                        )}
                      </span>
                      <span className="event-title">{event.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-events">No events</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
