import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Note } from '../Models/Notes/Note'
import { Page } from '../Models/Notes/Page';
import { v4 } from "uuid";
import { makeAutoObservable } from "mobx";
import { LocalNotesReposity } from '../Repositories/NotesRepository';
import { Subject } from 'rxjs';
import { SelectedNoteStore } from './SelectedNoteStore';
import { Field } from '../Models/Notes/Field';
import { store } from '.';

export class NotesStore {
    private repository = new LocalNotesReposity();
    private _notes: Note[] = [];
    private _selectedIndex = 0;

    public get notes(): Note[] {
        return this._notes;

    }

    public get selectedIndex() {
        return this._selectedIndex;
    }

    public get selected(): Note | null {
        return this.notes[this._selectedIndex] ?? null;
    }

    constructor(private readonly selectedNoteStore: SelectedNoteStore) {
    }


    public async loadAsync() {
        this._notes = await this.repository.fetchAllAsync();
    }

    async select(index: number) {
        this._selectedIndex = Math.max(0, Math.min(index, this.notes.length - 1));
        await this.selectedNoteStore.loadNoteAsync(this.selected!.noteId);
    }

    async removeAsync(noteId: string) {
        this._notes = this.notes.filter(x => x.noteId !== noteId);
        await this.repository.removeAsync(noteId);
        await this.select(this.selectedIndex);
    }

    async saveAsync(note: Note) {
        console.log(note);
        await this.repository.saveAsync(note);
        await this.loadAsync();
    }

    async createNew(note:Note) {
        this._notes = [...this.notes, note];
        this.select(this.notes.length - 1);

        await this.repository.saveAsync(note);
        await this.selectedNoteStore.loadNoteAsync(note.noteId);
    }
}