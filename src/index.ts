#! /usr/bin/env node 
import { Command } from 'commander';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Commands from './commands/commands.js';
import { readFile } from 'fs/promises';
import chalk from 'chalk';
import figlet from 'figlet';

const __dirname = join(dirname(fileURLToPath(import.meta.url)),"..");

export default class RSXCli{
    public program = new Command();
    constructor(){
        this.describeProgram().then(() => {
            new Commands(this.program)
        })
    }

    private async describeProgram(package_json = join(__dirname, "package.json")): Promise<void>{
        const pkg = JSON.parse(await readFile(package_json, 'utf-8'))
        console.log(chalk.magentaBright(figlet.textSync('RSX CLI', { horizontalLayout: 'full' }))+"\n"+chalk.redBright(`Version: ${pkg.version} | Author: ${pkg.author}`));
        this.program.version(pkg.version)
    }

}

new RSXCli();

