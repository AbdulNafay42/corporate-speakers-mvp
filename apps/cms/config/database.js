module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "forum"),
      user: env("DATABASE_USERNAME", "forum"),
      password: env("DATABASE_PASSWORD"),
      ssl: env.bool("DATABASE_SSL", false)
        ? { rejectUnauthorized: true }
        : false,
    },
    pool: { min: 0, max: 10 },
    acquireConnectionTimeout: 60000,
  },
});
