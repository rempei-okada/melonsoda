import React, { useEffect, useState } from "react";
import { NoteCollectionView } from "../Organisms/NoteCollectionView";
import { Paper, Typography, Box, IconButton, Icon, Divider } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { store } from "../../Stores";
import { observer } from "mobx-react";
import { Note } from "../../Models/Notes/Note";
import { confirmAsync } from "../../Commons/confirmAsync";
import { entryAsync } from "../../Commons/entryAsync";
import { showNoteSettingDialogAsync } from "../Organisms/showNoteSettingDialogAsync";
import { v4 } from "uuid";
import { Page } from "../../Models/Notes/Page";
import { Field } from "../../Models/Notes/Field";

interface NoteSelectPanelProps {
    notePressed?: () => void;
}

export const NoteSelectPanel = observer((props: NoteSelectPanelProps) => {
    const [t] = useTranslation();

    useEffect(() => {
        store.notesStore.loadAsync().then(() => {
            handleNoteChanged(0);
        });
    }, []);

    function handleNoteChanged(index: number) {
        store.notesStore.select(index);
    }

    function handleNotePressed(index: number) {
        props.notePressed && props.notePressed();
        handleNoteChanged(index);
    }

    async function handleDelete(note: Note) {
        if (await confirmAsync(t("ConfirmDeleteItem").replace("{item}", note.name))) {
            await store.notesStore.removeAsync(note.noteId);
        }
    }

    async function handleChangeName(note: Note) {
        const text = await entryAsync(t("NewName"), note.name);
        if (text !== null) {
            await store.notesStore.saveAsync(new Note({
                ...note,
                name: text
            }));
        }
    }

    async function handleEditNote(note: Note) {
        const edited = await showNoteSettingDialogAsync(
            t("EditNote"),
            note
        );
        if (edited) {
            store.notesStore.saveAsync(edited);
        }
    }

    async function handleAddNote() {
        const note = await showNoteSettingDialogAsync(
            t("CreateNewNote"),
            new Note({
                name: t("NewNote"),
                noteId: v4(),
                pages: [
                    new Page({
                        pageId: v4(),
                        title: t("NewPage"),
                        fields: [
                            new Field({
                                fieldId: v4(),
                                type: "text",
                                value: ""
                            })
                        ]
                    })
                ]
            })
        );
        if (note) {
            store.notesStore.createNew(note);
        }
    }

    return (
        <>
            <Box p={3}>
                <Typography variant="h4" color="textSecondary">
                    Melonsoda
                </Typography>
            </Box>
            <Box px={1}>
                <Box display="flex" alignItems="center">
                    <Typography variant="overline" color="textSecondary">
                        {
                            t("Note")
                        }
                    </Typography>
                    <Box flex="1 1 auto" />
                    <IconButton size="small" onClick={handleAddNote}>
                        <Add />
                    </IconButton>
                </Box>
            </Box>

            <NoteCollectionView
                editPressed={handleEditNote}
                deletePressed={handleDelete}
                changeNamePressed={handleChangeName}
                items={store.notesStore.notes}
                selectedIndex={store.notesStore.selectedIndex}
                itemPressed={e => handleNotePressed(e[1])}
            />

        </>
    );
});
