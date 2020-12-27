export interface NoteScheme {
    readonly noteId: string;
    readonly name: string;
    readonly type: "note" | "sticker";
    readonly pages: PageScheme[];
}

export interface FieldScheme {
    readonly fieldId: string;
    readonly type: "text"|"photo-gallery";
    readonly value: string;
}

export interface PageScheme {
    readonly pageId: string;
    readonly title: string
    readonly color: string;
    readonly fields: FieldScheme[];
    readonly createdAt: string;
    readonly updatedAt: string;
}