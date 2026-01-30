import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.post("/assignments", async (req, res) => {
  try {
    const { title, content, category, user_id } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        message:
          "Server could not create assignment because there are missing data from client",
      });
    }

    await connectionPool.query(
      `
      INSERT INTO assignments (title, content, category, user_id, status)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [title, content, category, user_id || null, "draft"]
    );

    return res.status(201).json({
      message: "Created assignment sucessfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Server could not create assignment because database connection",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
