import express from 'express';
import cors from 'cors';
import scrapeRoutes from './routes/scrapeRoutes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/', scrapeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});