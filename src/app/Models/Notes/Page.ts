import { DateTime } from "luxon";
import { Field } from "./Field";

export class Page {
    public readonly pageId: string = "";
    public readonly title: string = "";
    public readonly color: string = "#a9e0bf";
    public readonly fields: Field[] = [];
    public readonly createdAt: DateTime = DateTime.local();
    public readonly updatedAt: DateTime = DateTime.local();

    constructor(params: Partial<Page>) {
        Object.assign(this, params);
    }
} 