import React from "react";

import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
export function Prontuario({ notes, setNotes }) {
  return (
    <Editor
      editorState={notes}
      onEditorStateChange={setNotes}
      // toolbarOnFocus
      localization={{
        locale: "pt",
      }}
      toolbar={{
        options: ["inline", "list", "textAlign", "remove", "history"],
      }}
    />
  );
}
