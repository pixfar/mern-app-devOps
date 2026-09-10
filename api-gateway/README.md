## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Before Push Code Please Verify the code with give command

```

npm run lint -- --fix
npm run format
npm run format:check
npm run test

```


Updates
Logger Included
Setting route included
if settings is not avaliable then it will return some hardcoded value
creadit payment intend calculated by settings value
credit purchase intent calculated by settings value
no need to send the "numberOfCredit" value with "purchased-credit/payment-details" this route
