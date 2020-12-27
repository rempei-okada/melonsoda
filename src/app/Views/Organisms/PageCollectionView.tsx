import React, { memo, useState } from "react";
import { Note } from "../../Models/Notes/Note";
import { List, Box, ListItem, ListItemText, ListSubheader, Divider, Typography, ListItemSecondaryAction, IconButton, ListItemIcon, Fade, Menu } from "@material-ui/core";
import { Page } from "../../Models/Notes/Page";
import { useTranslation } from "react-i18next";
import { Delete, MoreVert } from "@material-ui/icons";

interface NoteCollectionViewProps {
    items: Page[];
    selectedIndex: number;
    itemPressed: (e: [Page, number]) => void;
    removePressed: (p: Page) => void;
}

export const PageCollectionView = (props: NoteCollectionViewProps) => {
    const { items } = props;
    const [t] = useTranslation();
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [page, setPage] = useState<Page | null>(null);

    return (
        <Box display="flex" flexDirection="column">
            <List>
                {
                    items.map((item, i) => <PageItem
                        isSelected={props.selectedIndex === i}
                        length={items.length}
                        menuInvoked={e => {
                            setPage(item);
                            setMenuAnchor(e.currentTarget)
                        }}
                        key={item.pageId}
                        itemPressed={e => props.itemPressed([e, i])}
                        page={item}
                    />)
                }
            </List>
            <Menu anchorEl={menuAnchor} open={!!menuAnchor} keepMounted onClose={() => setMenuAnchor(null)}
                TransitionComponent={Fade}>
                <List>
                    <ListItem button onClick={e => {
                        setMenuAnchor(null);
                        page && props.removePressed(page);
                    }}>
                        <ListItemIcon>
                            <Delete />
                        </ListItemIcon>
                        <ListItemText primary={<Typography noWrap>{t("Delete")}</Typography> } />
                    </ListItem>
                </List>
            </Menu>
        </Box>
    );
};

interface PageItemProps {
    page: Page;
    isSelected: boolean;
    length: number;
    itemPressed: (e: Page) => void;
    menuInvoked: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const PageItem = memo(
    (props: PageItemProps) => {
        const item = props.page;
        const [t] = useTranslation();

        return <>
            <Box display="flex" position="relative">
                <div
                    style={{
                        background: item.color,
                        minHeight: "100%",
                        minWidth: "6px"
                    }}
                ></div>
                <div
                    style={{
                        opacity: 0.26,
                        position: "absolute",
                        background: item.color,
                        minHeight: "100%",
                        width: props.isSelected ? "100%" : "0%"
                    }}
                ></div>
                <ListItem
                    ContainerProps={{ style: { width: "100%" } }}
                    button
                    onClick={_ => props.itemPressed(item)}
                >
                    <ListItemText
                        primary={<Typography style={{ fontSize: "14px" }} noWrap>
                            {item.title || t("NoTitle")}
                        </Typography>}
                        secondary={<>
                            <Typography style={{ fontSize: "10px" }} noWrap>
                                {t("DateTime")} : {item.createdAt.toFormat("y/M/d")}
                            </Typography>
                        </>}
                    />
                    <ListItemSecondaryAction>
                        <IconButton size="small" onClick={e => props.menuInvoked(e)} ><MoreVert /></IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </Box>
            <Divider />
        </>;
    },
    (prev, next) => {
        return prev.page.color === next.page.color &&
            prev.page.title === next.page.title &&
            prev.page.updatedAt.equals(next.page.updatedAt) &&
            prev.page.createdAt.equals(next.page.createdAt) &&
            prev.length === next.length &&
            prev.isSelected === next.isSelected;
    }
);

