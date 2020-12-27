import { Note } from "../Models/Notes/Note";
import { v4 } from "uuid";
import { Page } from "../Models/Notes/Page";
import { database } from "./database";
import { NoteScheme } from "./schemes";
import { DateTime } from "luxon";
import { Field } from "../Models/Notes/Field";

export class LocalNotesReposity {
    private database = database;

    public async fetchAllAsync(): Promise<Note[]> {
        const notes = await this.database.loadAll<NoteScheme>("notes");
        return notes.map(note => new Note({
            name: note.name,
            noteId: note.noteId,
            type: note.type,
            pages: []
        }));
    }

    public async removeAsync(noteId: string): Promise<void> {
        await this.database.remove("notes", noteId);
    }

    public async fetchAsync(noteId: string): Promise<Note | null> {
        const note = await this.database.load<NoteScheme>("notes", noteId);
        if (!note) {
            return null;
        }

        return new Note({
            name: note.name,
            noteId: note.noteId,
            type: note.type,
            pages: note.pages.map(page => new Page({
                title: page.title,
                pageId: page.pageId,
                createdAt: DateTime.fromISO(page.createdAt),
                updatedAt: DateTime.fromISO(page.updatedAt),
                color: page.color,
                fields: page.fields.map(field => new Field({
                    type: field.type,
                    fieldId: field.fieldId,
                    value: field.value
                }))
            }))
        });
    }

    public async saveAsync(note: Note): Promise<Note> {
        await this.database.save<NoteScheme>("notes", {
            name: note.name,
            noteId: note.noteId,
            type: note.type,
            pages: note.pages.map(page => ({
                title: page.title,
                pageId: page.pageId,
                createdAt: page.createdAt.toISO(),
                updatedAt: page.updatedAt.toISO(),
                color: page.color,
                fields: page.fields.map(field => ({
                    type: field.type,
                    fieldId: field.fieldId,
                    value: field.value,
                }))
            }))
        });
        return note;
    }
}