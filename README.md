# ECS Fargate NRPC Poc

![infrastructure](infra.png)

## Deployment

```sh
npm i
npm run build
cdk bootstrap
npm run deploy:all
```

## Load testing

### Setup

```sh
brew install k6
```

### Running

```sh
npm run test:load
```
