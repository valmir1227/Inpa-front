import React, { useEffect } from "react";

import { ZoomMtg } from "@zoom/meetingsdk";
// import ZoomMtgEmbedded from "@zoomus/websdk/embedded";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

import { Button, Flex } from "@chakra-ui/react";
import { z } from "zod";

export function Zoom({ dataOvToken, health }: any) {
  const client = ZoomMtgEmbedded.createClient();

  // var authEndpoint = "";
  // var signature =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiJzdjZ4WUlZUURGWmZxWEtxUktNUSIsInNka0tleSI6InN2NnhZSVlRREZaZnFYS3FSS01RIiwibW4iOiI4NjkxNDM4MDU4MyIsInJvbGUiOjAsImlhdCI6MTcxNTI2MjIwNywiZXhwIjoxNzE1MjY3NjA3LCJ0b2tlbkV4cCI6MTcxNTI2NzYwNywidXNlck5hbWUiOiJDb3JjaW5pbyBkZSBBbGNhbnRhcmEgQXpldmVkbyIsInVzZXJFbWFpbCI6ImFsY2FudGFyYS4xOTg3QGdtYWlsLmNvbSJ9.IhpJtBcTkrr6JDg7tvcYaNEMQNmYFV8c6iGJavULa6w";
  // var sdkKey = "sv6xYIYQDFZfqXKqRKMQ";
  const validate = z.object({
    join: z.object({
      meetingNumber: z.string(),
      userName: z.string(),
      userEmail: z.string(),
      password: z.string().optional(),
      sdkKey: z.string(),
      signature: z.string(),
    }),
  });
  const validation = validate.safeParse(dataOvToken);
  console.log(validation);

  useEffect(() => {
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load("pt-PT");
    ZoomMtg.i18n.reload("pt-PT");
    if (validation.success && health?.others?.tele?.toLowerCase() === "zoom") {
      startMeetingClient();
    }
  }, [dataOvToken, health]);

  function startMeeting() {
    let meetingSDKElement = document.getElementById("meetingSDKElement");
    console.log({ signature, sdkKey, meetingNumber, userName, userEmail });

    client
      .init({
        zoomAppRoot: meetingSDKElement || undefined,
        language: "pt-PT",
        patchJsMedia: true,
        customize: {
          video: {
            isResizable: true,
            /* viewSizes: {
              default: {
                width: 1000,
                height: 600,
              },
              ribbon: {
                width: 300,
                height: 700,
              },
            }, */
          },
        },
      })
      .then(() => {
        client
          .join({
            meetingNumber,
            userName,
            userEmail,
            password,
            sdkKey,
            signature,

            // userEmail,
            // password: passWord,
            // tk: registrantToken,
            // zak: zakToken,
          })
          .then(() => {
            console.log("joined successfully");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const meetingSDKElement = React.useRef<HTMLDivElement>(null);

  if (!validation.success) {
    console.error("Invalid fields:", validation, dataOvToken);
    return <span>Erro de validação</span>;
  }

  var meetingNumber = dataOvToken.join.meetingNumber;
  var userName = dataOvToken.join.userName;
  var userEmail = dataOvToken.join.userEmail;
  var password = dataOvToken.join.password;
  var sdkKey = dataOvToken.join.sdkKey;
  var signature = dataOvToken.join.signature;

  // var passWord = "";
  // var role = 0;
  // var userName = "Colaborador3";
  // var userEmail = "colaborador3@gmail.com";
  // var registrantToken = "";
  // var zakToken = "";

  function startMeetingClient() {
    const element = document.getElementById("meetingSDKElement");

    if (!element) return;
    element.style.display = "block";

    ZoomMtg.init({
      disablePreview: true,
      enableHD: true,
      enableFullHD: true,
      videoDrag: true,
      leaveUrl: window.location.href,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success: any) => {
        console.log(success);

        ZoomMtg.join({
          meetingNumber,
          userName,
          userEmail,
          passWord: password,
          sdkKey,
          signature,
          success: (success: any) => {
            console.log(success);
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  if (health?.others?.tele?.toLowerCase() !== "zoom") {
    console.warn("Plataforma Zoom não detectada (health.others.tele)", health);
    return null;
  }

  return (
    <Flex className="App" gap={4}>
      <div id="meetingSDKElement" ref={meetingSDKElement}></div>
      <Button onClick={startMeeting}>Component Zoom</Button>
      <Button onClick={startMeetingClient}>Client Zoom</Button>
    </Flex>
  );
}
