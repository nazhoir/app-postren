"use client";

import React, { useState, useEffect } from "react";

import { formatDistanceStrict } from "date-fns";
import { id as IDN } from "date-fns/locale";

type RealtimeDistanceProps = React.HTMLAttributes<HTMLDivElement> & {
  date: Date;
};

export const RealtimeDistance: React.FC<RealtimeDistanceProps> = ({
  date,
  ...props
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000 milliseconds = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span {...props}>
      {formatDistanceStrict(currentTime, date, {
        locale: IDN,
      })}{" "}
      lalu
    </span>
  );
};
