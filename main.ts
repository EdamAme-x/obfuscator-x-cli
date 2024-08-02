import { Obfuscate } from "./domain/usecases/obfuscate.ts";

if (import.meta.main) {
	const obfsucator = new Obfuscate(Deno.args, Deno.cwd());
	await obfsucator.obfuscate();
}
