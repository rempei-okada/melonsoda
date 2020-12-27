import { Page } from "../../Models/Notes/Page";
import { store } from "../../Stores";
import { observer } from "mobx-react";
import { showNotePageFieldSelectionDialog } from "../Organisms/showNotePageFieldSelectionDialog";
import { v4 } from "uuid";
import { Field } from "../../Models/Notes/Field";
import React from "react";
import { PageContentView } from "../Organisms/PageContentView";
import { Box } from "@material-ui/core";

export const PageContentPanel = observer(() => {

    function handlePageChanged(page: Page) {
        store.selectedNotesStore.mutatePage(page);
    }

    async function handleAddField(page: Page) {
        const type = await showNotePageFieldSelectionDialog();
        if (!type) {
            return;
        }

        store.selectedNotesStore.mutatePage(new Page({
            ...page,
            fields: [
                ...page.fields,
                new Field({
                    fieldId: v4(),
                    type,
                    value: ""
                })
            ]
        }));
    }

    return <Box width="100%" height="100%">
        {store.selectedNotesStore.selectedPage && <PageContentView
            fieldChanged={e => store.selectedNotesStore.mutateField(e)}
            pageChanged={handlePageChanged}
            page={store.selectedNotesStore.selectedPage}
            addPressed={() => handleAddField(store.selectedNotesStore.selectedPage!)}
        />}
    </Box>;
});
