import React, { useEffect, useState } from "react";
import { showDialogAsync, DialogContentProp } from "./showDialogAsync";
import { Box, Typography, Button, useTheme, TextField } from "@material-ui/core";

/**
 * Dialog that can confirm Ok or Cancel.
 * @param props dialog props
 */
function EntryDialog(props: DialogContentProp<ConfirmOption & { message: string; }, string | null>) {
    const theme = useTheme();
    const [text, setText] = useState(props.context.initialEntryText);

    return (
        <Box p={2}>
            <Box>
                <Typography variant="h6">{props.context.message}</Typography>
            </Box>

            <Box mt={1}>
                <Typography variant="overline" style={{ color: theme.palette.grey[500] }}>
                    {props.context.description}
                </Typography>
                <TextField fullWidth value={text} onChange={e => setText(e.target.value)} variant="outlined" />
            </Box>
            <Box marginTop="24px" display="flex">
                <Button
                    variant="text"
                    color="primary"
                    style={{ marginLeft: "auto" }}
                    onClick={() => props.onClose(null)}
                >
                    {props.context.cancelText}
                </Button>
                <Button
                    variant="contained"
                    style={{ marginLeft: "12px" }}
                    onClick={() => props.onClose(text)}
                    color="primary" >
                    {props.context.okText}
                </Button>
            </Box>
        </Box>
    );
}

interface ConfirmOption {
    description: string;
    okText: string;
    cancelText: string;
    initialEntryText: string;
}

/**
 * show confirm dialog async.
 * @param message confirm message
 * @param option dialog option
 */
export async function entryAsync(message: string, initialEntryText: string, option?: Partial<ConfirmOption>) {
    const merged = ({
        message,
        description: "",
        okText: "OK",
        cancelText: "Cancel",
        initialEntryText,
        ...option
    }) as ConfirmOption & { message: string; };

    return await showDialogAsync(EntryDialog, merged);
}