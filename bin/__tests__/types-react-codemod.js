const { describe, expect, test } = require("@jest/globals");
const childProcess = require("child_process");
const path = require("path");
const { promisify } = require("util");

describe("types-react-codemod", () => {
	const exec = promisify(childProcess.exec);
	const typesReactCodemodBin = path.join(
		__dirname,
		"../types-react-codemod.cjs",
	);
	function execTypesReactCodemod(args) {
		return exec(`${typesReactCodemodBin} ${args}`, {});
	}

	test("provides help", async () => {
		await expect(execTypesReactCodemod("--help")).resolves
			.toMatchInlineSnapshot(`
		{
		  "stderr": "",
		  "stdout": "types-react-codemod <codemod> <paths...>

		Positionals:
		  codemod  [string] [required] [choices: "context-any", "deprecated-legacy-ref",
		                        "deprecated-prop-types-types", "deprecated-react-child",
		                     "deprecated-react-fragment", "deprecated-react-node-array",
		     "deprecated-react-text", "deprecated-react-type", "deprecated-sfc-element",
		                             "deprecated-sfc", "deprecated-stateless-component",
		                      "deprecated-void-function-component", "implicit-children",
		                    "no-implicit-ref-callback-return", "preset-18", "preset-19",
		          "react-element-default-any-props", "refobject-defaults", "scoped-jsx",
		                          "useCallback-implicit-any", "useRef-required-initial"]
		  paths                                                      [string] [required]

		Options:
		  --version         Show version number                                [boolean]
		  --help            Show help                                          [boolean]
		  --dry                                               [boolean] [default: false]
		  --ignore-pattern                      [string] [default: "**/node_modules/**"]
		  --yes             Automatically accepts all prompts. Useful when no user input
		                    is available or desired.          [boolean] [default: false]
		  --verbose                                           [boolean] [default: false]

		Examples:
		  types-react-codemod preset-18 ./          Ignores \`node_modules\` and \`build\`
		  --ignore-pattern                          folders
		  "**/{node_modules,build}/**"
		",
		}
	`);
	});

	test("provides its version", async () => {
		const { version } = require("../../package.json");
		const { stdout } = await execTypesReactCodemod("--version");
		expect(stdout.trim()).toBe(version);
	});

	test("can execute jscodeshift", async () => {
		const fixture = path.resolve(__dirname, "./__fixtures__/smoke-test");
		// Does't matter which transform as long as it is one that doesn't change code in the fixture
		const { stderr } = await execTypesReactCodemod(`context-any ${fixture}`);

		// Everything ok
		expect(stderr).toMatchInlineSnapshot(`""`);
	});

	test("can execute all default preset-18 codemods without prompt", async () => {
		const fixture = path.resolve(__dirname, "./__fixtures__/smoke-test");
		// Does't matter which transform as long as it is one that doesn't change code in the fixture
		const { stderr, stdout } = await execTypesReactCodemod(
			`--yes preset-18 ${fixture}`,
		);

		// Everything ok
		expect(stderr).toMatchInlineSnapshot(`""`);
		expect(stdout).toContain(
			`--preset18Transforms="deprecated-react-type,deprecated-sfc-element,deprecated-sfc,deprecated-stateless-component"`,
		);
	});

	test("can execute all default preset-19 codemods without prompt", async () => {
		const fixture = path.resolve(__dirname, "./__fixtures__/smoke-test");
		// Does't matter which transform as long as it is one that doesn't change code in the fixture
		const { stderr, stdout } = await execTypesReactCodemod(
			`--yes preset-19 ${fixture}`,
		);

		// Everything ok
		expect(stderr).toMatchInlineSnapshot(`""`);
		expect(stdout).toContain(
			`--preset19Transforms="deprecated-legacy-ref,deprecated-prop-types-types,deprecated-react-child,deprecated-react-node-array,deprecated-react-fragment,deprecated-react-text,deprecated-void-function-component,no-implicit-ref-callback-return,react-element-default-any-props,refobject-defaults,scoped-jsx,useRef-required-initial"`,
		);
	});
});
