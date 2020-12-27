import { createMuiTheme, ThemeOptions } from "@material-ui/core/styles";
import { cyan, grey, orange } from "@material-ui/core/colors";

const main = "#67bb89";
const dark = "#67bb89";
const light ="#67bb89";

const common: ThemeOptions = {
    palette: {
        primary: {
            light: light,
            main: main,
            dark: dark,
            contrastText: "#fff",
        },
        secondary: {
            light: "rgb(46,46,46)",
            main: "rgb(24,24,24)",
            dark: "rgb(12,12,12)",
            contrastText: "#fff",
        },
        text: {
            primary: "rgba(0,0,0,0.67)",
            secondary: "rgba(0,0,0,0.4)"
        },
    },
    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: "rgb(236, 236, 236)",
            }
        },
        MuiInput: {
            underline: {
                "&:before": {
                    borderBottom: "2px solid rgb(42, 42, 42)"
                },
                "&:hover:not(.Mui-disabled):before ": {
                    borderBottom: "2px solid rgb(42, 42, 42, 0.54)",
                }
            },
        },
        MuiInputBase: {
        },
        MuiOutlinedInput: {
            notchedOutline: {
                borderWidth: "2px",
                borderColor: "rgba(0, 0, 0, 0.54);"
            }
        },
        MuiButton: {
            root: {
            }
        },
        MuiDivider: {
            vertical: {
                width: "2px"
            }
        }
    },
    typography: {
        fontWeightRegular: 500,
        fontWeightLight: 300,
        fontWeightBold: 700,
        fontWeightMedium: 500,
        h1: {
            fontWeight: 300
        },
        h2: {
            fontWeight: 300
        },
        h3: {
            fontWeight: 400
        },
        h4: {
            fontWeight: 400
        },
        h5: {
            fontWeight: 500
        },
        h6: {
            fontWeight: 500
        },
    },
};

const darkOption: ThemeOptions = {
}

const lightOption: ThemeOptions = {
    palette: {
        background: {
            default: "rgb(246,246,246)",
            paper: "rgb(255,255,255)"
        }
    },
}

function mergeDeeply<T extends { [key: string]: any }>(source: T, target: T, opts?: any): T {
    const isObject = (obj: T) => obj && typeof obj === 'object' && !Array.isArray(obj);
    const isConcatArray = opts && opts.concatArray;
    let result = Object.assign({}, target) as any;
    if (isObject(target) && isObject(source)) {
        for (const [sourceKey, sourceValue] of Object.entries(source)) {
            const targetValue = target[sourceKey];
            if (isConcatArray && Array.isArray(sourceValue) && Array.isArray(targetValue)) {
                result[sourceKey] = targetValue.concat(...sourceValue);
            }
            else if (isObject(sourceValue) && target.hasOwnProperty(sourceKey)) {
                result[sourceKey] = mergeDeeply(targetValue, sourceValue, opts);
            }
            else {
                Object.assign(result, { [sourceKey]: sourceValue });
            }
        }
    }

    return result;
}

export const darkTheme = createMuiTheme({ ...common, ...darkOption });
export const lightTheme = createMuiTheme(mergeDeeply(common, lightOption))