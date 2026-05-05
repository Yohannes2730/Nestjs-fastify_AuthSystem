export default () => ({
  jwt: { secret: process.env.JWT_SECRET },
  database: { connectionString: process.env.MONGO_URI } 
});

//this is the baset practice