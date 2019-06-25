const myEnv = {};

myEnv.ENVIRONMENT = 'production'
myEnv.PORT = 5001;
myEnv.GET_BASE_URL = () => myEnv.ENVIRONMENT !== 'development' ? 'https://arbiter-stocks.herokuapp.com' : `https://localhost:${myEnv.PORT}`;
myEnv.BASE_URL = myEnv.GET_BASE_URL();

export default myEnv;