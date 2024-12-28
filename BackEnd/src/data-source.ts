import { DataSource } from "typeorm";
import "dotenv/config";

const port = parseInt(process.env.DB_PORT || "1433", 10);

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/entities/*.{ts,js}`],
    migrations: [`${__dirname}/migrations/*.{ts,js}`],
    synchronize: false,
    extra: {
        encrypt: false,
        trustServerCertificate: true,
    },
});
