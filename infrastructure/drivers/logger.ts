import { blue, green, red } from "@ryu/enogu";

export class Logger {
	constructor() {}

	private currentDepth = 0;
	private createIndent(type: "log" | "error") {
		return "  ".repeat(this.currentDepth) + (type === "error" ? red : green)("-> ");
	}

	public setDepth(depth: number) {
		this.currentDepth = depth;
		return this;
	}

	public log(message: string, type: "log" | "error" = "log") {
		console.log(this.createIndent(type) + message);
	}

	public showTitle(text: string) {
		console.log(blue(text));
		console.log(`\n`);
	}
}
