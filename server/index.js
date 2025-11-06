import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// basic routes
app.get('/', (req, res) => {
    res.json({ message: 'mini-message server', status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});