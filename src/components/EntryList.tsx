import React from "react";
import { useAtomValue } from "jotai";
import { projectDictAtom, todayTimeEntriesAtom } from "src/atoms";
import { EntriesTimeline } from "./EntriesTimeline";
import { isActiveEntry } from "src/utils";
import { css } from "@emotion/css";

export const EntryList = () => {
  const todayEntries = useAtomValue(todayTimeEntriesAtom);
  const entries = todayEntries.filter((entry) => !isActiveEntry(entry));
  const projectDict = useAtomValue(projectDictAtom);
  console.log({ entries });
  return (
    <div
      className={css`
        max-height: 30vh;
        overflow-y: auto;
      `}
    >
      <EntriesTimeline entries={entries} projectDict={projectDict} />
    </div>
  );
};
