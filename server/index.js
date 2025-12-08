import express from "express";
import http from "http";
import sequelize from "./util/db.js";
import userRoutes from "./routes/user.js";
import emailRoutes from "./routes/email.js";
import loadModels from "./models/index.js";
import cors from "cors";
import { initSocket } from "./util/socket.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to DB");
    return loadModels();
  })
  .then(() => {
    console.log("Models loaded");
    //sync() with { force: true } to reset DB : sync({ force: true })
    return sequelize.sync();
  })
  .catch((error) => console.log("Unable to connect to DB", error));

app.get("/", (req, res) => {
  res.json({ message: "mini-message server", status: "ok" });
});

app.use("/", userRoutes);
app.use("/emails", emailRoutes);

const server = http.createServer(app);

initSocket(server).then(() => {
  // listen on all interfaces so the server is reachable on the LAN
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
});

export default app;