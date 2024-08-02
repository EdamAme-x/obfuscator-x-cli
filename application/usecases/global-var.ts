import { createVarName } from "./create-var-name.ts";

const stringMap = new Map(Object.entries({
	"a": "Array.toString()[12]",
	"b": "Object.toString()[10]",
	"c": "([]+Object.call)[9]",
	"d": "Object.bind.toString()[12]",
	"e": "[''].pop().concat(Object.toString()[12])",
	"f": "(([]+Object)[0]+[1]).substr(0,1)",
	"g": "String.fromCharCode((Object.toString().shift()).charCodeAt()+1)",
	"h": "String.fromCharCode((Object.toString()[0]).charCodeAt()+String.constructor('r'+Object.toString()[12]+'tur'+String.bind.toString()[11]+' '+atob('Mg==')).call())",
	"i": "['e','d','a','m','a','m','e','x'].toString.toString()[14]",
	"j": "String.fromCharCode(((0+[]).toString.toString()[14]).charCodeAt()+1)",
	"k": "String.fromCharCode(((0+[]).toString.toString()[14]).charCodeAt()+String.constructor('r'+Object.toString()[12]+'tur'+String.bind.toString()[11]+' '+atob('Mg==')).call())",
	"l": "String.fromCharCode(((0+[]).toString.toString()[14]).charCodeAt()+String.constructor('r'+Object.toString()[12]+'tur'+String.bind.toString()[11]+' '+atob('Mg==')).call()+[1].shift())",
	"m": "String.fromCharCode.toString()[12]",
	"n": "String.bind.toString()[11]",
	"o": "String.toString.toString()[10]",
	"p": "String.fromCodePoint.toString()[17].toLowerCase()",
	"q": "String.fromCharCode(String.fromCodePoint.toString()[17].toLowerCase().charCodeAt()+1)",
	"r": "String.toString.toString()[13]",
	"s": "String.toString.toString()[11].toLowerCase()",
	"t": "([]+String.toString)[12]",
	"u": "String.fromCharCode(String.toString.toString()[12].charCodeAt()+1)",
	"v": "String.fromCharCode(String.toString.toString()[12].charCodeAt()+String.constructor('r'+Object.toString()[12]+'tur'+String.bind.toString()[11]+' '+atob('Mg==')).call())",
	"w": "String.fromCharCode(String.toString.toString()[12].charCodeAt()+String.constructor('r'+Object.toString()[12]+'tur'+String.bind.toString()[11]+' '+atob('Mg==')).call()+[1][0])",
	"x": "String.fromCharCode(String.toString.toString()[12].charCodeAt()+String.constructor('r'+Object.toString()[12]+'tur'+String.bind.toString()[11]+' '+atob('Mg==')).call()+[2,1].length)",
	"y": "String.fromCharCode(String.toString.toString()[12].charCodeAt()+String.constructor('r'+Object.toString()[12]+'tur'+String.bind.toString()[11]+' '+atob('Mg==')).call()+[String.constructor('retur' + String.bind.toString()[11]+ ' ' +atob('Mw==')),1][0])",
	"z": "String.fromCharCode(String.toString.toString()[12].charCodeAt()+String.constructor('r'+Object.toString()[12]+'tur'+String.bind.toString()[11]+' '+atob('Mg==')).call()+[2,String.constructor('retur' + String.bind.toString()[11]+ ' ' +atob('Mg=='))].reduce((a,b)=>b+a,0))",
}));

function getString(string: string) {
	if (stringMap.has(string)) {
		return stringMap.get(string);
	} else if (stringMap.has(string.toLowerCase())) {
		return `${stringMap.get(string.toLowerCase())}.toUpperCase()`;
	}

	return string;
}

function obfuscateVariableName(variableName: string) {
	const ObfuscatedVariableNameStakc = [];

	for (let i = 0, len = variableName.length; i < len; i++) {
		ObfuscatedVariableNameStakc.push(getString(variableName[i]));
	}

	return `Number.constructor(atob("bnJ1dGVy").split("").reverse().join("")+[[" "].pop()].shift()+${
		ObfuscatedVariableNameStakc.join("+")
	})()`;
}

export class GlobalVariables {
	createdGlobalVariables: Map<string, string> = new Map();

	constructor(
		private createVarName: createVarName,
	) {}

	public createGlobalVariables(
		variableName: string,
	) {
		const generatedVariableName = this.createVarName.generate();
		const ObfuscatedVariableName = `(${obfuscateVariableName(variableName)})`;

		this.createdGlobalVariables.set(variableName, generatedVariableName);

		return `;${generatedVariableName}=${ObfuscatedVariableName};`;
	}
}
