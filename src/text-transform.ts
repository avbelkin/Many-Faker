import { faker } from '@faker-js/faker/locale/en'
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
    debugger;
    const replacer = Replacers.find(i => i.pattern === name);
    if(replacer == null) return match;
    
    format = format ?? replacer.d3format ?? replacer.d3dateformat;
    
    if(!format)
        return replacer.fn();

    if(!replacer.defaultValues)
        return d3.format(format)(replacer.fn());

    param1 = param1 || (replacer.defaultValues && replacer.defaultValues[0]);
    param2 = param2 || (replacer.defaultValues && replacer.defaultValues[1]);


    if(replacer.d3dateformat)
    {
         
        return d3.utcFormat(format)(replacer.fn(param1));
    }
    else
    {
        return d3.format(format)(replacer.fn(param1, param2));
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

type Replacer =
{
    pattern: string
    fn: Function | ((param1?: number) => void) | ((param1?: number, param2?: number) => void)
    d3format?: string
    d3dateformat?: string
    defaultValues?: Array<number>;
}

const Replacers: Array<Replacer> = [
    { pattern: "random", fn: (max: number, min: number)=> d3.randomUniform(min, max)().toString(), d3format: "d", defaultValues: [100, 0] },
    { pattern: "money", fn: (max: number, min: number)=> d3.randomUniform(min, max)().toString(), d3format: ",.2f", defaultValues: [100, 0] },
    { pattern: "randomN", fn: (max: number, min: number)=> {
        const center = ((max - min) / 2) + min;
        const deviation = (max - min) / 6;
        const r = d3.randomNormal(center, deviation)();
        const retval = Math.min(Math.max(min, r), max);
        return retval.toString()
    }, d3format: "d", defaultValues: [100, 0] },
    { pattern: "moneyN", fn: (max: number, min: number)=> {
        const center = ((max - min) / 2) + min;
        const deviation = (max - min) / 6;
        const r = d3.randomNormal(center, deviation)();
        const retval = Math.min(Math.max(min, r), max);
        return retval.toString()
    }, d3format: ".2f", defaultValues: [100, 0] },
    { pattern: "randomE", fn: (max: number, min: number)=>{
        debugger;
        let r = min+(d3.randomExponential(8)()*max);
        const retval = Math.min(Math.max(min, r), max);
        return retval.toString()}
        , d3format: "d", defaultValues: [100, 0]},
    { pattern: "moneyE", fn: (max: number, min: number)=>{
        let r = min+(d3.randomExponential(8)()*max);
        const retval = Math.min(Math.max(min, r), max);
        return retval.toString()}
        , d3format: ".2f", defaultValues: [100, 0]},

    //
    
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
    //special
    { pattern: "party", fn: ()=> faker.company.name() },
    { pattern: "client", fn: ()=> `${faker.company.name()} ${faker.location.countryCode}` },
    { pattern: "counterparty", fn: ()=> faker.company.name() },

    // dates
    { pattern: "recent", fn: (days: number)=> faker.date.recent(days), d3dateformat: "%d-%b-%Y", defaultValues: [7] },
    { pattern: "recentDatetime", fn: (days: number)=> faker.date.recent(days), d3dateformat: "%d-%b-%Y %H:%M:%S", defaultValues: [7] },
    { pattern: "soon", fn: (days: number)=> faker.date.soon(days), d3dateformat: "%d-%b-%Y", defaultValues: [7] },
    { pattern: "soonDatetime", fn: (days: number)=> faker.date.soon(days), d3dateformat: "%d-%b-%Y %H:%M:%S", defaultValues: [7] },

    //finance
    { pattern: "masked", fn: ()=> faker.finance.maskedNumber({ length: 4, parens: false }) },
    { pattern: "ccy", fn: ()=> faker.finance.currencyCode() },
    { pattern: "currency", fn: ()=> faker.finance.currencyName() },
    { pattern: "$", fn: ()=> faker.finance.currencySymbol() },
    { pattern: "iban", fn: ()=> faker.finance.iban() },
    { pattern: "bic", fn: ()=> faker.finance.bic({ includeBranchCode: true  }) },

    //bank specific
    { pattern: "crds", fn: (max: number, min: number)=> d3.randomUniform(min, max)().toString(), d3format: "d", defaultValues: [10000000, 20000000] },
    { pattern: "aminet", fn: (max: number, min: number)=> `0${d3.randomUniform(min, max)()}`, d3format: "d", defaultValues: [900, 100] },
]
    
