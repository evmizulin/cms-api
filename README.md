# Any JSON CMS - API server

If you want to read general information about Any JSON CMS go [here](https://github.com/evmizulin/any-json-cms).

Any JSON CMS consists of two parts. [Admin application server](https://github.com/evmizulin/cms-admin) and API server. It is API server.

### Installation

#### Step 1. Install the required dependencies.
- [MongoDb](https://www.mongodb.com/) v3+;
- [Sendmail](http://www.sendmail.org/);
- [Node.js](https://nodejs.org/) v8+;

#### Step 2. Install the API server.
```sh
git clone git@github.com:evmizulin/cms-api.git
cd cms-api
npm install
```

#### Step 3. Update configuration file.
In project root folder there are configuration file ```config.js```. Update it for your needs.
```js
module.exports = {
  config: {
    isDemo: true,
    email: 'email',
    devApiUrl: 'http://localhost:8080',
    prodApiUrl: 'prod-api-url',
    devAppUrl: 'http://localhost:3000',
    prodAppUrl: 'prod-app-url',
    devApiServerHost: 'localhost',
    prodApiServerHost: 'localhost',
    devApiServerPort: 8080,
    prodApiServerPort: 8080,
    devMongoDbUrl: 'mongodb://localhost:27017/cms',
    prodMongoDbUrl: 'mongodb://localhost:27017/cms',
  },
}
```
All parameters that have ```dev``` and ```prod``` prefixes, will be used for development and production environments respectively.

- ```isDemo``` - there are several limitations of functionality of demo server, set flag to false and it will take off limitations;
- ```email``` - this parameter will be passed as ```from``` for Sendmail to send mails;
- ```apiUrl``` - URL of this API server;
- ```appUrl``` - URL of [Admin application server](https://github.com/evmizulin/cms-admin);
- ```apiServerHost``` - this parameter will be passed as ```host``` to run Node.js server;
- ```apiServerPort``` - this parameter will be passed as ```port``` to run Node.js server;
- ```mongoDbUrl``` - this parameter will be passed to ```mongoose.connect``` function to connect MongoDb. [Read more](https://mongoosejs.com/docs/connections.html).

#### Step 4. Run API server.
To run API server in development environment:
```sh
npm start
```
You should see in console something like this:
```
2019-05-08T17:47:35.888Z listening on localhost:8080
```
To check if everything working fine, make:
```sh
curl http://localhost:8080/say-hello
```

To run API server in production environment:
```sh
npm run start.prod
```
You could see the logs in ```/logs``` folder.
