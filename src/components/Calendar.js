import moment from "moment";
import PropTypes from "prop-types";
import React from "react";


/**
 * Rendering events on a calendar(on day of the calendar), avoiding overlapping events to visually overlap.
 * @param {Object} events : event with start an end date
 * @param {Number} startingHour : the starting hour of the day
 * @param {Number} endingHour : the ending hour of the day
 * @returns {JSX.Element}
 */
function Calendar({ events, startingHour, endingHour }) {
  const HOUR_HEIGHT = window.innerHeight / (endingHour - startingHour);

  /**
   * Converts the start time of an event to minutes since startingHour and calculates
   * the end time of the event based on its duration.
   *
   * @param {object} event - The event object, which should have the following properties:
   *   - start (string): The start time of the event in "HH:MM" format.
   *   - duration (number): The duration of the event in minutes.
   * @returns {object} An object containing the start and end times of the event in minutes
   *   since startingHour. The object should have the following properties:
   *   - start (number): The start time of the event in minutes since startingHour.
   *   - end (number): The end time of the event in minutes since startingHour.
   */
  const convertStartTimeToMinutes = (event) => {
    const [startHour, startMinute] = event.start.split(":").map(Number);

    const start = (startHour - startingHour) * 60 + startMinute;
    const end = start + event.duration;
    return { start, end };
  };

  /**
   * Counts the number of events that occur during a given time range, which is defined
   * by the start and end times of the most intense time period.
   *
   * @param {array} mostIntenseTime - An array containing the start and end times of the most intense time period.
   *   The array should have the following structure: [start, end], where both start and end are numbers
   * @param {array} eventsTimeLine - An array of event objects, each of which should have the following properties:
   *   - start (number): The start time of the event in minutes.
   *   - end (number): The end time of the event in minutes.
   * @returns {number} The number of events that occur during the most intense time period.
   */
  const countEventsDuringMostIntenseTime = (
    mostIntenseTime,
    eventsTimeLine
  ) => {
    let iterator = 0;
    for (let i = 0; i < eventsTimeLine.length; i++) {
      if (
        mostIntenseTime[0] >= eventsTimeLine[i].start &&
        mostIntenseTime[1] <= eventsTimeLine[i].end
      )
        iterator++;
    }
    return iterator;
  };

  /**
   * Finds the time period with the most overlapping events from an array of event objects.
   *
   * @param {array} eventsTimeLine - An array of event objects, each of which should have the following properties:
   *   - start (number): The start time of the event in minutes.
   *   - end (number): The end time of the event in minutes.
   * @returns {array|null} An array containing the start and end times of the most intense time period,
   *   or null if no such time period exists. The array should have the following structure: [start, end],
   *   where both start and end are numbers representing the minutes.
   */
  function findMostIntenseTime(eventsTimeLine) {
    // Create a eventTimeline
    let eventTimeline = [];
    for (let event of eventsTimeLine) {
      eventTimeline.push([event.start, 1]);
      eventTimeline.push([event.end, -1]);
    }

    // Sort the events by their start times
    eventTimeline.sort((a, b) => a[0] - b[0]);

    // Iterate through the events and create a list of overlapping events at each point in time
    let overlappingEventsTimeline = [];
    let currentOverlapCount = 0;
    for (let [time, change] of eventTimeline) {
      currentOverlapCount += change;
      overlappingEventsTimeline.push([time, currentOverlapCount]);
    }

    // Find the time period with the most overlapping events
    let maxOverlap = 0;
    let mostIntenseTime = null;
    for (let i = 0; i < overlappingEventsTimeline.length - 1; i++) {
      let startTime = overlappingEventsTimeline[i][0];
      let endTime = overlappingEventsTimeline[i + 1][0];
      let overlap = overlappingEventsTimeline[i][1];

      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        mostIntenseTime = [startTime, endTime];
      }
    }

    return mostIntenseTime;
  }

  /**
   * Finds the most intense overlapping events given an array of overlapping events.
   * Intensity is determined by the number of events that overlap with each other at any given time.
   * @param {Array} overlappedevents - An array of overlapping events
   * @returns {Array} - An array of the most intense overlapping events
   */
  const MostIntenseOverlappingEvents = (overlappedevents) => {
    let MostIntenseOverlappingEventsArray = [];
    for (let index = 0; index < overlappedevents.length; index++) {
      const [startHour, startMinute] = overlappedevents[index].start
        .split(":")
        .map(Number);
      const start = (startHour - startingHour) * 60 + startMinute;
      const eventsoverlapped = events.filter((e) => {
        const { start: eStart, end: eEnd } = convertStartTimeToMinutes(e);
        return (
          (eStart <= start && eEnd > start) ||
          (eStart >= start && eStart < start + overlappedevents[index].duration)
        );
      });
      if (MostIntenseOverlappingEventsArray.length < eventsoverlapped.length)
        MostIntenseOverlappingEventsArray = eventsoverlapped;
    }
    return MostIntenseOverlappingEventsArray;
  };
  /**
   * calculates the number of events that overlap during the most intense time period among the given list of events.
   * @param {Array} overlappingEvents : An array of objects representing events that overlap.
   * @returns {Number} The number of events that overlap during the most intense time period.
   */

  const calculateMostIntenseOverlapStats = (overlappingEvents) => {
    // It finds the most intense overlapping events by calling MostIntenseOverlappingEvents function.
    const mostIntenseOverlappingEvents =
      MostIntenseOverlappingEvents(overlappingEvents);
    const eventIntervalFormat = [];
    for (let index = 0; index < mostIntenseOverlappingEvents.length; index++) {
      const { start, end } = convertStartTimeToMinutes(
        mostIntenseOverlappingEvents[index]
      );
      eventIntervalFormat.push({ start, end });
    }

    // finds the most intense time period by calling findMostIntenseTime function on eventIntervalFormat
    const mostIntenseTime = findMostIntenseTime(eventIntervalFormat);
    const numberEventsDuringMostIntenseTime = countEventsDuringMostIntenseTime(
      mostIntenseTime,
      eventIntervalFormat
    );

    // returns the number of events that overlap during the most intense time period
    return numberEventsDuringMostIntenseTime;
  };

  /**
   * alculates the style for a given event based on its start time, duration, and overlapping events. It returns an object containing CSS style properties for the event.
   * @param {Object} event : the event containing properties such as start time and duration.
   * @param {Array} events : list of the events
   * @returns
   */
  function getEventStyle(event, events) {
    const { start } = convertStartTimeToMinutes(event);
    // Calculate the top position of the event based on its start time and the height of each hour (HOUR_HEIGHT).
    const top = (start / 60) * HOUR_HEIGHT;

    // Calculate the height of the event based on its duration and the height of each hour (HOUR_HEIGHT).
    const height = (event.duration / 60) * HOUR_HEIGHT;

    // Filter the events array to get all events that overlap with the current event.
    // Sort the overlapping events by duration in descending order.
    const overlappingEvents = events
      .filter((e) => {
        const { start: eStart, end: eEnd } = convertStartTimeToMinutes(e);

        return (
          (eStart <= start && eEnd > start) ||
          (eStart >= start && eStart < start + event.duration)
        );
      })
      .sort((a, b) => {
        return b.duration - a.duration;
      });

    // Calculate the number of events that overlap during the most intense overlapping time using the calculateMostIntenseOverlapStats function.
    const numberEventsDuringMostIntenseTime =
      calculateMostIntenseOverlapStats(overlappingEvents);

    // Calculate the width of the event based on the number of events that overlap during the most intense overlapping time.
    const width = `${100 / numberEventsDuringMostIntenseTime}%`;

    // Calculate the left position of the event based on its position in the sorted overlapping events array 
    // and the number of events that overlap during the most intense overlapping time.
    const left = `${
      overlappingEvents.findIndex((e) => e.id === event.id) *
      (100 / numberEventsDuringMostIntenseTime)
    }%`;

    // Return an object containing CSS style properties for the event, 
    // including its top, height, background color, border, position, width, left, box sizing, and padding.
    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: "#a9a9dd",
      border: "1px solid black",
      position: "absolute",
      width: width,
      left: left,
      boxSizing: "border-box",
      padding: "2px",
    };
  }

  return (
    <div
      className="Calendar"
      style={{ position: "relative", height: "100vh", width: "100vw" }}
    >
      {events.map((event) => (
        <div key={event.id} style={getEventStyle(event, events)}>
          {`id: ${event.id} start: ${event.start} end: ${moment(
            event.start,
            "HH:mm"
          )
            .add(event.duration, "minutes")
            .format("HH:mm")}`}
        </div>
      ))}
    </div>
  );
}

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      start: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })
  ),
  startingHour: PropTypes.number.isRequired,
  endingHour: PropTypes.number.isRequired,
};

export default Calendar;
