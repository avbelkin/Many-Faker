import { pattern } from "./replace";

export function textTransform(oldText: string) : string
{
    return oldText.replace(pattern, replacer);
}
function replacer(match: string, start: number, originalString: string): string
{
    return "XXX";
}