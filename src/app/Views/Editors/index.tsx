import { Box, Button, DialogActions, IconButton, useTheme } from "@material-ui/core";
import { Add, Photo } from "@material-ui/icons";
import { ImageCacheRepository } from "../../Repositories/cache";
import React, { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RitchEditor } from "../../Commons/Editor/RitchEditor";
import { PhotoGridView } from "../../Commons/PhotoGalleryView";
import { Field } from "../../Models/Notes/Field";

interface FieldEditorProps {
    field: Field;
    fieldChanged: (e: Field) => void;
}

export const FieldEditor =
    (props: FieldEditorProps) => {
        const { field } = props;

        function handleFieldChanged(value: any) {
            props.fieldChanged(new Field({
                ...field,
                value
            }));
        }

        switch (field.type) {
            case "text": return (
                <RitchEditor content={props.field.value} contentChanged={e => handleFieldChanged(e)} />
            );
            case "photo-gallery": return (
                <PhotoGalleryEditor items={field.value.split(",")} itemsChanged={e => handleFieldChanged(e.join(","))} />
            );
            default: return <div></div>
        }
    };


interface PhotoGalleryEditorProps {
    items: string[];
    itemsChanged: (items: string[]) => void;
}

function PhotoGalleryEditor(props: PhotoGalleryEditorProps) {
    const theme = useTheme();
    const [t] = useTranslation();
    const fileInput = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [urls, setUrls] = useState<string[]>([]);
    const [loaded, setLoaded] = useState<{ [name: string]: string }>({});

    async function setImage(file?: File) {
        if (!file) {
            return;
        }
        setFile(file);

        const repo = new ImageCacheRepository();

        setLoaded({ ...loaded, [file.name]: URL.createObjectURL(file) })
        await repo.saveAsync(file);
        props.itemsChanged([...props.items, file.name]);
    }

    useEffect(() => {
        const repo = new ImageCacheRepository();
        
        const items = props.items.map(async name => {
            if (!name) {
                return "";
            }

            if (loaded[name]) {
                return loaded[name];
            }

            const url = await repo.loadAsContentUrlAsync(name);
            setLoaded({ ...loaded, [name]: url });
            return url;
        });

        Promise.all(items).then(setUrls);
    }, [props.items]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="280px">
            <DialogActions style={{ background: theme.palette.background.default, width: "100%" }}>
                <Button
                    startIcon={<Photo />}
                    color="primary"
                    onClick={() => {
                        setIsLoading(true);
                        fileInput?.current?.click();
                    }}
                >
                    <input
                        ref={fileInput}
                        type="file"
                        style={{ display: "none" }}
                        onChange={e => setImage((e.target as any).files[0])}
                    />
                    {t("SELECT PHOTO")}
                </Button>
            </DialogActions>
            <PhotoGridView itemHeight={280} disableSelection images={urls.filter(x => !!x)} baseUrl="" />
        </Box>
    );
}