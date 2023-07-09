import { faker } from '@faker-js/faker'
import * as d3 from "d3"
import { pattern } from "./replace";

export function textTransform(oldText: string) : string
{
    return oldText.replace(pattern, replacer);
}
function replacer(match: string, start: number): string
{
    //return faker.location.country()
    debugger;
    const parts = [...match.matchAll(pattern)];
    const format = parts[0][3];
    
    const patternPart = x.find(i => i.pattern === parts[0][1]);
    if(patternPart)
    {
        if(format)
        {

            return d3.format(format)(patternPart.fn());
        }
        return patternPart.fn();
    }
    else
    {
        return match;
    }
}
interface IX
{
    pattern: string
    fn: Function
}
const x: Array<IX> = [
    { pattern: "aaa", fn: ()=> d3.randomUniform(10000)().toString()  },
    { pattern: "eee", fn: ()=> d3.format(".2f")(d3.randomUniform(10)())  },
    { pattern: "bbb", fn: ()=> d3.randomUniform(10)().toString()  }
]
