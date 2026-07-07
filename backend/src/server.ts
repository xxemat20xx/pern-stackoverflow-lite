import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// routes
import authRoutes from './routes/auth.routes';
import questionRoutes from './routes/question.routes';
import answerRoutes from './routes/answer.routes';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/questions/:questionId/answers', answerRoutes) // <--nested under questions

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
});

