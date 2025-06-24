import React, { useContext, useState, useEffect } from "react";
import events from "../../data/events.json";
import { format, parseISO, addDays } from "date-fns";
import { SelectedDateContext } from "../../context/SelectedDateContext.jsx";
import "./eventpanel.css";

const EventPanel = () => {
  const { selectedDate } = useContext(SelectedDateContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedEvents, setCompletedEvents] = useState({});
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFade(true);
  }, [selectedDate]);

  const toggleComplete = (id) => {
    setCompletedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const nextDate = format(addDays(parseISO(selectedDate), 1), "yyyy-MM-dd");

  const eventsToday = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const eventsTomorrow = events
    .filter((event) => event.date === nextDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const renderEvents = (title, eventsList) => (
    <>
      {title && <p className="heading">{title}</p>}
      {eventsList.length > 0 ? (
        eventsList.map((event) => (
          <div key={event.id} className="time-slot">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                className="event-checkbox"
                checked={!!completedEvents[event.id]}
                onChange={() => toggleComplete(event.id)}
              />
              <span className="custom-checkbox" />
            </label>
            <div
              className={`time-label ${
                completedEvents[event.id] ? "completed" : ""
              }`}
            >
              {format(parseISO(`${event.date}T${event.time}`), "hh:mm a")}
            </div>

            <div className="slot-events">
              <div
                className={`slot-event priority-${event.priority} ${
                  completedEvents[event.id] ? "completed" : ""
                }`}
              >
                <div className="initials-circle">
                  {event.title?.split(" ")[0][0] || "U"}
                </div>
                <div className="event-info">
                  <p className="event-title">
                    {event.title}{" "}
                    <span className="duration-text">({event.duration})</span>
                  </p>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-event">
          <p>No events scheduled for this date.</p>
        </div>
      )}
    </>
  );

  return (
    <div className="event-panel timeline-view">
      <div className="date-box">
        <div className="date">{format(currentTime, "EEEE, dd MMM yyyy")}</div>
        <div className="time">{format(currentTime, "hh:mm:ss a")}</div>
      </div>

      <div className="event-content">
        <div key={selectedDate} className="fade-wrapper fade-in timeline-grid">
          {renderEvents("Today’s Schedule", eventsToday)}

          <p className="next-date">
            {format(parseISO(nextDate), "EEEE, dd MMM yyyy")}
          </p>
          {renderEvents(null, eventsTomorrow)}
        </div>
      </div>
    </div>
  );
};

export default EventPanel;
