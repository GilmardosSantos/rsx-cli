export interface RSXConfig {
    sheetExtension: "scss" | "sass" | "css" | "none";
    fileExtension: FileExtensions;
    componentType: "class" | "function" | "const";
    testFile?: boolean;
    testExtension: "test" | "spec";
}

export type FileExtensions = "jsx" | "tsx";
export type SheetExtensions = "scss" | "sass" | "css" | "none";