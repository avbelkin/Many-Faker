export async function replace(selection: readonly SceneNode[]) : Promise<SceneNode[]>
{
    let nodes: TextNode[] = [];
    for(const selectedNode of selection)
    {
        const foundNodes = traverse(selectedNode);
        if(foundNodes.length>0)
        nodes = nodes.concat(foundNodes);
    }
    await replaceTextsOnNodes(nodes);
    return nodes;
}

function traverse(parentNode: SceneNode ): TextNode[]{
    let nodes: TextNode[] = [];

    if(parentNode.type === "TEXT")
    {
        nodes.push(parentNode);
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
                const foundNodes = traverse(child);
                if(foundNodes.length> 0) {
                    nodes = nodes.concat(foundNodes);
                }
            }
        }
    }
    return nodes;
}

async function replaceTextsOnNodes(textNodes: TextNode []){
    console.log(textNodes.length)
    for (const textNode of textNodes) {
        console.log(textNode.type)
        console.log(textNode.fontName);
        if(textNode.fontName !== figma.mixed)
        {
            await figma.loadFontAsync(textNode.fontName as FontName);
        }
        else
        {
            await Promise
                .all(textNode.getRangeAllFontNames(0, textNode.characters.length)
                .map(figma.loadFontAsync))
        }
        
        if(textNode.hasMissingFont) 
        {
            console.warn('unabled to edit text node due to missing font')
        }
        else
        {
            if(textNode.fontName !== figma.mixed)
            {
                textNode.autoRename = false;
                console.log(textNode.characters);
                textNode.characters = "XXX";
            }
            else
            {
                debugger;
                const segments = textNode.getStyledTextSegments(['fontName', 'indentation' ]) as Array<StyledTextSegment>;
                console.log(segments);
                for(let i = segments.length-1; i>= 0; i--)
                {
                    const segment = segments[i];
                    console.log(segment.characters);
                    const oldCharsCount = segment.end - segment.start;
                    const oldsegmentStart = segment.start;
                    const newText = "XXX";
                    textNode.insertCharacters(segment.end, newText, "BEFORE" )
                    textNode.deleteCharacters(oldsegmentStart, oldsegmentStart+oldCharsCount)
                }
                console.log(textNode.getStyledTextSegments(['fontName', 'indentation' ]) as Array<StyledTextSegment>);
            }    
        }
    }
}