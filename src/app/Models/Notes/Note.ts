import { Page } from "./Page";

export class Note {
    public readonly noteId: string = "";
    public readonly name: string = "";
    public readonly pages: Page[] = [];
    public readonly type: "note" | "sticker" = "note";

    constructor(params: Partial<Note>) {
        Object.assign(this, params);
    }
}