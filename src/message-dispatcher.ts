import { ManyFakerMessage } from "./messages";
import { traverseAndReplace } from "./replace";

export async function messageDispatch(msg: ManyFakerMessage){
  if (msg.type === 'replace') {
    await traverseAndReplace(figma.currentPage.selection)
  }
  else
  {
    console.warn('unknown command in plugin: %s', msg.type);
    debugger;
  }
}