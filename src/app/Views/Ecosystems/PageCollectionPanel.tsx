import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Page } from "../../Models/Notes/Page";
import { PageCollectionView } from "../Organisms/PageCollectionView";
import { Box, Divider, IconButton, Typography, useTheme } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { store } from "../../Stores";
import { observer } from "mobx-react";
import { confirmAsync } from "../../Commons/confirmAsync";

interface PageCollectionPanelProps {
    pageChanged?: () => void;
}

export const PageCollectionPanel = observer((props: PageCollectionPanelProps) => {
    const [t] = useTranslation();
    const theme = useTheme();

    function handleAddPressed() {
        store.selectedNotesStore.createNewPage(t("NewPage"), "");
    }

    async function handlePageRemoved(page: Page) {
        if (await confirmAsync(t("ConfirmDeleteItem").replace("{item}", page.title))) {
            store.selectedNotesStore.removePageAsync(page.pageId);
        }
    }

    return (
        <Box height="100%" style={{ overflowY: "scroll", overflowX: "hidden" }} px={1} >
            <Box position="sticky" zIndex={1} top="0" style={{ background: theme.palette.background.paper }}>
                <CommandBar addPressed={() => handleAddPressed()} />
            </Box>
            <PageCollectionView
                removePressed={handlePageRemoved}
                items={store.selectedNotesStore.pages ?? []}
                itemPressed={e => {
                    store.selectedNotesStore.selectPage(e[1]);
                    props.pageChanged && props.pageChanged();
                }}
                selectedIndex={store.selectedNotesStore.selectedPageIndex}
            />
            <Box mt={1} />
        </Box>
    );
});

interface CommandBarProps {
    addPressed: () => void;
}

function CommandBar(props: CommandBarProps) {
    const [t] = useTranslation();

    return (
        <Box p={1}>
            <Box display="flex" alignItems="center">
                <Typography variant="overline" color="textSecondary">
                    {
                        t("Page")
                    }
                </Typography>
                <Box flex="1 1 auto" />
                <IconButton size="small" onClick={() => props.addPressed()} >
                    <Add />
                </IconButton>
            </Box>
            <Divider />
        </Box>
    );
}