import { mkdir, writeFile } from "fs/promises"
import { join } from "path"
import { RSXConfig } from "../../../../interfaces/rsx.config.js"
import { BuilderInfo } from "../component.js";

export default class ClassComponent {

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
                this.createTSXComponentProps(builder);
                this.createTSXComponentState(builder);
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

    createTSXComponentProps(builder: BuilderInfo){
        writeFile(join(builder.filePath, builder.baseFileName+"-props."+builder.fileExtension.slice(0, -1)), this.componentPropsSample(builder.componentName));// Generate Class Props
    }

    createTSXComponentState(builder: BuilderInfo){
        writeFile(join(builder.filePath, builder.baseFileName+"-state."+builder.fileExtension.slice(0, -1)), this.componentStateSample(builder.componentName));// Generate Class State
    }

    private componentSampleTSX(builder: BuilderInfo){
        return `
import React, { Component } from "react";
import ${builder.componentName}Props from "./${builder.baseFileName}-props";
import ${builder.componentName}State from "./${builder.baseFileName}-state";
import "./${builder.sheetName}";

class ${builder.componentName} extends Component<${builder.componentName}Props, ${builder.componentName}State> {
    
    constructor(props: ${builder.componentName}Props) {
        super(props);
        this.state = { counter: 0 };
    }

    componentDidMount() {};
    
    render() {
        return (
            <div>${builder.componentName}-class-component-works</div>
        );
    }
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

    private componentStateSample(componentName: string){
        return `
export default interface ${componentName}State {
    counter: number
}
        `
    }

    private componentSampleJSX(builder: BuilderInfo){
        return `
import React, { Component } from "react";
import "./${builder.sheetName}";

class ${builder.componentName} {
    
    constructor(props) {
        super(props);
        this.state = { counter: 0 };
    }

    componentDidMount() {};
    
    render() {
        return (
            <div>${builder.componentName}-class-component-works</div>
        );
    }
}
        `
    }

}
