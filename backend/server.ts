import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT 


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
import authRoutes from './router/auth.router';
import LinkRoutes from './router/link.router';


//Routes in use
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/links', LinkRoutes);





app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World with TypeScript and Express!' });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});