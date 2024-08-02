import { Logger } from "../../infrastructure/drivers/logger.ts";

export class CreateVarName {
	private prefix: string = "";

	constructor() {}

	public setPrefix(prefix: string) {
		this.prefix = prefix;
		return this;
	}

	public generate() {
		return this.prefix + "_" + crypto.randomUUID().replace(/-/g, "");
	}
}
