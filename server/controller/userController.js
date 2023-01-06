const userInputValidator = require("../utils/checkUserValidator");
const poolPromise = require("../db/mysqlDB").promise();
const bcrypt = require("bcryptjs");
const setCookie = require("../utils/setCookie");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendVerifyEmail");
const verifyToken = require("../utils/verifyToken");
const makeRandomString = require("../utils/generateRandomString");
const resize = require("../utils/sharpResize");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

// register user
const register = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // check user input
    const { valid, errors } = userInputValidator("register", {
      name,
      password,
      email,
    });
    if (!valid) throw errors;
    // hash password
    const hasnPassword = await bcrypt.hash(password, 10);

    // insert user registerf to db if name || email taken will throw err from query
    const [rows, _] = await poolPromise.query(
      "INSERT INTO users (name, email, password) VALUES(?,?,?) ",
      [name, email, hasnPassword]
    );
    // console.log(rows.insertId);
    // const verifyEmailToken = generateToken(
    //   rows.insertId,
    //   ...Array(3),
    //   process.env.EMAIL_VERIFY_SECRET,
    //   "7d"
    // );
    // send verify email to register email
    // await sendEmail(email, verifyEmailToken);

    res.status(200).json({
      status: true,
      message: "register successfully! please check email to verify account",
    });
  } catch (error) {
    console.log(error);
    if (error.errno === 1062) {
      const errorName = error.sqlMessage.split("users.")[1].slice(0, -1);
      res
        .status(500)
        .json({ [errorName]: `${errorName} is already taken, please change!` });
      return;
    }
    res.status(500).json(error);
  }
};

// login user
const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const { valid, errors } = userInputValidator("login", { name, password });
    if (!valid) throw errors;

    // check user name is registered?
    const [rows, _] = await poolPromise.query(
      "SELECT * FROM users WHERE name = ?",
      [name]
    );
    // console.log(rows);
    if (rows.length === 0) throw { name: "user name not register!" };
    const dbUser = rows[0];
    // compare password. 1128
    const match = await bcrypt.compare(password, dbUser.password);
    if (!match) throw { password: "user password is wrong!" };

    // if (dbUser.verify === 0) {
    //   res
    //     .status(200)
    //     .json({ verify: false, message: "please verify email address" });
    //   return;
    // }

    // jwt token
    const token = generateToken(
      dbUser.id,
      dbUser.name,
      dbUser.email,
      dbUser.avatar,
      dbUser.verify,
      process.env.SECRET,
      "1d"
    );

    setCookie(
      res,
      "token",
      token,
      "localhost",
      "/",
      false,
      false,
      3600 * 24 * 1000
    );
    res.status(200).json({ status: true, message: "Login successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// log out user
const logout = (req, res) => {
  try {
    setCookie(res, "token", "", "localhost", "/", false, true, -1);
    res.status(200).json({ status: true, message: "User logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong!" });
  }
};

// verify email address
// const verifyEmail = async (req, res) => {
//   const { emailtoken } = req.params;

//   try {
//     // jwt decode veriy token
//     const decoded = verifyToken(emailtoken, process.env.EMAIL_VERIFY_SECRET);
//     // token ok then set account verify to true
//     await poolPromise.query("UPDATE users SET verify=true WHERE id=?", [
//       decoded.id,
//     ]);

//     res.status(200).json({ status: true, message: "acount verify" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Somethin went wrong.." });
//   }
// };

// send verify email code
const sendVerifyEmailCode = async (req, res) => {
  const { user } = res.locals;
  const verifyCode = makeRandomString(6);
  console.log(user);

  try {
    if (user.verify === 1) {
      throw new Error("User email verify already!");
    }
    await poolPromise.query(
      "INSERT INTO verify_code (code,userId) VALUES (?,?)",
      [verifyCode, user.id]
    );
    await sendEmail(user.email, verifyCode);

    res.status(200).json({ message: "send code to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// verify code
const verifyEmailCode = async (req, res) => {
  const { code } = req.params;
  const { user } = res.locals;

  try {
    // get user foreign key with code
    const [rows, _] = await poolPromise.query(
      "SELECT * FROM users u LEFT JOIN verify_code vc ON u.id=vc.userId where vc.code = ?",
      [code]
    );
    // check
    if (rows.length === 0) {
      throw new Error("Wrong code");
    }
    if (rows[0].email !== user.email) {
      throw new Error("Not allow to verify other user email");
    }
    if (rows[0].verify === 1) throw new Error("Email already verify");

    await poolPromise.query("UPDATE users SET verify = ? WHERE id=?", [
      1,
      user.id,
    ]);
    await poolPromise.query("DELETE FROM verify_code WHERE userId=?", [
      user.id,
    ]);

    res.status(200).json({ message: "verify email code" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const { user } = res.locals;
  try {
    const [rows] = await poolPromise.query("SELECT * FROM users WHERE id=?", [
      user.id,
    ]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
// 1226 upload image
const uploadImage = async (req, res) => {
  const file = req.file;
  const { user } = res.locals;
  // console.log(file);
  const filePath = path.join(__dirname, "..", "public/image");
  try {
    // check is have file upload
    if (!file) throw new Error("No file uploaded");
    const [rows, _] = await poolPromise.query(
      "SELECT * FROM users WHERE id = ?",
      [user.id]
    );
    // check file is type of image
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg"
    ) {
      throw new Error("Image type not right!");
    }
    if (rows[0].avatar) {
      // check user is already set avatar image, if delete old image
      fs.unlinkSync(`${filePath}/${rows[0].avatar}`);
    }
    // save new image
    const fileName = await resize(file.buffer);
    // save new image name to  db
    await poolPromise.query("UPDATE users SET avatar=? WHERE id=?", [
      fileName,
      user.id,
    ]);

    res.status(200).json({ message: "upload image successfully!", fileName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const updateUser = async (req, res) => {
  const { user } = res.locals;
  const { name } = req.body;
  try {
    if (!name || name.trim() === "") throw new Error("Invalid Name");
    const [rows, _] = await poolPromise.query(
      "SELECT * FROM users WHERE id=?",
      [user.id]
    );
    if (rows.length === 0) throw new Error("User not exist");
    await poolPromise.query("UPDATE users SET name=? WHERE id=?", [
      name,
      user.id,
    ]);
    res.status(200).json({ message: "Update successfully!", name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUserProfile,
  sendVerifyEmailCode,
  verifyEmailCode,
  uploadImage,
  updateUser,
};
