#! /usr/bin/env node
import { RSXConfig } from "../../../interfaces/rsx.config.js";

export default class Hook {
    constructor(private rsxConfig: RSXConfig, private path: string){
    }
}
