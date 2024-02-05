#! /usr/bin/env node
import { Command } from "commander";
import { existsSync } from "fs";
import { RSXConfig } from "../interfaces/rsx.config.js";
import { join } from "path";
import chalk from "chalk";
import Generate from "./generate/generate.js";


export default class Commands {

    rsxConfig: RSXConfig = {
        fileExtension: 'tsx',
        sheetExtension: 'scss',
        testFile: true,
        testExtension: "spec",
        componentType: "function"
    }

    constructor(private program: Command){
        this.checkRSXConfig().then(rsxConfig => {
            if (process.argv.length <= 2 || process.argv.includes('-h') || process.argv.includes('--help')){
                this.showHelp()
            }
            else{
                new Generate(this.program, this.rsxConfig);
            }
        })
    }

    private async checkRSXConfig(rsxConfigPath = join(process.cwd(), "rsx.config.js")){
        if (existsSync(rsxConfigPath)){
            // const configFile = await import('file://' + rsxConfigPath)
            // this.rsxConfig = configFile.default as RSXConfig;
            return this.rsxConfig;
        }
        let rsxConfig = `export default {
    sheetExtension: "scss",
    fileExtension: "tsx",
    testFile: true,
    testExtension: "spec"
}
        `
        // await writeFile(join(process.cwd(),"rsx.config.js"), rsxConfig);
        // const configFile = await import('file://' + rsxConfigPath);
        // this.rsxConfig = configFile.default as RSXConfig;;
        return this.rsxConfig;
    }

    private showHelp(){
        console.log(`
${chalk.magenta("Commands:")}
${chalk.cyan("rsx generate [Component | Context | Hook] <Path>")}   ${chalk.green("Generate files based on a schematic")}   ${chalk.yellow("[aliases: g, generate]")}

        `)
    }
}