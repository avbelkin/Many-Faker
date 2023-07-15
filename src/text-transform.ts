import { faker } from '@faker-js/faker'
import * as d3 from "d3"
//const orPattern = /\{.*?(|.*?)+\}/g

export function textTransform(oldText: string) : string
{
    return oldText.replace(pattern, replacer);
}

const pattern = /\{(.*?)((:(.*?)))?\}/g

function replacer(match: string, start: number): string {
    const parts = [...match.matchAll(pattern)];
    let format = parts[0][4]; // like .2f

    let [name, param1, param2] = getParams(parts[0][1]); //replacer name to match with
    //debugger;
    const replacer = Replacers.find(i => i.pattern === name);
    if(replacer == null) return match;
    
    format = format ?? replacer.d3format
    
    if(!format)
        return replacer.fn();

    if(!replacer.d3params)
        return d3.format(format)(replacer.fn());

    param1 = param1 || (replacer.d3params && replacer.d3params[0]);
    param2 = param2 || (replacer.d3params && replacer.d3params[1]);

    return d3.format(format)(replacer.fn(param1));
}

const scalePartRegex = /(.*?)((\d{1,10})([KMB])?(-(\d{1,10})([KMB])?)?)/g
function getParams(nameAndScale: string): [name: string, param1?: number, param2?: number]
{
    const scaleParams = [...nameAndScale.matchAll(scalePartRegex)];
    if(!scaleParams || !scaleParams[0] || !scaleParams[0][1]) return [nameAndScale];

    const name = scaleParams[0][1];
    let param1: number | undefined;
    let param2: number | undefined;
    if(scaleParams[0][3])
    {
        param1 = convertScale(scaleParams[0][3], scaleParams[0][4])
    }
    if(scaleParams[0][6])
    {
        param2 = convertScale(scaleParams[0][6], scaleParams[0][7])
    }

    return [name, param1, param2]
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

type Replacer =
{
    pattern: string
    fn: Function | ((a?: number) => void) | ((a?: number, b?: number) => void)
    d3format?: string
    d3params?: Array<number>;
}

const Replacers: Array<Replacer> = [
    { pattern: "random", fn: (max: number, min: number)=> d3.randomUniform(min, max)().toString(), d3format: "d", d3params: [100, 0] },

    //
    
    { pattern: "normal", fn: (center: number, deviation: number)=> d3.randomNormal(center, deviation ?? (center / 4) )().toString(), d3format: "d", d3params: [100] },
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
    
