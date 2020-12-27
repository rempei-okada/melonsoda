export type FieldSchemeType = "text" | "photo-gallery";

export class Field {
    public readonly fieldId: string = "";
    public readonly type: FieldSchemeType = "text";
    public readonly value: string = "";
    public readonly meta: string = "";

    constructor(params: Partial<Field>) {
        Object.assign(this, params);
    }
}