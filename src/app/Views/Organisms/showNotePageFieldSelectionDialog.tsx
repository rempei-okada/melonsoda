import { Button, DialogActions, Typography, Box } from "@material-ui/core";
import { Photo, TextFields } from "@material-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { showDialogAsync, DialogContentProp, DialogContentFrame } from "../../Commons/showDialogAsync";
import { FieldSchemeType } from "../../Models/Notes/Field";


function FieldSelectionDialog(props: DialogContentProp<null, FieldSchemeType | null>) {
    const [t] = useTranslation();
    const [type, setType] = useState<FieldSchemeType>("text");

    return (
        <DialogContentFrame
            message={t("SelectField")}
            actions={
                <>
                    <Button onClick={_ => props.onClose(null)} >CANCEL</Button>
                    <Button color="primary" onClick={_ => props.onClose(type)}>OK</Button>
                </>
            }
        >
            <Box p={3} display="flex" alignItems="center" justifyContent="center">
                <Button size="large" color={type === "text" ? "primary" : undefined} onClick={_ => setType("text")}>
                    <Box>
                        <TextFields />
                        <Typography>{t("Text")}</Typography>
                    </Box>
                </Button>
                <Box ml={2} />
                <Button size="large" color={type === "photo-gallery" ? "primary" : undefined} onClick={_ => setType("photo-gallery")}>
                    <Box>
                        <Photo />
                        <Typography>{t("Photo")}</Typography>
                    </Box>
                </Button>
            </Box>
        </DialogContentFrame>
    );
}

export async function showNotePageFieldSelectionDialog() {
    return await showDialogAsync(FieldSelectionDialog, null, { maxWidth: "sm" });
}