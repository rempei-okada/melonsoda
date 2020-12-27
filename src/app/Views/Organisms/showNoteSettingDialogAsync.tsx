import { Button, DialogActions, Typography, Box, TextField } from "@material-ui/core";
import { Photo, TextFields } from "@material-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { showDialogAsync, DialogContentProp, DialogContentFrame } from "../../Commons/showDialogAsync";
import { Note } from "../../Models/Notes/Note";


function NoteSettingDialog(props: DialogContentProp<{ note: Note, message: string }, Note | null>) {
    const [t] = useTranslation();
    const [note, setNote] = useState(props.context.note);

    function handleNoteNoteChanged(key: keyof Note, value: any) {
        setNote(new Note({
            ...note,
            [key]: value
        }));
    }

    return (
        <DialogContentFrame actions={<>
            <Button onClick={_ => props.onClose(null)} >CANCEL</Button>
            <Button color="primary" onClick={_ => props.onClose(note)}>OK</Button>
        </>}
            description=""
            message={t("CreateNewNote")}
        >
            <Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={note.name}
                    onChange={e => handleNoteNoteChanged("name", e.target.value)}
                    label={t("Name")} />
            </Box>
        </DialogContentFrame>
    );
}

export async function showNoteSettingDialogAsync(message: string, note: Note) {
    return await showDialogAsync(NoteSettingDialog, { message, note }, { maxWidth: "md", autoFullScreenBreakPoint: "sm" });
}