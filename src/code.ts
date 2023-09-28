import { messageDispatch } from "./message-dispatcher";

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async msg => {
   await messageDispatch(msg);
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};

figma.on('run', ({command, parameters}: RunEvent) => {
  if(command === "replace")
  {
    new Promise(() => {
      messageDispatch({type: 'replace' })
      .then(() => figma.closePlugin())
    })
  }
  else{
  // This shows the HTML page in "ui.html".
    figma.showUI(__html__, { themeColors: true, width: 400, height: 300  });
  }
});