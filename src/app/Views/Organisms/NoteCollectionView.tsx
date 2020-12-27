import React, { useEffect, useRef, useState } from "react";
import { Note } from "../../Models/Notes/Note";
import { Delete, Edit, Label, MenuBook, MoreVert, NoteOutlined } from "@material-ui/icons";
import { List, Box, ListItem, ListItemText, ListSubheader, Divider, Typography, useTheme, ListItemSecondaryAction, Fab, IconButton, Menu, ListItemIcon, Fade } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { NoteIcon } from "../Atoms/NoteIcon";

interface NoteCollectionViewProps {
    items: Note[];
    selectedIndex: number;
    itemPressed: (e: [Note, number]) => void;
    deletePressed: (e: Note) => void;
    editPressed: (e: Note) => void;
    changeNamePressed: (e: Note) => void;
}

export function NoteCollectionView(props: NoteCollectionViewProps) {
    const { items } = props;

    const [t] = useTranslation();

    const theme = useTheme();
    const parent = useRef<HTMLDivElement>(null);
    const rectElement = useRef<HTMLDivElement>(null);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

    const [lastPeressed, setLastPressed] = useState(location.pathname);
    const [lastTop, setLastTop] = useState(-1);
    const [currentElement, setCurrentElement] = useState<HTMLDivElement | null>(null);
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        if (currentElement) {
            moveCaretPosition(currentElement, 6);
        }
    });

    const moveCaretPosition = (targetElement: Element, margin: number) => {
        const parentRect = parent.current?.getBoundingClientRect();
        const rect = targetElement?.getBoundingClientRect();
        const style = rectElement.current?.style;

        if (!parentRect || !rectElement.current || !style || rect.top === lastTop) return;

        if (lastTop < rect.top) {
            setTimeout(() => (style.top = `${rect.top + margin}px`), 150);
            style.bottom = `calc(100% - ${rect.bottom - margin}px`;
        }
        else {
            setTimeout(() => (style.bottom = `calc(100% - ${rect.bottom - margin}px`), 150);
            style.top = `${rect.top + margin}px`;
        }

        setLastTop(rect.top);
    };

    function handleDelete() {
        if (note) {
            props.deletePressed(note);
        }
        setMenuAnchor(null);
    }

    function handleChangeNamePressed() {
        if (note) {
            props.changeNamePressed(note);
        }
        setMenuAnchor(null);
    }

    function handleEditPressed() {
        if (note) {
            props.editPressed(note);
        }
        setMenuAnchor(null);
    }

    return (
        <div ref={parent}>
            <List component="nav">
                {
                    items.map((item, i) => <>
                        <Item
                            menuInvoked={e => {
                                setMenuAnchor(e.currentTarget);
                                setNote(item);
                            }}
                            isSelected={props.selectedIndex === i}
                            item={item}
                            refChanged={elm => setCurrentElement(elm)}
                            itemPressed={e => props.itemPressed([e, i])}
                            selectedIndex={props.selectedIndex}
                            key={item.noteId}
                        />
                    </>)
                }
            </List>
            <div ref={rectElement} style={{
                background: theme.palette.primary.main,
                width: "6px",
                transition: "all 0.3s",
                position: "absolute"
            }}></div>
            <Menu anchorEl={menuAnchor} open={!!menuAnchor} keepMounted onClose={() => setMenuAnchor(null)}
                TransitionComponent={Fade}>
                <List>
                    <ListItem button onClick={handleEditPressed}>
                        <ListItemIcon>
                            <Label />
                        </ListItemIcon>
                        <ListItemText primary={t("Edit")} />
                    </ListItem>
                    <ListItem button onClick={handleChangeNamePressed}>
                        <ListItemIcon>
                            <Edit />
                        </ListItemIcon>
                        <ListItemText primary={t("ChangeName")} />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={handleDelete}>
                        <ListItemIcon>
                            <Delete />
                        </ListItemIcon>
                        <ListItemText primary={t("Delete")} />
                    </ListItem>
                </List>
            </Menu>
        </div >
    );
}

interface ItemProps {
    item: Note;
    selectedIndex: number;
    itemPressed: (e: Note) => void;
    isSelected: boolean;
    refChanged: (elm: any) => void;
    menuInvoked: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Item(props: ItemProps) {
    return (
        <ListItem
            button
            onClick={e => props.itemPressed(props.item)}
            style={{
                height: "48px", background: props.isSelected ?
                    "rgba(127,127,127,0.08)" : ""
            }}
            ref={elem => props.isSelected && props.refChanged(elem)}>
            <ListItemIcon>
                <NoteIcon note={props.item} />
            </ListItemIcon>

            <ListItemText
                primary={<Typography variant="body2" noWrap>
                    {props.item.name}
                </Typography>}
            >

            </ListItemText>
            <ListItemSecondaryAction>
                <IconButton size="small" onClick={e => {
                    props.menuInvoked(e);
                }} ><MoreVert /></IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}
