var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { textTransform } from "./text-transform";
export const pattern = /\{(.*?)(:(.*?))?\}/g;
export function replace(selection) {
    return __awaiter(this, void 0, void 0, function* () {
        let nodes = [];
        for (const selectedNode of selection) {
            const foundNodes = traverse(selectedNode);
            if (foundNodes.length > 0)
                nodes = nodes.concat(foundNodes);
        }
        yield replaceTextsOnNodes(nodes);
        return nodes;
    });
}
function traverse(parentNode) {
    let nodes = [];
    if (parentNode.type === "TEXT") {
        nodes.push(parentNode);
    }
    else if ("children" in parentNode) {
        for (const child of parentNode.children) {
            if (child.type === "GROUP" ||
                child.type === "FRAME" ||
                child.type === "INSTANCE" ||
                child.type === "COMPONENT" ||
                child.type === "TEXT") {
                const foundNodes = traverse(child);
                if (foundNodes.length > 0) {
                    nodes = nodes.concat(foundNodes);
                }
            }
        }
    }
    return nodes;
}
function replaceTextsOnNodes(textNodes) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const textNode of textNodes) {
            if (textNode.fontName !== figma.mixed) {
                yield figma.loadFontAsync(textNode.fontName);
            }
            else {
                yield Promise
                    .all(textNode.getRangeAllFontNames(0, textNode.characters.length)
                    .map(figma.loadFontAsync));
            }
            if (textNode.hasMissingFont) {
                console.warn('unabled to edit text node due to missing font');
            }
            else {
                if (textNode.fontName !== figma.mixed) {
                    textNode.autoRename = false;
                    if (!pattern.test(textNode.characters))
                        continue;
                    textNode.characters = textTransform(textNode.characters);
                }
                else {
                    const segments = textNode.getStyledTextSegments(['fontName', 'indentation']);
                    for (let i = segments.length - 1; i >= 0; i--) {
                        const segment = segments[i];
                        if (!pattern.test(segment.characters))
                            continue;
                        const oldCharsCount = segment.end - segment.start;
                        const oldsegmentStart = segment.start;
                        const newText = textTransform(segment.characters);
                        textNode.insertCharacters(segment.end, newText, "BEFORE");
                        textNode.deleteCharacters(oldsegmentStart, oldsegmentStart + oldCharsCount);
                    }
                }
            }
        }
    });
}
