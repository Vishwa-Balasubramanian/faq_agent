"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const node_buffer_1 = require("node:buffer");
globalThis.File = node_buffer_1.File;
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function run() {
    try {
        const audioFileName = "Recording.m4a";
        const audioPath = path_1.default.resolve(audioFileName);
        if (!fs_1.default.existsSync(audioPath)) {
            throw new Error(`File not found: ${audioPath}`);
        }
        const file = fs_1.default.createReadStream(audioPath);
        const result = await client.audio.transcriptions.create({
            model: "gpt-4o-mini-transcribe",
            file,
            language: "de",
        });
        console.log("\nTranscription:\n");
        console.log(result.text);
        const outputData = {
            file: audioFileName,
            language: "de",
            model: "gpt-4o-mini-transcribe",
            transcription: result.text,
            timestamp: new Date().toISOString(),
        };
        const outputPath = path_1.default.resolve("transcription_output.json");
        fs_1.default.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), "utf-8");
        console.log(`\nSaved transcription to ${outputPath}`);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
run();
