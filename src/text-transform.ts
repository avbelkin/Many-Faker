import { faker } from '@faker-js/faker'
import * as d3 from "d3"
import { pattern } from "./replace";

export function textTransform(oldText: string) : string
{
    return oldText.replace(pattern, replacer);
}
function replacer(match: string, start: number): string
{
    debugger;
    const parts = [...match.matchAll(pattern)];

    const name = parts[0][1];
    const scale = parts[0][3];
    const format = parts[0][5];
    debugger;
    const patternPart = x.find(i => i.pattern === name);
    if(patternPart == null) return match;

    if(format)
    {
        if(!patternPart.range)
            return d3.format(format)(patternPart.fn());
        return d3.format(format)(patternPart.fn(patternPart.range[0],patternPart.range[1]));
    }
    else if(patternPart.d3format)
    {
        if(!patternPart.range)
            return d3.format(patternPart.d3format)(patternPart.fn());
        return d3.format(patternPart.d3format)(patternPart.fn(patternPart.range[0],patternPart.range[1]));
    }
    return patternPart.fn();
}
type IX =
{
    pattern: string
    fn: Function | ((a?: number) => void) | ((a?: number, b?: number) => void)
    d3format?: string
    range?: Array<number>;
}

const x: Array<IX> = [
    { pattern: "random10M", fn: ()=> d3.randomUniform(0,10000000)().toString(), d3format: "d" },
    { pattern: "random1M", fn: ()=> d3.randomUniform(0,1000000)().toString(), d3format: "d" },
    { pattern: "random100K", fn: ()=> d3.randomUniform(0,100000)().toString(), d3format: "d" },
    { pattern: "random10K", fn: ()=> d3.randomUniform(0,10000)().toString(), d3format: "d" },
    { pattern: "random1K", fn: ()=> d3.randomUniform(0,1000)().toString(), d3format: "d" },
    { pattern: "random100", fn: ()=> d3.randomUniform(0,100)().toString(), d3format: "d" },
    { pattern: "random10", fn: ()=> d3.randomUniform(0,10)().toString(), d3format: "d" },
    { pattern: "random", fn: (a: number, b: number)=> d3.randomUniform(a,b)().toString(), d3format: "d", range: [0,100] },

    //
    { pattern: "normal10M", fn: ()=> d3.randomNormal(10000000, 2500000)().toString(), d3format: "d" },
    { pattern: "normal1M", fn: ()=> d3.randomNormal(1000000, 250000)().toString(), d3format: "d" },
    { pattern: "normal100K", fn: ()=> d3.randomNormal(100000, 25000)().toString(), d3format: "d" },
    { pattern: "normal10K", fn: ()=> d3.randomNormal(10000, 2500)().toString(), d3format: "d" },
    { pattern: "normal1K", fn: ()=> d3.randomNormal(1000, 250)().toString(), d3format: "d" },
    { pattern: "normal100", fn: ()=> d3.randomNormal(100, 25)().toString(), d3format: "d" },
    { pattern: "normal10", fn: ()=> d3.randomNormal(10, 2.5)().toString(), d3format: "d" },
    //
    
    //location
    { pattern: "country", fn: ()=> faker.location.country() },
    { pattern: "countryCode", fn: ()=> faker.location.countryCode() },
    { pattern: "county", fn: ()=> faker.location.county() },
    { pattern: "city", fn: ()=> faker.location.city() },
    { pattern: "cityName", fn: ()=> faker.location.cityName() },
    { pattern: "street", fn: ()=> faker.location.street() },
    { pattern: "streetName", fn: ()=> faker.location.streetName() },
    { pattern: "zipCode", fn: ()=> faker.location.zipCode() },
    { pattern: "latitude", fn: ()=> faker.location.latitude() },
    { pattern: "longitude", fn: ()=> faker.location.longitude() },
    { pattern: "state", fn: ()=> faker.location.state()  },
    { pattern: "secondaryAddress", fn: ()=> faker.location.secondaryAddress() },
    
    // company
    { pattern: "companyName", fn: ()=> faker.company.name() },
    { pattern: "companySuffix", fn: ()=> faker.company.companySuffix() },

    //finance

    //special
    { pattern: "party", fn: ()=> faker.company.name() },
    { pattern: "client", fn: ()=> `${faker.company.name()} ${faker.location.countryCode}` },
    { pattern: "counterparty", fn: ()=> faker.company.name() },
]
    
