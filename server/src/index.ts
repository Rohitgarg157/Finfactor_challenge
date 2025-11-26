import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { APP_CONFIG } from './config';
import mealsRouter from './routes/meals';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/meals', mealsRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(APP_CONFIG.port, () => {
  console.log(`TheMealDB Explorer API running on port ${APP_CONFIG.port}`);
});

