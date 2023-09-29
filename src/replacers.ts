import { faker } from '@faker-js/faker/locale/en'
import * as d3 from "d3"

export type Replacer =
{
    pattern: string
    fn: Function | ((param1?: number) => void) | ((param1?: number, param2?: number) => void)
    /**
     * https://d3js.org/d3-format
     */
    d3format?: string
    /**
     * https://d3js.org/d3-time-format
     */
    d3dateformat?: string
    defaultValues?: Array<number>;
}

export const Replacers: Array<Replacer> = [
    { pattern: "random", fn: (max: number, min: number)=> d3.randomUniform(min, max)().toString(), d3format: "d", defaultValues: [100, 0] },
    { pattern: "money", fn: (max: number, min: number)=> d3.randomUniform(min, max)().toString(), d3format: ",.2f", defaultValues: [100, 0] },
    { 
        pattern: "randomN", fn: (max: number, min: number)=> {
            const center = ((max - min) / 2) + min;
            const deviation = (max - min) / 6;
            const r = d3.randomNormal(center, deviation)();
            const retval = Math.min(Math.max(min, r), max);
            return retval.toString()
        }, 
        d3format: "d", 
        defaultValues: [100, 0] 
    },
    { 
        pattern: "moneyN", fn: (max: number, min: number)=> {
            const center = ((max - min) / 2) + min;
            const deviation = (max - min) / 6;
            const r = d3.randomNormal(center, deviation)();
            const retval = Math.min(Math.max(min, r), max);
            return retval.toString()
        },
        d3format: ",.2f",
        defaultValues: [100, 0] 
    },
    { 
        pattern: "randomE", fn: (max: number, min: number)=>{
            debugger;
            let r = min+(d3.randomExponential(8)()*max);
            const retval = Math.min(Math.max(min, r), max);
            return retval.toString()
        },
        d3format: "d",
        defaultValues: [100, 0]
    },
    { 
        pattern: "moneyE", fn: (max: number, min: number)=>{
            let r = min+(d3.randomExponential(8)()*max);
            const retval = Math.min(Math.max(min, r), max);
            return retval.toString()
        }, 
        d3format: ",.2f", 
        defaultValues: [100, 0]
    },

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
    { pattern: "email", fn: ()=> faker.internet.email().toLowerCase() },
    { pattern: "guid", fn: ()=> faker.string.uuid().toLowerCase() },
    { pattern: "GUID", fn: ()=> faker.string.uuid().toUpperCase() },
    { pattern: "Id", fn: (symbols: number)=> faker.string.nanoid(symbols), defaultValues: [10] },
    { pattern: "id", fn: (symbols: number)=> faker.string.nanoid(symbols).toLowerCase(), defaultValues: [10] },
    { pattern: "ID", fn: (symbols: number)=> faker.string.nanoid(symbols).toUpperCase(), defaultValues: [10] },
    
    // company
    { pattern: "companyName", fn: ()=> faker.company.name() },
    { pattern: "companySuffix", fn: ()=> faker.company.companySuffix() },
    //special
    { pattern: "party", fn: ()=> faker.company.name() },
    { pattern: "client", fn: ()=> `${faker.company.name()} ${faker.location.countryCode()}` },
    { pattern: "counterparty", fn: ()=> faker.company.name() },

    // dates
    { pattern: "recent", fn: (days: number)=> faker.date.recent({days}), d3dateformat: "%d-%b-%Y", defaultValues: [7] },
    { pattern: "recentDatetime", fn: (days: number)=> faker.date.recent({days}), d3dateformat: "%d-%b-%Y %H:%M:%S", defaultValues: [7] },
    { pattern: "soon", fn: (days: number)=> faker.date.soon({days}), d3dateformat: "%d-%b-%Y", defaultValues: [7] },
    { pattern: "soonDatetime", fn: (days: number)=> faker.date.soon({days}), d3dateformat: "%d-%b-%Y %H:%M:%S", defaultValues: [7] },

    //finance
    { pattern: "masked", fn: ()=> faker.finance.maskedNumber({ length: 4, parens: false }) },
    { pattern: "ccy", fn: ()=> faker.finance.currencyCode() },
    { pattern: "currency", fn: ()=> faker.finance.currencyName() },
    { pattern: "$", fn: ()=> faker.finance.currencySymbol() },
    { pattern: "iban", fn: ()=> faker.finance.iban() },
    { pattern: "bic", fn: ()=> faker.finance.bic({ includeBranchCode: true  }) },

    //bank specific
    { pattern: "crds", fn: (max: number, min: number)=> `100${d3.randomUniform(min, max)()}`, d3format: 'd', defaultValues: [2000000, 0] },
    { pattern: "aminet", fn: (max: number, min: number)=>  d3.randomUniform(min, max)(), d3format: '04d', defaultValues: [900, 100] },
    { pattern: "dbmail", fn: ()=> `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}@db.com` },

]
    
