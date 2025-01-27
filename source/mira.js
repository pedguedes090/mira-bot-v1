process.on("unhandledRejection", error => console.error("Unhandled Rejection:", error));
process.on("uncaughtException", error => console.error("Uncaught Exception:", error));

const log = require("./lib/log");
const utils = require("./lib/utils");
const config = require("../config.json");

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const dirConfig = path.resolve(__dirname, "..", "config.json");
const dirConfigCommands = path.resolve(__dirname, "..", "configCommands.json");

function mergeObjects(target, source) {
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (source[key] === null || source[key] === undefined) {
                delete target[key];
            } else if (typeof source[key] === "object" && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
                    target[key] = {};
                }
                mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

function mergeObjectsPrimitives(target, source) {
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typeof source[key] !== "object" || Array.isArray(source[key]) || source[key] === null) {
                if (Object.prototype.hasOwnProperty.call(target, key)) {
                    target[key] = source[key];
                }
            } else if (typeof target[key] === "object" && target[key] !== null && !Array.isArray(target[key])) {
                mergeObjectsPrimitives(target[key], source[key]);
            }
        }
    }
    return target;
}

global.mira = {
    dir: path.resolve(__dirname, ".."),
    dirConfig,
    dirConfigCommands,
    get configCommands() {
        return require(this.dirConfigCommands);
    },
    set configCommands(value) {
        if (utils.getType(value) === "Object") {
            var lastConfig = require(this.dirConfigCommands);
            lastConfig = mergeObjects(lastConfig, value);
            fs.writeFileSync(this.dirConfigCommands, JSON.stringify(lastConfig, null, 4));
        }
    },
    get config() {
        return require(this.dirConfig);
    },
    set config(value) {
        if (utils.getType(value) === "Object") {
            var lastConfig = require(this.dirConfig);
            lastConfig = mergeObjectsPrimitives(lastConfig, value);
            fs.writeFileSync(this.dirConfig, JSON.stringify(lastConfig, null, 4));
        }
    },
    apis: null,
    Client: null
}

global.modules = {
    cmds: [],
    Reply: {},
    React: {},
    Schedule: {}
}

global.database = {
    model: {},
    cache: []
}

function watchAndDeleteCache(dir) {
    fs.watch(dir, (eventType) => {
        if (eventType === "change") {
            delete require.cache[dir];
        }
    });
}

watchAndDeleteCache(dirConfig);
watchAndDeleteCache(dirConfigCommands);

function compare(str_1, str_2) {
    var bool;
    var comparseString = string => {
        var [type, version] = string.split("-");
        version = Number(version.split(".").join(""));
        return { type, version }
    }

    var test_1 = comparseString(str_1);
    var test_2 = comparseString(str_2);

    if (test_1.version > test_2.version)
        bool = true;
    else if (test_1.version < test_2.version)
        bool = false;
    else if (test_1.type === "release" && test_2.type === "beta")
        bool = true;
    else if (test_1.type === "beta" && test_2.type === "release")
        bool = false;
    else
        bool = false;

    return bool;
}

if (config.systemOptions.autoRestart.enable && parseInt(config.systemOptions.autoRestart.timeMS) > 0) {
    log.info("process.restart", config.systemOptions.autoRestart.timeMS);
    setTimeout(process.exit, config.systemOptions.autoRestart.timeMS, 2);
}

(async () => {
    try {
        log.wall();
        const currentVersion = require("../package.json").version;
        const lastVersion = (await axios.get("https://raw.githubusercontent.com/GiaKhang1810/mira-bot-v1/main/package.json")).data.version;
        if (compare(lastVersion, currentVersion)) {
            log.warn("updater.newVersion", lastVersion, "https://github.com/GiaKhang1810/mira-bot-v1/");
        }

        await require("./apis")();
        if (config.facebookAPIsOptions.autoRefreshState) {
            fs.writeFileSync(path.join(global.mira.dir, config.facebookAccountOptions.facebookState), JSON.stringify(global.mira.apis.getAppState(), null, 2));
            log.info("facebook.refreshCookie", config.facebookAccountOptions.facebookState);
        }
        log.wall();
        await require("./database")();
        await require("./control")();
        return require("./dashboard");
    } catch (error) {
        console.error("Initialization error:", error);
    }
})();