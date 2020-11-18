# [WIP] Step-by-step Cheatsheet

Wrote by Lucas Coelho.
This is a reference for achieving this project as a result.
Initializing a node project and a git repository:

```shell script
mkdir sample-project && cd sample-project
yarn init
git init
```

```
touch .gitignore
vim .gitignore

// .gitignore
dist/
node_modules/
```

Adding the HTML

```
cd publlic
touch index.html
vim index.html

// index.html
<!-- original: https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html -->
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>React from scratch</title>
</head>

<body>
  <div id="root"></div>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  <script src="../dist/bundle.js"></script>
</body>

</html>
```

Babel setup

```
cd ..
yarn add -D @babel/core @babel/cli @babel/preset-env @babel/preset-react babel-jest

touch .babelrc

{
  "presets": ["@babel/env", "@babel/preset-react"]
}
```

Webpack setup

```
yarn add -D webpack webpack-cli webpack-dev-server style-loader css-loader babel-loader
touch webpack.config.js && vim webpack.config.js

const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
```

entry avisa ao webpack onde a nossa aplicação “começa”
a outra linha se refere ao que estamos em desenvolvimento, sem ter que passar uma flag avisando isso

o objeto module ajuda a definir como os módulos feitos em javascript vão ser alterados e quais
estão inclusos, a partir da array de regras.

por ex, a primeira regra ela itera a partir de um regex no formato dos arquivos,
se eles estiverem fora da pasta `node_modules`, e avisarmos que queremos usar o preset babel env,
que é o que permite a usarmos as versões mais atuais do ecmascript em navegadores que não
suportam, como null coalescing e optional chaining.

a segunda regra busca por arquivos no formato css e aplica o style loader e o css loader neles

`Resolve` define quais extensões o webpack vai resolver, isso nos permite importar módulos sem ter que
ficar adicionando as extensões deles

o output nos diz em que caminho e arquivo vamos gerar nosso bundle, public path é onde vamos colocar o bundle e de onde o webpack-dev-server vai servir os arquivos.

e aí a gente define o webpack-dev-server no objeto devServer, que avisa onde ficam os arquivos estáticos, a porta a ser usada, o caminho dos arquivos do bundle e tal.

e por último nos plugins a gente adiciona um do próprio webpack que gera o hot reloading pra gente

Mas só adicionar esse HotModuleReplacement, não resolve. Se a gente pudesse rodar o projeto agora,
nenhuma mudança ia sofrer o hot reloading. Isso pq a gente precisa deixar explícito o que vai ser
atualizado.

Setup hot reloading

```
yarn add react react-dom@npm:@hot-loader/react-dom react-hot-loader

touch src/index.js
vim src/index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
ReactDOM.render(<App />, document.getElementById("root"));
```

Explicar sobre o id root e tal

```
touch src/App.js
vim src/App.js

import { hot } from "react-hot-loader/root";
import React from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "black",
  color: "white",
  fontFamily: "Arial",
};

const App = () => {
  return (
    <div className="App" style={containerStyle}>
      <h1 data-testid="page-title">So long, and thanks for all the 🐟</h1>
    </div>
  );
};

export default hot(App);
```

Setup jest e testing library

```
yarn add -D jest babel-jest react-test-renderer @testing-library/react identity-obj-proxy

identity obj proxy
```

package.json

```
"jest": {
    "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    }
  }
```

touch src/App.test.js && vim src/App.test.js

```
// src/App.test.js
import React from "react";
import App from "./App.js";
import { render } from "@testing-library/react";

it("should render title", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId("page-title")).toBeDefined();
});

```

Basic scripts:

```
// package.json
"scripts": {
  "start": "webpack serve --mode development",
  "test": "jest"
}
```

Setup linter e prettier:

```
yarn add -D eslint eslint-plugin-import eslint-plugin-react eslint-webpack-plugin
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier

touch .eslintrc
// .eslintrc
{
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "settings": {
    "react": {
      "createClass": "createReactClass",
      "pragma": "React",
      "fragment": "Fragment",
      "version": "detect"
    }
  },
  "ignorePatterns": ["dist/bundle.js"],
  "plugins": ["import"],
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "import/first": "error",
    "quotes": "warn",
    "prettier/prettier": "warn"
  }
}


// .prettierrc
{
  "printWidth": 85,
  "arrowParens": "always",
  "semi": true,
  "tabWidth": 2,
}

```

Setup husky

```
yarn add -D husky

// package.json
"husky": {
    "hooks": {
      "pre-commit": “yarn lint && yarn format"
    }
  }
```

Com isso temos a validação do linter e prettier quando formos realizar um commit.

Por último, mas definitivamente não menos importante: precisamos de um script para gerar o nosso bundle, a build
do projeto.

Então voltando ao `package.json`, podemos ir até o campo `scripts` e adicionar o build:

```
"build": "webpack --mode development"
```

Podemos mudar esse development para production quando quisermos "distribuir" o projeto.
