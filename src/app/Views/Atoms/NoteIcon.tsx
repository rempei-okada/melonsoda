import { MenuBook, NoteOutlined } from "@material-ui/icons";
import { Note } from "app/Models/Notes/Note";
import React from "react";

export function NoteIcon(props: { note: Note, size?: "small" | "large" }) {
    switch (props.note.type) {
        case "note": return <MenuBook fontSize={props.size} />
        default: return <NoteOutlined fontSize={props.size} />
    }
}