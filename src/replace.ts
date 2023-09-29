import { textTransform } from "./text-transform";

export const pattern = /\{.*?\}/g
export async function traverseAndReplace(selection: readonly SceneNode[])
{
    for(const selectedNode of selection)
    {
       traverseInner(selectedNode, true);
    }
}

async function traverseInner(parentNode: SceneNode, autoRename?: boolean): Promise<TextNode[]>{
    let nodes: TextNode[] = [];

    if(parentNode.type === "TEXT")
    {
        await replaceTextsOnNodes([parentNode], autoRename);
    }
    
    else if ("children" in parentNode) {
        for (const child of parentNode.children){
            if (child.type === "GROUP" || 
                child.type === "FRAME" || 
                child.type === "INSTANCE" ||
                child.type === "COMPONENT" ||
                child.type === "TEXT"
            )
            {
                const canRename = autoRename && (child.type === "GROUP" || child.type === "FRAME" || child.type === "COMPONENT" || child.type === "TEXT")
                const foundNodes = await traverseInner(child, canRename);
                if(foundNodes.length> 0) {
                    nodes = nodes.concat(foundNodes);
                }
            }
        }
    }
    return nodes;
}
const loadedFontNames = Array<FontName>();

async function replaceTextsOnNodes(textNodes: TextNode [], rename?: boolean){
    for (const textNode of textNodes) {
        if(textNode.fontName === figma.mixed)
        {
            await replaceInMixedStyleNode(textNode);
        }
        else
        {
            await replaceInNode(textNode, rename);
        }    
    }
}

async function replaceInMixedStyleNode(textNode: TextNode)
{
    const fontsToLoad = textNode
        .getRangeAllFontNames(0, textNode.characters.length)
        .filter(n => !loadedFontNames.find(f => f.family === n.family && f.style === n.style));
    
    if(fontsToLoad.length>0)
    {
        await Promise.all(fontsToLoad.map(figma.loadFontAsync));
    }
    if(textNode.hasMissingFont) 
    {
        console.warn('unabled to edit text node due to missing font')
        return;
    }

    const segments = textNode.getStyledTextSegments(['fontName', 'indentation' ]) as Array<StyledTextSegment>;
    for(let i = segments.length-1; i>= 0; i--)
    {
        const segment = segments[i];
        if(!pattern.test(segment.characters)) continue;

        const oldCharsCount = segment.end - segment.start;
        const oldsegmentStart = segment.start;
        const newText = textTransform(segment.characters);
        textNode.insertCharacters(segment.end, newText, "BEFORE" )
        textNode.deleteCharacters(oldsegmentStart, oldsegmentStart+oldCharsCount)
    }
}

async function replaceInNode(textNode: TextNode, rename?: boolean)
{
    const fontsToLoad = textNode
        .getRangeAllFontNames(0, textNode.characters.length)
        .filter(n => !loadedFontNames.find(f => f.family === n.family && f.style === n.style));
    
    if(fontsToLoad.length>0){
        await figma.loadFontAsync(textNode.fontName as FontName);
    }

    if(textNode.hasMissingFont) 
    {
        console.warn('unabled to edit text node due to missing font')
        return;
    }

    const hasMatchInText = pattern.test(textNode.characters);
    const hasMatchInName = pattern.test(textNode.name);
    
    if(!(hasMatchInText || hasMatchInName)) return;
    
    if(hasMatchInText){
        if(rename) textNode.name = textNode.characters;
        textNode.characters = textTransform(textNode.characters);
    }
    else if(hasMatchInName){
        if(rename) textNode.autoRename = false;
        textNode.characters = textTransform(textNode.name);
    }
    else
        debugger;
}