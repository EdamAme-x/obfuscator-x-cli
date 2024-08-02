import { Obfuscate } from "./domain/usecases/obfuscate.ts";

if (import.meta.main) {
	const obfsucater = new Obfuscate(Deno.args, Deno.cwd());
	obfsucater.obfuscate();
}
