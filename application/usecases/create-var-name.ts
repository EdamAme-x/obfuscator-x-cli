import { Logger } from "../../infrastructure/drivers/logger.ts";

export class createVarName {
	private prefix: string = "";

	constructor(
		private logger: Logger,
	) {}

	public setPrefix(prefix: string) {
		this.prefix = prefix;
		return this;
	}

	public generate() {
		return this.prefix + "_" + crypto.randomUUID().replace(/-/g, "");
	}
}
