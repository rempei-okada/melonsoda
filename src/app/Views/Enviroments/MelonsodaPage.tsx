import React, { useEffect, useState } from "react";
import { Router, Link } from '@reach/router'
import { NoteSelectPanel } from "../Ecosystems/NoteSelectPanel";
import { PageContentPanel } from "../Ecosystems/PageContentPanel";
import { PageCollectionPanel } from "../Ecosystems/PageCollectionPanel";
import { Box, Paper, makeStyles, Drawer, Hidden, Slide, IconButton, Typography } from "@material-ui/core";
import { ArrowBack, ArrowLeft } from "@material-ui/icons";
import { store } from "../../Stores";
import { observer } from "mobx-react";
import { NoteIcon } from "../Atoms/NoteIcon";

const useStyles = makeStyles({
    note: {
        width: "calc(100% - 300px)",
        height: "100vh",
    }
});

export function MelonsodaPage() {
    return (
        <>
            <Hidden mdUp implementation="js" >
                <Mobile />
            </Hidden>
            <Hidden smDown implementation="js">
                <Desktop />
            </Hidden>
        </>

    );
}

const Mobile = observer(() => {
    const [shellPage, setShellPage] = useState(0);
    const [lastSellPage, setLastShellPage] = useState(-1);

    function handleSetPage(index: number) {
        setLastShellPage(shellPage);
        setShellPage(index);
    }

    return (
        <Box position="relative" height="100vh" width="100%">
            <Slide
                direction={"left"}
                appear
                enter
                in={shellPage >= 0}
            >
                <div>
                    <NoteSelectPanel notePressed={() => {
                        handleSetPage(1);
                    }} />
                </div>
            </Slide >

            <Slide
                style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
                direction={"left"}
                appear
                enter
                in={shellPage >= 1}
            >
                <div>
                    <Paper
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        square
                        elevation={0}
                    >
                        <Box height={56} px={1} display="flex" alignItems="center">
                            <IconButton onClick={_ => handleSetPage(0)}>
                                <ArrowBack />
                            </IconButton>
                            {store.selectedNotesStore.note && <>
                                <NoteIcon note={store.selectedNotesStore.note} />
                                <Box ml={2} />
                                <Typography variant="h5" color="textSecondary">{store.selectedNotesStore.note.name}</Typography>
                            </>}
                        </Box>
                        <Box />
                        <Box height="calc(100% - 56px)">
                            <PageCollectionPanel pageChanged={() => handleSetPage(2)} />
                        </Box>
                    </Paper>
                </div>
            </Slide >

            <Slide
                style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 2 }}
                direction={"left"}
                appear
                enter
                in={shellPage >= 2}
            >
                <div>
                    <Paper
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        square
                        elevation={0}
                    >
                        <Box height={56} px={1} display="flex" alignItems="center">
                            <IconButton onClick={_ => handleSetPage(1)}>
                                <ArrowBack />
                            </IconButton>
                            {store.selectedNotesStore.note && <>
                                <NoteIcon note={store.selectedNotesStore.note} />
                                <Box ml={2} />
                                <Typography variant="h5" color="textSecondary">{store.selectedNotesStore.note.name}</Typography>
                            </>}
                        </Box>
                        <Box />
                        <Box height="calc(100% - 56px)">
                            <PageContentPanel />
                        </Box>
                    </Paper>
                </div>
            </Slide >
        </Box>
    );
});

const Desktop = observer(() => {
    const styles = useStyles();

    return (
        <Box display="flex">
            <Box style={{ border: 0, width: "300px" }} >
                <NoteSelectPanel />
            </Box>
            <Paper
                className={styles.note}
                square
                elevation={0}
            >
                <Box height={56} px={2} display="flex" alignItems="center">
                    {store.selectedNotesStore.note && <>
                        <NoteIcon note={store.selectedNotesStore.note} />
                        <Box ml={2} />
                        <Typography variant="h5" color="textSecondary">{store.selectedNotesStore.note.name}</Typography>
                    </>}
                </Box>
                <Box display="flex" height="calc(100vh - 56px)">
                    <Box minWidth="280px" maxWidth="280px" >
                        <PageCollectionPanel />
                    </Box>
                    <Box flex="1 1 auto" overflow="hidden">
                        <PageContentPanel />
                    </Box>
                </Box>
            </Paper>
        </Box >
    );
});