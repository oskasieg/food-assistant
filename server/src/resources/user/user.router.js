const Router = require("express");
const controllers = require("./user.controllers");
const auth = require("../../utils/auth");
const uploadFile = require("../../utils/files");

const router = Router();

// /user/login
router.route("/login").put((req, res) => {
  controllers.signIn(req, res);
});

// /user/register
router.route("/register").post((req, res) => {
  controllers.signUp(req, res);
});

// /user/register/mail
router.route("/register/mail").put(auth.protect, (req, res) => {
  controllers.sendNewEmail(req, res);
});

// /user/confirmation/:user_id/:token
router.route("/confirmation/:user_id/:token").get((req, res) => {
  controllers.confirmRegister(req, res);
});

// /user/register/google
router.route("/register/google").post((req, res) => {
  controllers.signUpWithGoogle(req, res);
});

// /user/login/google
router.route("/login/google").put((req, res) => {
  controllers.signInWithGoogle(req, res);
});

// /user/register/facebook
router.route("/register/facebook").post((req, res) => {
  controllers.signUpWithFacebook(req, res);
});

// /user/login/facebook
router.route("/login/facebook").put((req, res) => {
  controllers.signInWithFacebook(req, res);
});

// /user/profile/
router
  .route("/profile/")
  .get(auth.protect, (req, res) => {
    controllers.getProfile(req, res);
  })
  .put(auth.protect, (req, res) => {
    controllers.editProfile(req, res);
  });

router
  .route("/profile/avatar")
  .put(auth.protect, uploadFile.single("avatar"), (req, res) => {
    controllers.editAvatar(req, res);
  });

module.exports = router;
