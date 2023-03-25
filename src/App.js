import React, { useEffect, useState } from "react";
import Calendar from "./components/Calendar";
import eventsData from "./data/events.json";

import "./App.css";

function App() {
  const [events] = useState(eventsData);

  const [startingHour, setStartingHour] = useState(9);
  const [endingHour, setEndingHour] = useState(21);

  useEffect(() => {
    function handleResize() {
      setStartingHour(9);
      setEndingHour(21);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Calendar
        events={events}
        startingHour={startingHour}
        endingHour={endingHour}
      />
    </>
  );
}

export default App;
