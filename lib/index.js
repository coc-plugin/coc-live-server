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
var import_coc2 = require("coc.nvim");
var import_child_process = require("child_process");

// src/config.ts
var import_coc = require("coc.nvim");
function getConfigItem(name, defaultValue = null) {
  const config = import_coc.workspace.getConfiguration();
  return config.get(`coc-live-server.` + name) || defaultValue;
}

// src/index.ts
var liveServerProcess = null;
var statusItem = null;
process.on("exit", () => {
  if (liveServerProcess) {
    liveServerProcess.kill();
  }
  if (statusItem) {
    statusItem.dispose();
  }
});
async function activate(context) {
  context.subscriptions.push(
    import_coc2.commands.registerCommand("coc-live-server.start", async () => {
      startLiveServer();
    }),
    import_coc2.commands.registerCommand("coc-live-server.stop", async () => {
      stopLiveServer();
    })
  );
}
function startLiveServer() {
  const serverModule = require.resolve("live-server/live-server");
  const port = getConfigItem("port", 8080);
  const args = [];
  if (liveServerProcess) {
    stopLiveServer(false);
  }
  statusItem = import_coc2.window.createStatusBarItem(0);
  statusItem.text = "Live Server: starting";
  statusItem.show();
  if (port && typeof port === "number") {
    args.push(" --port=" + port);
  }
  args.push(` ${import_coc2.workspace.root}`);
  import_coc2.window.showInformationMessage(args.join(" "));
  liveServerProcess = (0, import_child_process.spawn)("node", [serverModule, ...args], { shell: true });
  if (liveServerProcess) {
    liveServerProcess.stdout.on("data", (data) => {
      if (statusItem && statusItem?.text !== "Port: " + port) {
        statusItem.text = "Port: " + port;
      }
      const output = data.toString();
      const ansiRegex = /\x1b\[[0-9;]*m/g;
    });
    liveServerProcess.stderr.on("data", () => {
      if (statusItem) {
        statusItem.text = "Live Server: error";
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
