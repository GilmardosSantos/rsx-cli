#! /usr/bin/env node
import { Command } from "commander";
import { RSXConfig } from "../../interfaces/rsx.config.js";
import inquirer from "inquirer";
import Component from "../generate/builders/component.js"
import Context from "../generate/builders/context.js"
import Hook from "../generate/builders/hook.js"
import { readdir } from "fs/promises";
import chalk from "chalk";
import { join } from "path";

export default class Generate {
    constructor(private program: Command, private rsxConfig: RSXConfig){
        this.rsxConfig = { ...rsxConfig };
        this.program 
        .command("g <argument> [path] [filePath] [type]")
        .alias('generate')
        .action(this.menu.bind(this))
        .parse(process.argv);
    }

    private async menu(command: string, argument?: string, path?: string, type?: string){
        this.checkReactExist().then( async (response) => {
            if(response){
                console.log(chalk.redBright("RSX can generate only in a react project"))
                return;
            }
            if (argument) {
                const choice = this.argumentAliases[argument] as keyof Choices;
                return this.menuSelect[choice].bind(this)(path, type);
            }
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectGenerate',
                    message: "Select what you want to generate:",
                    choices: ['Component', 'Context', "Hook"] as Array<Choices>,
                } 
            ]) as Record<'selectGenerate', Choices>;
            this.menuSelect[answer.selectGenerate].bind(this)(path, type);
        })
        
    }

    private menuSelect : Record<Choices, (path?: string, type?: string) => ChoicesClasses> = {
        Component: (path: string, type: 'function' | 'class' | 'const') => new Component(this.rsxConfig, path, type),
        Context: (path: string, type: 'function' | 'class' | 'const') => new Context(this.rsxConfig, path),
        Hook: (path: string, type: 'function' | 'class' | 'const') => new Hook(this.rsxConfig, path),
    }

    private get argumentAliases(){
        return {
            "c": "Component",
            "C": "Component",
            "component": "Component",
            "ctx": "Context",
            "CTX": "Context",
            "context": "Context"
        } as {[key: string]: string}
    }

    private async checkReactExist(){
        return readdir(join(process.cwd(), "node_modules")).then((folders => {
            if(folders.includes("react" || "REACT")) return true;
            return false;
        }))
    }
}

type Choices = 'Component' | 'Context' | "Hook";
type ChoicesClasses = Component | Context | Hook