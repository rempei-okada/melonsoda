import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";

interface ColorPaletteProps {
    colors?: string[];
    value?: string;
    onChange?: (e: string) => void;
    itemSize?: number;
    itemSpace?: number;
    column?: number;
}

const defaultColors = [
    "#e91e63",
    "#f44336",
    "#ff5722",
    "#ff9800",
    "#ffc107",
    "#ffeb3b",
    "#cddc39",
    "#4caf50",
    "#009688",
    "#00bcd4",
    "#2196f3",
    "#3f51b5",
    "#9c27b0",
];

const DefaultItemSize = 50;

export function ColorPalette(props: ColorPaletteProps) {
    const styles = useStyles();

    const colors = props.colors ?? defaultColors;
    const column = props.column ?? 6;
    const itemSize = props.itemSize ?? DefaultItemSize;
    const space = props.itemSpace ?? 1;

    useEffect(() => {
        if (!props.value || (props.value && !colors.includes(props.value))) {
            props.onChange && props.onChange(colors[0]);
        }
    }, []);

    return (
        <div className={styles.container} style={{
            width: `${itemSize * column + space * column + 8}px`,
            justifyContent: "center"
        }}>
            {
                colors.map(
                    c => <div
                        className={styles.item}
                        key={c}
                        style={{ padding: space }}
                    >
                        <div
                            style={{
                                width: `${itemSize}px`,
                                height: `${itemSize}px`,
                                background: c,
                                border: c === props.value ? "4px solid rgb(40,40,40)" : undefined
                            }}
                            onClick={_ => props.onChange && props.onChange(c)}
                        >
                        </div>
                    </div>
                )
            }
        </div>
    );
}

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    active: {
    },
    item: {
        "cursor": "pointer",
        "&:hover": {
            filter: "brightness(0.9 )"
        }
    }
});