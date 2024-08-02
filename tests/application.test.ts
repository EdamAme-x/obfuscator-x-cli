import { assert } from "@std/assert";
import { getString } from "../application/usecases/global-var.ts";

Deno.test("getString", () => {
    const allString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0, len = allString.length; i < len; i++) {
        assert(Function("return " + getString(allString[i]))() === allString[i], `Missing at ${allString[i]}`);
    }
})