import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from "cors";
import swaggerRouter from './api/swagger';
import userRouter from './api/userRouter';
import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../domain/error/DomainError';
import healthRouter from './api/healthRouter';
import { authMiddleware } from './api/authMiddleware';
import { metricsMiddleware } from './api/metricsMiddleware';
import { metricsRouter } from './api/metricsRouter';

const app = express();
app.use(express.json());
app.use(cors());

// Middleware de métricas (antes de todas as rotas)
app.use(metricsMiddleware);

//Rotas
app.use(authMiddleware);
app.use(metricsRouter);
app.use(userRouter);
app.use(healthRouter);
app.use(swaggerRouter);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (err instanceof DomainError) {
        res.status(400).json({ message: err.message });
        return;
    }

    res.status(500).send({ message: 'Ocorreu um erro inesperado.' });
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Métricas disponíveis em http://localhost:${PORT}/metrics`);
    console.log(`📋 Swagger disponível em http://localhost:${PORT}/api-docs`);
});