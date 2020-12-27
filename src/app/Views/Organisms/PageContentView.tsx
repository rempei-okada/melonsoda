import { Box, Button, colors, Fab, Fade, Grid, Menu, Paper, TextField, Typography, useTheme } from "@material-ui/core";
import React, { useState, memo, useCallback, useEffect } from "react";
import { Field } from "../../Models/Notes/Field";
import { FieldEditor } from "../Editors";
import { useTranslation } from "react-i18next";
import { Page } from "../../Models/Notes/Page";
import { ColorPalette } from "../../Commons/ColorPalette";
import { Add } from "@material-ui/icons";
import { store } from "../..//Stores";
import { v4 } from "uuid";

interface PageContentViewProps {
    page: Page;
    pageChanged: (e: Page) => void;
    fieldChanged: (e: Field) => void;
    addPressed: () => void;
}

export function PageContentView(props: PageContentViewProps) {
    function handleFieldChanged(field: Field, index: number) {
        props.fieldChanged(field);
    }

    function handlePageChanged(key: keyof Page, value: any) {
        props.pageChanged(new Page({
            ...props.page,
            [key]: value
        }));
    }

    return (
        <Box display="flex" flexDirection="column" height="100%">
            <ContentHeader page={props.page} pageChanged={handlePageChanged} />
            <Box overflow="scroll" flex="1 1 auto">
                <Box display="flex" flexDirection="column" alignItems="center" width="100%" >
                    {
                        props.page.fields.map((field, i) => {
                            return (
                                <FieldItem key={field.fieldId} field={field} fieldChanged={e => handleFieldChanged(e, i)} />
                            );
                        })
                    }
                    <Box style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 2 }}>
                        <Fab color="primary" onClick={e => props.addPressed()}>
                            <Add />
                        </Fab>
                    </Box>
                </Box>
            </Box >
        </Box>
    );
}

const ContentHeader = (props: { page: Page, pageChanged: (key: keyof Page, value: any) => void }) => {
    const theme = useTheme();
    const [t] = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handlePageChanged = useCallback((e, f) => props.pageChanged(e, f), [props.pageChanged])

    return (
        <Grid container style={{ background: theme.palette.background.default }}>
            <Grid item xs={12} lg={6}>
                <Box p={1}>
                    <TextField
                        variant="outlined"
                        label={t("Title")}
                        fullWidth
                        size="small"
                        onChange={e => handlePageChanged("title", e.target.value)}
                        value={props.page.title}
                    />
                </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Box width="100%" p={1} display="flex">
                    <Box flex="1 1 auto">
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            disableElevation
                            value={props.page.title}
                        >{props.page.createdAt.toFormat("y/M/d h:m:s")}</Button>
                    </Box>
                    <Box width="52px" pl={1}>
                        <Button
                            style={{
                                background: props.page.color,
                                minWidth: "100%",
                                height: "100%"
                            }}
                            onClick={e => setAnchorEl(e.currentTarget)}
                        />
                        <Menu
                            id="fade-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={!!anchorEl}
                            MenuListProps={{
                                style: {
                                    padding: "2px",
                                    borderRadius: "0px"
                                },
                            }}
                            onClose={() => setAnchorEl(null)}
                            TransitionComponent={Fade}
                        >
                            <ColorPalette
                                column={6}
                                value={props.page.color}
                                colors={
                                    [
                                        "#a9e0bf",
                                        "#F8B195",
                                        "#F67280",
                                        "#C06C84",
                                        "#6C5B7B",
                                        "#355C7D",
                                        "#A7226E",
                                        "#EC2049",
                                        "#F26B38",
                                        "#6fc2e2",
                                        "#F7DB4F",
                                        "#2F9599",
                                        "#CC527A",
                                        "#594F4F",
                                        "#E5FCC2",
                                        "#9DE0AD",
                                        "#6f12e2",
                                        "#547980",
                                    ]}
                                onChange={e => {
                                    props.pageChanged("color", e);
                                    setAnchorEl(null);
                                }} />
                        </Menu>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

const FieldItem = memo(
    (props: { field: Field, fieldChanged: (f: Field) => void }) => {
        const theme = useTheme();

        return (<>
            <Box width="100%">
                <FieldEditor
                    field={props.field}
                    fieldChanged={props.fieldChanged}
                />
            </Box>
            <Box style={{
                height: "8px",
                width: "100%",
                background: theme.palette.background.default
            }} />
        </>);
    },
    (p, n) => p.field.value === n.field.value && p.field.fieldId === n.field.fieldId
);