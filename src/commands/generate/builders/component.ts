
import inquirer, { QuestionCollection } from "inquirer";
import chalk from "chalk";
import { basename, dirname, join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { FileExtensions, RSXConfig, SheetExtensions } from "../../../interfaces/rsx.config.js";
import ClassComponent from "./component/class-component.js";
import FunctionComponent from "./component/function-component.js";

export interface BuilderInfo {
        baseFileName: string;
        fileName: string;
        sheetName: string;
        componentName: string;
        filePath: string;
        componentType: keyof ComponentBuilder;
        fileExtension: "tsx" | "jsx"
        sheetExtension: "sass" | "css" | "scss" | "none"
}

interface ComponentBuilder {
    function: (builderInfo: BuilderInfo) => FunctionComponent;
    class: (builderInfo: BuilderInfo) => ClassComponent;
    const: (builderInfo: BuilderInfo) => void
}

export default class Component {

    constructor(private rsxConfig: RSXConfig, path: string, type?: string){
        this.initComponent(path, this.parseType[type])
    }

    get parseType(){
        return {
            "class": "class",
            "const": "const",
            "function": "function",
        }
    }

    async initComponent(path?: string, componentType?: keyof ComponentBuilder){
        if (path){
            let filePath = join(process.cwd(), "src", path);
            if (!componentType){
                let anwserComponentType = await inquirer.prompt(this.askForComponentType) as Record<"res", keyof ComponentBuilder>
                let answerFileExtension = await inquirer.prompt(this.askForFileExtension) as Record<"res", FileExtensions>
                let answerSheetExtension = await inquirer.prompt(this.askForSheetExtension) as Record<"res", SheetExtensions>
                const builderInfo = this.getBuilderInfo(filePath, anwserComponentType.res, answerFileExtension.res, answerSheetExtension.res);           
                this.callComponentBuilder[anwserComponentType.res](builderInfo);
            }

            return;
        }
        let answerPath = await inquirer.prompt(this.askForPath) as Record<"res", "string">
        if (!componentType) {
            let anwserComponentType = await inquirer.prompt(this.askForComponentType) as Record<"res", keyof ComponentBuilder>
            let filePath = join(process.cwd(), "src", answerPath.res);
            let answerFileExtension = await inquirer.prompt(this.askForFileExtension) as Record<"res", FileExtensions>
            let answerSheetExtension = await inquirer.prompt(this.askForSheetExtension) as Record<"res", SheetExtensions>
            const builderInfo = this.getBuilderInfo(filePath, anwserComponentType.res, answerFileExtension.res, answerSheetExtension.res);                  
            this.callComponentBuilder[anwserComponentType.res](builderInfo);
        }
    }

    get askForPath(): QuestionCollection{
        return [
            {
                name: "res",
                message: `Define the path location to generate your ${chalk.blue("Component")} ${chalk.yellow("(Default is ./src)")}`,
                type: "input"
            }
        ]
    }

    get askForComponentType(): QuestionCollection{
        return [
            {
                name: "res",
                message: `Define the ${chalk.blue("type")} of your ${chalk.blue("Component")}`,
                type: "list",
                choices: ["function", "const", "class"]
            }
        ]
    }

    get askForFileExtension(): QuestionCollection{
        return [
            {
                name: "res",
                message: `Define the ${chalk.blue("extension")} of your ${chalk.blue("Component")}`,
                type: "list",
                choices: ["jsx", "tsx"]
            }
        ]
    }

    get askForSheetExtension(): QuestionCollection{
        return [
            {
                name: "res",
                message: `Define the ${chalk.blue("extension")} of your ${chalk.blue("Stylesheet")}`,
                type: "list",
                choices: ["css", "sass", "scss", "none"]
            }
        ]
    }

    get callComponentBuilder(): ComponentBuilder{
        return {
            function: (builderInfo: BuilderInfo) => new FunctionComponent(builderInfo),
            class: (builderInfo: BuilderInfo) => new ClassComponent(builderInfo),
            const: (builderInfo: BuilderInfo) => () => {}
        }
    }

    getBuilderInfo(filePath: string, componentType: keyof ComponentBuilder, fileExtension: FileExtensions, sheetExtension: SheetExtensions): BuilderInfo{
        return {
            baseFileName: basename(filePath).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
            fileName: basename(filePath).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + "." + this.rsxConfig.fileExtension,
            sheetName: basename(filePath).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + "." + this.rsxConfig.sheetExtension,
            componentName: basename(filePath).charAt(0).toLocaleUpperCase() + basename(filePath).slice(1),
            filePath: filePath.endsWith("\\") ? dirname(filePath) : filePath,
            componentType,
            fileExtension,
            sheetExtension
        }
    }


}