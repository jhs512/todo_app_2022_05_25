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

app.patch(`/:user_code/todos/:no`, async (req, res) => {
  const { user_code, no } = req.params;

  const [[todoRow]] = await pool.query(
    `
    SELECT *
    FROM todo
    WHERE user_code = ?
    AND no = ?
    `,
    [user_code, no]
  );

  if (todoRow === undefined) {
    res.status(404).json({
      resultCode: "F-1",
      msg: "not found",
    });
    return;
  }

  let { content, perform_date, is_completed } = req.body;

  if (content === undefined) {
    content = todoRow.content;
  }

  if (perform_date === undefined) {
    perform_date = todoRow.perform_date;
  }

  if (is_completed === undefined) {
    is_completed = todoRow.is_completed;
  }

  const [rs] = await pool.query(
    `
    UPDATE todo
    SET update_date = NOW(),
    content = ?,
    perform_date = ?,
    is_completed = ?
    WHERE user_code = ?
    AND no = ?
    `,
    [content, perform_date, is_completed, user_code, no]
  );

  res.json({
    resultCode: "S-1",
    msg: `${no}번 할일이 수정되었습니다.`,
  });
});

app.listen(appPort, () => {
  console.log(`App listening on port ${appPort}`);
});
