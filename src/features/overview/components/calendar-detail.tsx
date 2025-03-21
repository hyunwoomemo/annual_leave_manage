import moment from "moment";
import React, { useCallback, useMemo } from "react";

const CalendarDetail = ({ event }) => {
  if (!event) return;
  console.log(event);

  const renderRange = useMemo(() => {
    if (!event._instance || !event._instance.range) return;

    const range = event._instance.range;

    const start = moment(range.start);
    const end = moment(range.end).subtract(1, "day");

    if (moment(start).isSame(end)) {
      return start.format("YYYY-MM-DD");
    } else {
      return `${start.format("YYYY-MM-DD")} ~ ${end.format("YYYY-MM-DD")}`;
    }
  }, [event._instance]);

  return (
    <div className="flex flex-col gap-2 mt-5 border-gray-100 border-1 p-4">
      <div>{event._def?.title}</div>
      <div>{renderRange}</div>
    </div>
  );
};

export default CalendarDetail;
