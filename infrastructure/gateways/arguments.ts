import { Logger } from "../drivers/logger.ts";

export class Arguments {
	private args: string[] = [];

	constructor(
		private logger: Logger,
	) {}

	public initlize(args: string[], options: {
		length?: number;
		minLength?: number;
		maxLength?: number;
	} = {}) {
		if (options.length && args.length !== options.length) {
			return () => {
				this.logger.log(`Expected ${options.length} arguments, but ${args.length} given.`, "error");
				Deno.exit(1);
			};
		} else {
			if (options.minLength && args.length < options.minLength) {
				return () => {
					this.logger.log(
						`Expected at least ${options.minLength} arguments, but ${args.length} given.`,
						"error",
					);
					Deno.exit(1);
				};
			}

			if (options.maxLength && args.length > options.maxLength) {
				return () => {
					this.logger.log(
						`Expected at most ${options.maxLength} arguments, but ${args.length} given.`,
						"error",
					);
					Deno.exit(1);
				};
			}

			return (message: string) => {
				this.logger.log(message);
				this.args = args;
			};
		}
	}

	public get(index: number) {
		return this.args[index];
	}

	public get length() {
		return this.args.length;
	}
}
