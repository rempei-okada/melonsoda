import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { NotesStore } from "./NotesStore";
import { SelectedNoteStore } from "./SelectedNoteStore";
import { makeAutoObservable } from "mobx";


const selectedNotesStore = makeAutoObservable(new SelectedNoteStore());
const notesStore = makeAutoObservable(new NotesStore(selectedNotesStore));

export const store = {
    notesStore,
    selectedNotesStore,
};
