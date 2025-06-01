import { useEffect, useState } from "react";

export const TimeStamp = ({ timestamp }: { timestamp: Date }) => {
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    setLocalTime(timestamp.toLocaleTimeString());
  }, [timestamp]);

  return (
    <p className="text-xs mt-1 opacity-70">
      {localTime}
    </p>
  );
};
