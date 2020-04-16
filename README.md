# ECS Fargate NRPC Poc

![infrastructure](infra.png)

## Deployment

```sh
npm i
npm run build
cdk bootstrap
npm run deploy
```

## Load testing

### Setup

```sh
brew install k6
```

### Running

`cdk deploy` によりデプロイされたエンドポイントになるように `test/load.js` の `BASE_PATH` を修正して、下記を実行する。  

```sh
npm run test:load
```

## Cleanup

```sh
npm run destroy
```
