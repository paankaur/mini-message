import express from 'express';
import  sequelize  from './util/db.js';

const app = express();
const PORT = process.env.PORT || 3000;


sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => console.log("Unable to connect to DB", error));
// middleware
app.use(express.json());

// basic routes
app.get('/', (req, res) => {
    res.json({ message: 'mini-message server', status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});