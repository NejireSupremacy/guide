# Configurando un linter

Como desarrollador, es una buena idea hacer que su proceso de desarrollo sea lo más ágil posible. Los linters comprueban la sintaxis y te ayudan a producir código consistente que sigue reglas de estilo específicas que puedes definir tú mismo o heredar de configuraciones existentes. Aunque no es obligatorio, instalar un linter te ayudará enormemente.

## Instalando un editor de código

En primer lugar, necesitarás un editor de código adecuado. Se desaconseja el uso de programas como Notepad y Notepad++, ya que son ineficaces para este tipo de proyectos. A continuación se enumeraran unos editores recomendados.

* [Visual Studio Code](https://code.visualstudio.com/) es una opción frecuente y es conocido por ser rápido y potente. Soporta varios lenguajes, tiene un terminal, soporte integrado de IntelliSense, y autocompletado tanto para JavaScript como para TypeScript. Es la opción recomendada y favorita por la comunidad.
* [Sublime Text](https://www.sublimetext.com/) es otro editor popular que es fácil de usar y escribir código.

## Instalando un linter

Install the [Módulo package](https://www.npmjs.com/package/eslint) inside your project directory.

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
npm install --save-dev eslint
```

:::
::: code-group-item yarn

```sh:no-line-numbers
yarn add eslint --dev
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
pnpm add --save-dev eslint
```

:::
::::

Una de las ventajas de los editores de código es su capacidad para integrar linters a través de plugins. Instala los plugins adecuados para el editor que elijas.

* [ESLint para Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [ESLint para Sublime Text](https://packagecontrol.io/packages/ESLint)

::: tip
Puedes ver los plugins directamente dentro de tu editor.

- Visual Studio Code: Presiona  `Ctrl + Shift + X`
- Sublime Text: Presiona `Ctrl + Shift + P` y busca por "Install Package" (disponible en [Package Control](https://packagecontrol.io/installation))

A continuación, busque el plugin adecuado e instálelo.
:::

## Configuración de las reglas de ESLint

ESLint puede mostrarte muchas advertencias y errores sobre tu código cuando empieces a usarlo, pero no dejes que esto te asuste. Para empezar, cree un archivo en el directorio de su proyecto llamado `.eslintrc.json` y copie el siguiente código en el archivo:

```json
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2021
	},
	"rules": {

	}
}
```

Esta es la base de cómo se verá un archivo ESLint. El objeto `rules` es donde definirá qué reglas quiere aplicar a ESLint. Por ejemplo, si quiere asegurarse de que nunca se salta un punto y coma, la regla `"semi": ["error", "always"]` es lo que querrá añadir dentro de ese objeto.

Puede encontrar una lista de todas las reglas de ESLint en [su sitio web](https://eslint.org/docs/rules) (Solamente en ingles). De hecho, hay muchas reglas, y puede ser abrumador al principio, así que si no quiere revisar todo por su cuenta todavía, puede usar estas reglas:

```json
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2021
	},
	"rules": {
		"arrow-spacing": ["warn", { "before": true, "after": true }],
		"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
		"comma-dangle": ["error", "always-multiline"],
		"comma-spacing": "error",
		"comma-style": "error",
		"curly": ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],
		"handle-callback-err": "off",
		"indent": ["error", "tab"],
		"keyword-spacing": "error",
		"max-nested-callbacks": ["error", { "max": 4 }],
		"max-statements-per-line": ["error", { "max": 2 }],
		"no-console": "off",
		"no-empty-function": "error",
		"no-floating-decimal": "error",
		"no-inline-comments": "error",
		"no-lonely-if": "error",
		"no-multi-spaces": "error",
		"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
		"no-shadow": ["error", { "allow": ["err", "resolve", "reject"] }],
		"no-trailing-spaces": ["error"],
		"no-var": "error",
		"object-curly-spacing": ["error", "always"],
		"prefer-const": "error",
		"quotes": ["error", "single"],
		"semi": ["error", "always"],
		"space-before-blocks": "error",
		"space-before-function-paren": ["error", {
			"anonymous": "never",
			"named": "never",
			"asyncArrow": "always"
		}],
		"space-in-parens": "error",
		"space-infix-ops": "error",
		"space-unary-ops": "error",
		"spaced-comment": "error",
		"yoda": "error"
	}
}
```

Los puntos principales de esta configuración serían:

* Permitir depurar con `console.log()`;
* Preferir el uso de `const` sobre `let` o `var`, así como no permitir `var`;
* Desaprobar variables con el mismo nombre en callbacks;
* Requerir comillas simples en lugar de dobles;
* Requerir punto y coma. Aunque no es obligatorio en JavaScript, se considera una de las mejores prácticas a seguir;
* Requerir que el acceso a las propiedades esté en la misma línea;
* Requerir que la separación se haga con tabs;
* Limitar las llamadas de retorno anidadas a 4. Si se encuentra con este error, es una buena idea considerar la refactorización de su código.

Si tu estilo de código actual es un poco diferente, o no te gustan algunas de estas reglas, ¡está perfectamente bien! Simplemente diríjase a [ESLint docs](https://eslint.org/docs/rules/) (Solamente en ingles), encuentre la(s) regla(s) que desea modificar, y cámbielas según corresponda.
