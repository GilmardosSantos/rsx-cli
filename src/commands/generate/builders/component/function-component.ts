import { writeFile, mkdir} from "fs/promises";
import { join } from "path";
import { BuilderInfo } from "../component.js";

export default class FunctionComponent {

    constructor(builder : BuilderInfo){
        mkdir(builder.filePath, { recursive: true}).then(async () => {
            this.createByType[builder.fileExtension](builder);
        })
    }

    get createByType(){
        return {
            jsx: (builder: BuilderInfo) => {
                this.createJSXComponent(builder);
                this.createStyleSheet(builder)
            },
            tsx: (builder: BuilderInfo) => {
                this.createTSXComponent(builder);
                this.createStyleSheet(builder)
                this.createComponentProps(builder);
            }
        }
    }

    createTSXComponent(builder: BuilderInfo){
        writeFile(join(builder.filePath, builder.baseFileName + ".tsx"), this.componentSampleTSX(builder))
    }

    createJSXComponent(builder: BuilderInfo){
        writeFile(join(builder.filePath, builder.baseFileName + ".jsx"), this.componentSampleJSX(builder))
    }

    createStyleSheet(builder: BuilderInfo){
        writeFile(join(builder.filePath, builder.baseFileName + "." + builder.sheetExtension), "")
    }

    createComponentProps(builder: BuilderInfo){
        writeFile(join(builder.filePath, builder.baseFileName+"-props."+builder.fileExtension.slice(0, -1)), this.componentPropsSample(builder.componentName));// Generate Class Props
    }


    private componentSampleJSX(builder: BuilderInfo){
        return `
import React, { useEffect } from "react";
import './${builder.sheetName}';

export default function ${builder.componentName}() {
    return (
        <div>${builder.componentName}-function-component-works</div>
    )
}
        `
    }

    private componentSampleTSX(builder: BuilderInfo){
        return `
import React, { useEffect } from "react";
import ${builder.componentName}Props from "./${builder.baseFileName}-props";
import './${builder.sheetName}';

export default function ${builder.componentName}(props: ${builder.componentName}Props) {
    return (
        <div>${builder.componentName}-function-component-works</div>
    )
}
        `
    }

    private componentPropsSample(componentName: string){
        return `
export default interface ${componentName}Props {
    counter: number;
}
        `
    }

}
