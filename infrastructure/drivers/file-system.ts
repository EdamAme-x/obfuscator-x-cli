import { join } from "@std/path";
import { Logger } from "./logger.ts";

function normalizePath(path: string) {
	return path.replace(/\\/g, "/");
}

export class FileSystem {
	private basePath: string;

	constructor(
		private logger: Logger,
		basePath: string,
	) {
		this.basePath = basePath;
	}

	public async saveFile(path: string, content: string) {
		const url = normalizePath(join(this.basePath, path));
		let isError = null;

		try {
			await Deno.stat(url);
			isError = false;
		} catch (_e) {
			isError = true;
		}

		if (!isError) {
			return () => {
				this.logger.log(`File already exists at ${path}`, "error");
				Deno.exit(1);
			};
		} else {
			return async () => {
				await Deno.writeTextFile(url, content);
				this.logger.log(`Obfuscated file created at ${path}`);
			};
		}
	}

	public async readFile(path: string) {
		const url = normalizePath(join(this.basePath, path));
		let isError = null;

		try {
			await Deno.stat(url);
			isError = false;
		} catch (_e) {
			isError = true;
		}

		if (isError) {
			return () => {
				this.logger.log(`File is not exist at ${path}`, "error");
				Deno.exit(1);
			};
		} else {
			return async () => {
				return await Deno.readTextFile(url);
			};
		}
	}
}
