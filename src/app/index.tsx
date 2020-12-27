import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React from "react";
import { MelonsodaPage } from "./Views/Enviroments/MelonsodaPage";
import { lightTheme } from "./theme";
import "./resources";

import "./style.scss";

export function MelonsodaApp() {
    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <MelonsodaPage />
        </ThemeProvider>
    );
}