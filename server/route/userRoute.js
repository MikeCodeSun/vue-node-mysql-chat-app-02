const router = require("express").Router();
const auth = require("../utils/auth");
const upload = require("../utils/multer");
const {
  register,
  login,
  logout,
  sendVerifyEmailCode,
  verifyEmailCode,
  getUserProfile,
  uploadImage,
  updateUser,
} = require("../controller/userController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify/:code").get(auth, verifyEmailCode);
// router.route("/verify/:emailtoken").get(verifyEmail);
router.route("/sendverifycode").get(auth, sendVerifyEmailCode);
router.route("/profile").get(auth, getUserProfile);
router.route("/uploadimage").post(upload.single("image"), auth, uploadImage);
router.route("/updateuser").patch(auth, updateUser);

module.exports = router;
