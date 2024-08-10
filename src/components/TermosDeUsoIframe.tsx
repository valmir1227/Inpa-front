export function TermosDeUsoIframe({ patient }: any) {
  if (patient)
    return (
      <iframe src="https://docs.google.com/document/d/e/2PACX-1vR6pXuMVOsFFb41GykmDFW11J65PW8zX1sCaiNT-ntA97XjvUc0BHOaevq1y2e6BxdW7-hPN3gQPeyn/pub?embedded=true"></iframe>
    );
  else
    return (
      <iframe src="https://docs.google.com/document/d/e/2PACX-1vTh9peRhbR7u7XVgqmUyJKbzmPJFZgJhH58KqL0B8zCiP8zJjUie9UwPMQDfAvj2M9EFd6SFP7BfHqR/pub?embedded=true"></iframe>
    );
}
