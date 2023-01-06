const {
  sendMessage,
  getMessages,
  getUsers,
  searchUser,
} = require("../controller/messageController");

const router = require("express").Router();

router.route("/users").get(getUsers);
router.route("/user/search/:name").get(searchUser);
router.route("/:to").get(getMessages).post(sendMessage);

module.exports = router;
