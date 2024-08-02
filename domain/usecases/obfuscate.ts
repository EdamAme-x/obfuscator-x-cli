import { FileSystem } from "../../infrastructure/drivers/file-system.ts";
import { Logger } from "../../infrastructure/drivers/logger.ts";
import { Arguments } from "../../infrastructure/gateways/arguments.ts";

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
		const text = await (await this.fileSystem.readFile(
			this.arguments.get(0),
		))();

		await (await this.fileSystem.saveFile(
			convertFileName(this.arguments.get(0)),
			text,
		))();
	}

	constructor(args: string[], basePath: string) {
		this.arguments.initlize(args, {
			length: 1,
		})(`Initializing...`);

		this.fileSystem = new FileSystem(this.logger, basePath);
	}
}
