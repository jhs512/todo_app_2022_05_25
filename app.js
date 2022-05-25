import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "https://cdpn.io",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const appPort = 3000;

app.get(`/todos`, (req, res) => {
  return res.json([
    {
      id: 2,
    },
    {
      id: 1,
    },
  ]);
});

app.listen(appPort, () => {
  console.log(`App listening on port ${appPort}`);
});
