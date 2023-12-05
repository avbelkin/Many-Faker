import * as d3 from "d3"
import { Replacers } from './replacers'

export function textTransform(oldText: string) : string
{
    if(oldText.indexOf("|")>1) //ignore first two chars
    {
        console.warn(oldText);
        const parts = [...oldText.substring(1,oldText.length-1).matchAll(/[^|]+/g)]
        console.log(parts[0][0]);
        debugger;
        
        const candidate = parts[Math.floor(Math.random()* parts.length)][0];

        console.warn(candidate);
        if(candidate.startsWith("{")) {
            return candidate.replace(pattern, replacement);
        }
        return candidate;
    }
    return oldText.replace(pattern, replacement);
}

const pattern = /\{(.*?)((:(.*?)))?\}/g

function replacement(match: string, start: number): string {
    const parts = [...match.matchAll(pattern)];
    let format = parts[0][4]; // like .2f

    let [name, param1, param2] = getParams(parts[0][1]); //replacer name to match with
    
    const replacer = Replacers.find(i => i.pattern === name);
    if(replacer == null) return '<ERR>';
    
    format = format ?? replacer.d3format ?? replacer.d3dateformat;
    
    if(!format && !replacer.defaultValues)
        return replacer.fn();

    if(!replacer.defaultValues)
        return d3.format(format)(replacer.fn());

    param1 = param1 || (replacer.defaultValues && replacer.defaultValues[0]);
    param2 = param2 || (replacer.defaultValues && replacer.defaultValues[1]);


    if(replacer.d3dateformat)
    {
         
        return d3.utcFormat(format)(replacer.fn(param1));
    }
    else if(replacer.d3format)
    {
        return d3.format(format)(replacer.fn(param1, param2));
    }
    else
    {
        return replacer.fn(param1, param2);
    }
}

const scalePartRegex = /(.*?)((\d{1,10})([KMB])?(-(\d{1,10})([KMB])?)?)/g
function getParams(nameAndScale: string): [name: string, param1?: number, param2?: number]
{
    const scaleParams = [...nameAndScale.matchAll(scalePartRegex)];
    if(!scaleParams || !scaleParams[0] || !scaleParams[0][1]) return [nameAndScale];

    const name = scaleParams[0][1];
    let startParam: number | undefined;
    let endParam: number | undefined;
    if(scaleParams[0][3])
    {
        startParam = convertScale(scaleParams[0][3], scaleParams[0][4])
    }
    if(scaleParams[0][6])
    {
        endParam = convertScale(scaleParams[0][6], scaleParams[0][7])
    }

    return [name, endParam ? endParam : startParam, endParam ? startParam : endParam ]
}

function convertScale(numString: string, scaleString: string): number {
    let multiplier = 1;
    if(scaleString === "K")
        multiplier = 1000;
    else if(scaleString === "M")
        multiplier = 1000000;
    else if(scaleString === "B")
        multiplier = 1000000000;
    let source = parseFloat(numString);

     return source * multiplier 
}