import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "todoapp_2022_05_25",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

const app = express();

const corsOptions = {
  origin: "https://cdpn.io",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const appPort = 3000;

app.get(`/:user_code/todos`, async (req, res) => {
  const { user_code } = req.params;

  const [todoRows] = await pool.query(
    `
    SELECT *
    FROM todo
    WHERE user_code = ?
    ORDER BY id DESC
    `,
    [user_code]
  );

  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: todoRows,
  });
});

app.post(`/:user_code/todos`, async (req, res) => {
  const { user_code } = req.params;

  const { content, perform_date } = req.body;

  if (!content) {
    res.status(400).json({
      resultCode: "F-1",
      msg: "content required",
    });
    return;
  }

  if (!perform_date) {
    res.status(400).json({
      resultCode: "F-1",
      msg: "perform_date required",
    });
    return;
  }

  const [[lastTodoRow]] = await pool.query(
    `
    SELECT no
    FROM todo
    WHERE user_code = ?
    ORDER BY id DESC
    LIMIT 1
    `,
    [user_code]
  );

  const newNo = lastTodoRow?.no + 1 || 1;

  const [insertRs] = await pool.query(
    `
    INSERT INTO todo
    SET reg_date = NOW(),
    update_date = NOW(),
    user_code = ?,
    no = ?,
    content = ?,
    perform_date = ?
    `,
    [user_code, newNo, content, perform_date]
  );

  const [[justCreatedRow]] = await pool.query(
    `
    SELECT *
    FROM todo
    WHERE id = ?
    `,
    [insertRs.insertId]
  );

  res.status(201).json({
    resultCode: "S-1",
    msg: `${newNo}번 할일이 생성되었습니다.`,
    data: justCreatedRow,
  });
});

app.listen(appPort, () => {
  console.log(`App listening on port ${appPort}`);
});
