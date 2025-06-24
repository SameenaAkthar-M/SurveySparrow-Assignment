import React, { createContext, useState } from "react";

export const SelectedDateContext = createContext();

export const SelectedDateProvider = ({ children }) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
};
