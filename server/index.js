import express from "express";
import sequelize from "./util/db.js";
import userRoutes from "./routes/user.js";
import loadModels from "./models/index.js";

const app = express();
const PORT = 3000;

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to DB");
    return loadModels();
  })
  .then(() => {
    console.log("Models loaded");
    return sequelize.sync();
  })
  .catch((error) => console.log("Unable to connect to DB", error));

app.get("/", (req, res) => {
  res.json({ message: "mini-message server", status: "ok" });
});

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;