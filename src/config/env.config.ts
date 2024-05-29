
export const EnvConfig = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
    defaultLimit: process.env.DEFAULT_LIMIT || 7,
});
