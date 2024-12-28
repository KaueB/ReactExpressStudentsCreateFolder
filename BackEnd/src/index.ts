import 'express-async-errors'
import express from 'express'
import { AppDataSource } from './data-source'
import { errorMiddleware } from './middlewares/error'
import routes from './routes'
import cors from 'cors'
require('dotenv').config();

AppDataSource.initialize()
    .then(() => {
        const app = express();

        const corsOptions = {
            origin: 'http://localhost:5173',
        };
        app.use(cors(corsOptions));

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(routes);
        app.use(errorMiddleware);

        const PORT = process.env.PORT || 3001

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://${process.env.DB_HOST}:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar com o banco de dados', error);
    });
