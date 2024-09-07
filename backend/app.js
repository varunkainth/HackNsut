import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
const app = express();

app.use(
  express.json({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server is Running....");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
export default app;
