
export default () => ({
    jwt: {secret: process.env.JWT_SECRET},
    database: {connectionstring: process.env.MONGO_URI}
});