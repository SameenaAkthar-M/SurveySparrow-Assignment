import React, { useState, useEffect, useContext } from "react";
import "./calendarGrid.css";
import prevArrow from "../../assets/prev-arrow.svg";
import nextArrow from "../../assets/next-arrow.svg";
import { SelectedDateContext } from "../../context/SelectedDateContext.jsx";
import WeeklyCalendar from "../weeklyCalendar/WeeklyCalendar.jsx";
import events from "../../data/events.json";
import {
  startOfMonth,
  addDays,
  subMonths,
  addMonths,
  isToday,
  format,
  startOfWeek,
} from "date-fns";

const CalendarGrid = () => {
  const { selectedDate, setSelectedDate } = useContext(SelectedDateContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [showYearPicker, setShowYearPicker] = useState(false);

  const handlePrev = () => {
  const newDate = subMonths(currentDate, 1);
  setCurrentDate(newDate);
  const firstOfMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  setSelectedDate(format(firstOfMonth, "yyyy-MM-dd")); // show week from date 1
};

const handleNext = () => {
  const newDate = addMonths(currentDate, 1);
  setCurrentDate(newDate);
  const firstOfMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  setSelectedDate(format(firstOfMonth, "yyyy-MM-dd")); // show week from date 1
};

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const generateYears = () => {
    const currentYear = currentDate.getFullYear();
    const startYear = currentYear - 6;
    return Array.from({ length: 100 }, (_, i) => startYear + i);
  };

  const calendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const days = [];
    for (let i = 0; i < 42; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  const days = calendarDays();

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="nav-buttons">
          <button onClick={handlePrev} className="prev-btn">
            <img src={prevArrow} alt="Previous" />
          </button>
          <h2
            onClick={() => setShowYearPicker(!showYearPicker)}
            style={{ cursor: "pointer" }}
          >
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button onClick={handleNext} className="next-btn">
            <img src={nextArrow} alt="Next" />
          </button>
        </div>
        <div className="view-tabs">
          <button
            className={viewMode === "month" ? "active-tab" : ""}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
          <button
            className={viewMode === "week" ? "active-tab" : ""}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
        </div>
      </div>

      {showYearPicker && (
        <div className="year-picker">
          {generateYears().map((year) => (
            <div
              key={year}
              className={`year-option ${
                year === currentDate.getFullYear() ? "active-year" : ""
              }`}
              onClick={() => {
                const newDate = new Date(
                  year,
                  currentDate.getMonth(),
                  currentDate.getDate()
                );
                setCurrentDate(newDate);
                setSelectedDate(format(newDate, "yyyy-MM-dd")); // ✅ Fix here
                setShowYearPicker(false);
              }}
            >
              {year}
            </div>
          ))}
        </div>
      )}

      <div className="calendar-view-container">
        {viewMode === "month" && (
          <div className="calendar-view fade-in">
            <div className="calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                <div key={i} className="weekday">
                  {d}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map((date, index) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const isCurrentMonth =
                  date.getMonth() === currentDate.getMonth();
                const faded = !isCurrentMonth ? "faded" : "";
                const today = isToday(date) ? "today" : "";
                const isSelected = selectedDate === dateStr ? "selected" : "";

                return (
                  <div
                    key={index}
                    className={`calendar-day ${faded} ${today} ${isSelected}`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <span>
                      {!isCurrentMonth && format(date, "d") === "1"
                        ? format(date, "MMM d")
                        : format(date, "d")}
                    </span>

                    {events
                      .filter(
                        (event) =>
                          event.date === dateStr &&
                          new Date(event.date).getMonth() ===
                            currentDate.getMonth()
                      )
                      .map((event) => (
                        <div
                          key={event.id}
                          className={`event-tag ${
                            event.priority || "default"
                          }`}
                          title={`${event.time} - ${event.duration}`}
                        >
                          {event.title}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="calendar-view fade-in">
            <WeeklyCalendar />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarGrid;
