import { CreateVarName } from "../../application/usecases/create-var-name.ts";
import { GlobalVariables } from "../../application/usecases/global-var.ts";
import { FileSystem } from "../../infrastructure/drivers/file-system.ts";
import { Logger } from "../../infrastructure/drivers/logger.ts";
import { Arguments } from "../../infrastructure/gateways/arguments.ts";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import { default as jsObfuscator } from "javascript-obfuscator";

const traverse = _traverse.default;

function convertFileName(filePath: string) {
	const splittedPath = filePath.split("/");
	splittedPath.reverse();
	splittedPath[0] = splittedPath[0] + ".obfx";

	return splittedPath.reverse().join("/");
}

export class Obfuscate {
	private logger: Logger = new Logger();
	private arguments: Arguments = new Arguments(this.logger);
	private fileSystem: FileSystem;

	public async obfuscate() {
		let script = await (await this.fileSystem.readFile(
			this.arguments.get(0),
		))();

        const logger = this.logger;

        logger.log("Obfuscating script");

        logger.setDepth(1).log("Initializing create variables");
		const createVarName = new CreateVarName();
        logger.setDepth(2).log("Initialized create variables");

        logger.setDepth(1).log("Initializing global variables");
		const globalVariables = new GlobalVariables(createVarName);
        logger.setDepth(2).log("Initialized global variables");

        logger.setDepth(1).log("Injecting anti boolean tracker");
        const symbolKeyName = "$x_symbol";
        const trueKeyName = "$x_" + crypto.randomUUID().replace(/-/g, "");
        const falseKeyName = "$x_" + crypto.randomUUID().replace(/-/g, "");

        script = `;globalThis.${symbolKeyName}=Symbol();globalThis.${symbolKeyName + "_map"}={[globalThis.${symbolKeyName}]:{"${trueKeyName}":(_x)=>(((new Date())*1)>_x),"${falseKeyName}":(_x)=>(((new Date())*1)>(-1*_x))}};${script}`
        logger.setDepth(2).log("Injected anti boolean tracker");

        logger.setDepth(1).log("Searching global variables");

		const whiteListOfGlobalVariables = [
			"window",
			"document",
			"navigator",
			"screen",
			"localStorage",
			"sessionStorage",
			"indexedDB",
			"globalThis",
			"self",
			"globalThis",
			"fs",
			"path",
			"crypto",
            "btoa",
            "atob",
            "encodeURI",
            "decodeURI",
            "encodeURIComponent",
            "decodeURIComponent",
            "setTimeout",
            "clearTimeout",
            "setInterval",
            "clearInterval",
            "setImmediate",
            "clearImmediate",
            "console",
            "FormData",
            "Headers",
            "Request",
            "globalThis",
            "Math",
            "Object",
            "Promise",
            "Reflect",
            "Set",
            "Map",
            "Symbol",
            "WeakMap",
            "WeakSet",
            "Array",
            "Boolean",
            "Date",
            "Error",
            "Function",
            "JSON",
            "Number",
            "RegExp",
            "String",
            "fetch",
            "eval",
		];

		const ast = parse(script, {
			sourceType: "module",
			allowImportExportEverywhere: true,
		});

        logger.setDepth(2).log("Parsed script");


		traverse(ast, {
            Identifier(path: { node: { name: string } }) {
                if (whiteListOfGlobalVariables.includes(path.node.name) && !globalVariables.createdGlobalVariables.has(path.node.name)) {
                    logger.setDepth(3).log(`Found global variable: ${path.node.name}`);
                    script = `;${globalVariables.createGlobalVariables(path.node.name)};${script}`;
                }
            },
            CallExpression(path: { node: { callee: { name: string } } }) {
                if (whiteListOfGlobalVariables.includes(path.node.callee.name) && !globalVariables.createdGlobalVariables.has(path.node.callee.name)) {
                    logger.setDepth(3).log(`Found global variable: ${path.node.callee.name}`);
                    script = `;${globalVariables.createGlobalVariables(path.node.callee.name)};${script}`;
                }
            }
		});

        logger.setDepth(2).log("Traversed script");

        logger.setDepth(1).log("Obfuscating with Javascript obfuscator");

        script = jsObfuscator.obfuscate(script, {
            compact: true,
            controlFlowFlattening: false,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: false,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: 5,
            disableConsoleOutput: false,
            domainLock: [],
            forceTransformStrings: [],
            identifierNamesCache: null,
            identifierNamesGenerator: 'mangled-shuffled',
            identifiersDictionary: [],
            identifiersPrefix: '$x',
            ignoreImports: false,
            inputFileName: '',
            log: false,
            numbersToExpressions: true,
            optionsPreset: 'default',
            renameGlobals: false,
            renameProperties: true,
            renamePropertiesMode: 'safe',
            reservedNames: [],
            reservedStrings: [],
            seed: Math.round(Math.random() * 100),
            selfDefending: true,
            simplify: false,
            sourceMap: false,
            sourceMapBaseUrl: '',
            sourceMapFileName: '',
            sourceMapMode: 'separate',
            sourceMapSourcesMode: 'sources-content',
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayCallsTransformThreshold: 0.5,
            stringArrayEncoding: [
              "base64",
              "rc4"
            ],
            stringArrayIndexesType: [
              'hexadecimal-number',
              'hexadecimal-numeric-string'
            ],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 3,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 5,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 0.75,
            target: 'browser',
            transformObjectKeys: true,
            unicodeEscapeSequence: true
          }).getObfuscatedCode();

        logger.setDepth(2).log("Finished obfuscating");

        logger.setDepth(0);
        
		await (await this.fileSystem.saveFile(
			convertFileName(this.arguments.get(0)),
			script,
		))();
	}

	constructor(args: string[], basePath: string) {
		this.arguments.initlize(args, {
			length: 1,
		})(`Initializing...`);

		this.fileSystem = new FileSystem(this.logger, basePath);
	}
}
