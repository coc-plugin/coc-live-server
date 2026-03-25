"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(src_exports);
var import_coc3 = require("coc.nvim");

// src/config.ts
var import_coc = require("coc.nvim");
function getConfigItem(name, defaultValue = null) {
  const config = import_coc.workspace.getConfiguration();
  if (defaultValue) {
    return config.get(`coc-live-server.` + name) || defaultValue;
  } else {
    return config.get(`coc-live-server.` + name);
  }
}

// src/server.ts
var import_coc2 = require("coc.nvim");
var import_child_process = require("child_process");
var liveServerProcess = null;
var statusItem = null;
function startLiveServer() {
  const serverModule = require.resolve("live-server/live-server");
  const port = getConfigItem("port", 8080);
  const host = getConfigItem("host", "0.0.0.0");
  const cors = getConfigItem("cors");
  const wait = getConfigItem("wait", 100);
  const spa = getConfigItem("spa");
  const index = getConfigItem("index", "index.html");
  const STATUS = `liveServer[:${port}]`;
  const args = [];
  if (liveServerProcess) {
    stopLiveServer(false);
  }
  statusItem = import_coc2.window.createStatusBarItem(0);
  statusItem.text = "LiveServer: starting";
  statusItem.show();
  if (port && typeof port === "number") {
    args.push(" --port=" + port);
  }
  if (host && typeof host === "string") {
    args.push(" --host=" + host);
  }
  if (cors) {
    args.push(" --cors");
  }
  if (spa) {
    args.push(" --spa");
  }
  if (wait && typeof wait === "number") {
    args.push(" --wait=" + wait);
  }
  if (index && typeof index === "string") {
    args.push(" --index=" + index);
  }
  args.push(` ${import_coc2.workspace.root}`);
  liveServerProcess = (0, import_child_process.spawn)("node", [serverModule, ...args], { shell: true });
  if (liveServerProcess) {
    liveServerProcess.stdout.on("data", (data) => {
      if (statusItem && statusItem?.text !== STATUS) {
        statusItem.text = STATUS;
      }
      const output = data.toString();
      const ansiRegex = /\x1b\[[0-9;]*m/g;
      import_coc2.window.showInformationMessage(`coc-live-server: ${output.replace(ansiRegex, "")}`);
    });
    liveServerProcess.stderr.on("data", () => {
      if (statusItem) {
        statusItem.text = "LiveServer: error";
      }
      import_coc2.window.showErrorMessage(
        "Failed to start coc-live-server. Please ensure live-server is installed."
      );
    });
    liveServerProcess.on("close", () => {
      stopLiveServer();
    });
  }
}
function stopLiveServer(showMsg = true) {
  if (liveServerProcess) {
    liveServerProcess.kill();
    liveServerProcess = null;
  } else {
    liveServerProcess = null;
  }
  if (statusItem) {
    statusItem.text = "";
    statusItem.hide();
    statusItem.dispose();
  }
  if (showMsg) {
    import_coc2.window.showInformationMessage("coc-live-server stopped");
  }
}
function toggleLiveServer() {
  if (liveServerProcess) {
    stopLiveServer();
  } else {
    startLiveServer();
  }
}

// src/index.ts
process.on("exit", () => {
  if (liveServerProcess) {
    liveServerProcess.kill();
  }
  if (statusItem) {
    statusItem.dispose();
  }
});
async function activate(context) {
  const enabled = getConfigItem("enabled");
  if (!enabled) {
    return;
  }
  context.subscriptions.push(
    import_coc3.commands.registerCommand("coc-live-server.start", () => {
      startLiveServer();
    }),
    import_coc3.commands.registerCommand("coc-live-server.stop", () => {
      stopLiveServer();
    }),
    import_coc3.commands.registerCommand("coc-live-server.toggle", () => {
      toggleLiveServer();
    })
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
