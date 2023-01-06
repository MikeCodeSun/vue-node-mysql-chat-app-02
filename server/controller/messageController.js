const pool = require("../db/mysqlDB").promise();

const getMessages = async (req, res) => {
  const { to } = req.params;
  const { user } = res.locals;
  // console.log(user);
  // console.log(to);
  try {
    // check not send message to user self
    if (user.id === Number(to)) throw new Error("NO message to yourself");
    // check user exist
    const userResult = await pool.query("SELECT * FROM users WHERE id=?", [
      user.id,
    ]);
    if (userResult[0].length === 0) throw new Error("User not found");
    // check to user
    const toResult = await pool.query("SELECT * FROM users WHERE id=?", [to]);
    if (toResult[0].length === 0) throw new Error("To User not found");
    // select all message from user to to_user and from to_user to user
    const [rows, _] = await pool.query(
      "SELECT * FROM message WHERE (from_user=? AND to_user=?) OR (from_user=? AND to_user=?)",
      [user.id, to, to, user.id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { content } = req.body;
  const { user } = res.locals;
  const { to } = req.params;
  // console.log(user.id);
  // console.log(to);
  try {
    // check not send message to user self
    if (user.id === Number(to))
      throw new Error("Cant send message to yourself");
    // check user exist
    const userResult = await pool.query("SELECT * FROM users WHERE id=?", [
      user.id,
    ]);
    if (userResult[0].length === 0) throw new Error("User not found");
    // check to user
    const toResult = await pool.query("SELECT * FROM users WHERE id=?", [to]);
    if (toResult[0].length === 0) throw new Error("To User not found");

    // check message input content
    if (!content || content.trim() === "")
      throw new Error("Content must not be empty");
    // save message to db
    await pool.query(
      "INSERT INTO message (from_user, to_user, content) VALUES(?,?,?)",
      [user.id, to, content]
    );

    res.status(200).json({ content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  const { user } = res.locals;
  try {
    const [rows, _] = await pool.query(
      "SELECT u.* FROM users u LEFT JOIN message m ON u.id=m.from_user OR u.id=m.to_user WHERE (m.to_user=? OR m.from_user=?) AND u.id!=? GROUP BY u.id",
      [user.id, user.id, user.id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const searchUser = async (req, res) => {
  const { name } = req.params;
  const { user } = res.locals;
  // console.log(name);
  try {
    const userResult = await pool.query("SELECT * FROM users WHERE id=? ", [
      user.id,
    ]);
    // console.log(userResult[0][0].id);

    // search by name

    // const [rows, _] = await pool.query(
    //   "SELECT * FROM users WHERE name REGEXP ? AND id != ?",
    //   [name, userResult[0][0].id]
    // );
    const [rows, _] = await pool.query(
      "SELECT * FROM users WHERE name LIKE CONCAT('%', ?, '%') AND id != ?",
      [name, userResult[0][0].id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage, getUsers, searchUser };
