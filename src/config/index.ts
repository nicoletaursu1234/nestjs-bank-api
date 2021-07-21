const { PORT, POSTGRES_PORT, POSTGRES_HOST } = process.env;

export const config = {
  server: {
    port: PORT,
  },
  db: {
    host: POSTGRES_HOST,
    port: +POSTGRES_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
