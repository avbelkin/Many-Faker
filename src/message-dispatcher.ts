import { ManyFakerMessage } from "./messages";
import { replace } from "./replace";

export async function messageDispatch(msg: ManyFakerMessage){
  if (msg.type === 'replace') {
    const nodes = await replace(figma.currentPage.selection)
      figma.currentPage.selection = nodes;
   //   figma.viewport.scrollAndZoomIntoView(nodes);
  }
  else
  {
    debugger;
  }
}