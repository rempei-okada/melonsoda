import { Note } from '../Models/Notes/Note'
import { Page } from '../Models/Notes/Page';
import { v4 } from "uuid";
import { Field } from '../Models/Notes/Field';
import { LocalNotesReposity } from '../Repositories/NotesRepository';
import { Subject, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export class SelectedNoteStore {
    private readonly repository = new LocalNotesReposity();
    private readonly saveHandler = new Subject<Note>();
    private _note: Note | null = null;
    private _selectedPageIndex = 0;

    public get note(): Note | null {
        return this._note;
    }

    public get pages() {
        return this._note?.pages ?? [];
    }

    public get selectedPage(): Page | null {
        return this._note?.pages[this._selectedPageIndex] ?? null;
    }

    public get selectedPageIndex(): number {
        return this._selectedPageIndex;
    }

    constructor() {
        this.saveHandler
            .pipe(
                switchMap(
                    x => timer(1000).pipe(map((v) => x))
                )
            ).subscribe(e => this.handleSaveHandler(e));
    }

    public async loadNoteAsync(noteId: string): Promise<void> {
        this._note = await this.repository.fetchAsync(noteId);
        this.selectPage(0);
    }

    public mutatePage(page: Page) {
        const note = this.note;
        if (!note) {
            throw new Error("Note is not selected");
        }
        note.pages[this._selectedPageIndex] = page;
        this._note = new Note({
            ...note,
            pages: [
                ...note.pages,
            ]
        });
        this.saveAsync();
    }

    public async removePageAsync(pageId: string) {
        const note = this.note;
        if (!note) {
            throw new Error("Note is not selected");
        }

        const selectedPage = this.selectedPage;

        this._note = new Note({
            ...note,
            pages: [
                ...note.pages.filter(f => f.pageId !== pageId),
            ]
        });

        const selected = this.pages.indexOf(selectedPage ?? new Page({}));
        if (selected !== -1) {
            this.selectPage(selected);
        }
        else {
            this.selectPage(this.selectedPageIndex);
        }

        this.saveAsync();
    }

    public mutateField(field: Field) {
        const note = this.note;
        if (!note) {
            throw new Error("Note is not selected");
        }

        const page = this.selectedPage;
        if (!page) {
            return;
        }

        const fields = [...page.fields];
        const index = fields.indexOf(fields.find(x => x.fieldId === field.fieldId)!);

        fields[index] = field;
        note.pages[this._selectedPageIndex] = new Page({ ...page, fields });;
        this._note = new Note({
            ...note,
            pages: [
                ...note.pages,
            ]
        });
        this.saveAsync();
    }

    public selectPage(index: number) {
        this._selectedPageIndex = Math.max(0, Math.min(index, this.pages.length - 1));
    }

    public async createNewPage(title: string, body: string) {
        if (!this.note) {
            throw new Error("note is note selected");
        }

        const newPage = new Page({
            title,
            pageId: v4(),
            fields: [
                new Field({
                    fieldId: v4(),
                    type: "text",
                    value: body
                })
            ]
        });
        this._note = new Note({
            ...this.note,
            pages: [
                ...this.note.pages,
                newPage
            ]
        });
        this._selectedPageIndex = this.pages?.length - 1 ?? 0
        this.saveAsync();
    }

    public saveAsync() {
        if (this.note) {
            this.saveHandler.next(this.note);
        }
    }

    public async handleSaveHandler(note: Note) {
        await this.repository.saveAsync(note);
    }
}