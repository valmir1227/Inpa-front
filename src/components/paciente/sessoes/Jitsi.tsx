import dynamic from "next/dynamic";
import { FC } from "react";
import { IJitsiMeetingProps } from "@jitsi/react-sdk/lib/types";

export const JitsiMeeting = dynamic(
  () =>
    import("@jitsi/react-sdk").then(({ JitsiMeeting }) => JitsiMeeting) as any,
  {
    ssr: false,
  }
) as FC<IJitsiMeetingProps>;
