const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

const config = require("../../config/index");
const User = require("./user.model");
const auth = require("../../utils/auth");
const Verification = require("../models/verification.model");

// -> config
sgMail.setApiKey(
  "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"
);

// register
const signUp = async (req, res) => {
  if (!req.body.email || !req.body.login || !req.body.password) {
    return res.status(400).json({ message: "No data!" });
  }

  try {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exist!" });
    }

    const user = await User.create({
      email: req.body.email,
      login: req.body.login,
      password: req.body.password,
    });

    const verificationToken = await Verification.create({
      user_id: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    const msg = {
      to: req.body.email,
      from: "siegkrzysztof@gmail.com",
      subject: "Potwierdź rejestrację w aplikacji Food Assistant!",
      text: `Ostatni krok i będzie można dokończyć proces zakładania konta.\n
      Aby przejść dalej kliknij w poniższy link:\n
      http://localhost:${config.port}/user/confirmation/${verificationToken.user_id}/${verificationToken.token}\n
      Link jest dostępny przez 30 minut.`,
    };
    sgMail.send(msg).catch((error) => console.error(error));

    const token = auth.newToken(user);

    res.status(200).json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

// confirm register
const confirmRegister = async (req, res) => {
  const { user_id, token } = req.params;

  try {
    const verificationToken = await Verification.findOne({ token, user_id });
    if (!verificationToken) {
      return res.status(400).json({ message: "No valid token in database!" });
    }

    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).json({ message: "No user in database!" });
    }

    await user.updateOne({ isVerified: true });

    const tokenLogin = auth.newToken(user);

    res.redirect(`http://localhost:3000/register/${user._id}/${tokenLogin}`);
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

// send new mail
const sendNewEmail = async (req, res) => {
  if (!req.body.user_id || !req.body.email) {
    return res.status(400).json({ message: "No data" });
  }

  try {
    const user = await User.findOne({ _id: req.body.user_id });

    const verificationToken = await Verification.create({
      user_id: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    const msg = {
      to: req.body.email, // Change to your recipient
      from: "siegkrzysztof@gmail.com", // Change to your verified sender
      subject: "Confirm your account in [...] app!",
      text: `One more step and you will configure your account.\n
      Please click this link to activate your account:\n
      http://localhost:${config.port}/user/confirmation/${verificationToken.user_id}/${verificationToken.token}\n
      Link is available only for 30mins.`,
    };

    sgMail.send(msg).catch((error) => console.error(error));

    res.status(200).json({ message: "New email was sent!" });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

// login
const signIn = async (req, res) => {
  if (!req.body.login || !req.body.password) {
    res.status(400).json({ message: "No data!" });
  }

  try {
    const user = await User.findOne({ login: req.body.login }).exec();
    if (!user) return res.status(400).json({ message: "No user in database!" });

    if (user.googleId) {
      return res.status(400).json({ message: "User is registered by Google!" });
    }

    if (user.facebookId) {
      return res
        .status(400)
        .json({ message: "User is registered by Facebook!" });
    }

    const match = await user.checkPassword(req.body.password);
    if (!match) return res.status(400).json({ message: "Invalid password!" });

    const token = auth.newToken(user);
    res.status(200).json({ user, token });
  } catch (e) {
    console.error(e);
  }
};

// sign up with google
const signUpWithGoogle = async (req, res) => {
  if (
    !req.body.googleId ||
    !req.body.name ||
    !req.body.surname ||
    !req.body.email
  ) {
    return res.status(400).json({ message: "No access token!" });
  }

  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "User with thath email already exist!" });
    }

    const user = await User.create({
      ...req.body,
      login: req.body.email,
      isVerified: true,
      googleId: req.body.googleId,
    });

    const token = auth.newToken(user);

    res.status(200).json({ user, token });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

// sign in with Google
const signInWithGoogle = async (req, res) => {
  if (!req.body.googleId) {
    return res.status(400).json({ message: "No googleId!" });
  }

  try {
    const user = await User.findOne({ googleId: req.body.googleId });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with thath Google ID isn't exist!" });
    }

    const token = auth.newToken(user);

    res.status(200).json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

// sign up with Facebook
const signUpWithFacebook = async (req, res) => {
  if (
    !req.body.email ||
    !req.body.name ||
    !req.body.surname ||
    !req.body.avatar ||
    !req.body.facebookId
  ) {
    return res.status(400).json({ message: "No data!" });
  }

  try {
    const userExist = await User.findOne({ email: req.body.email });

    if (userExist) {
      return res
        .status(400)
        .json({ message: "User with thath Facebook ID already exist!" });
    }

    const user = await User.create({
      ...req.body,
      login: req.body.email,
      isVerified: true,
      facebookId: req.body.facebookId,
    });

    const token = auth.newToken(user);

    res.status(200).json({ user, token });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

// sign in with Facebook
const signInWithFacebook = async (req, res) => {
  if (!req.body.facebookId) {
    return res.status(400).json({ message: "No FacebookId!" });
  }

  try {
    const user = await User.findOne({ facebookId: req.body.facebookId });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with that Facebook ID isn't exist!" });
    }

    const token = auth.newToken(user);

    res.status(200).json({ token, user });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

// get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.payloadId });
    if (!user) return res.status(400).json({ message: "No user!" });

    res.status(200).json({ user });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

// edit profile
const editProfile = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.gender ||
    !req.body.age ||
    !req.body.weight_kg ||
    !req.body.height_cm
  ) {
    return res.status(400).json({ message: "No valid req.body!" });
  }

  try {
    const user = await User.findOne({ _id: req.payloadId });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist!" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User isn't verified!" });
    }

    const loginExist = await User.findOne({ login: req.body.login });
    if (loginExist) {
      return res.status(400).json({ message: "Login exist!" });
    }

    await user.updateOne(req.body);

    res.status(200).json(req.body);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

const editAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No File in request!" });
  }

  try {
    const avatar = `http://localhost:8001/images/${req.file.filename}`;

    const isUpdated = await User.findByIdAndUpdate(
      { _id: req.payloadId },
      { avatar }
    );
    if (!isUpdated) {
      return res.status(400).json({ message: "Can't edit avatar!" });
    }

    res.status(200).json({ avatar });
  } catch (e) {
    console.error(res.status(500).json({ message: "Server error!" }));
  }
};

module.exports = {
  editAvatar,
  getProfile,
  signIn,
  signUp,
  confirmRegister,
  editProfile,
  sendNewEmail,
  signUpWithGoogle,
  signInWithGoogle,
  signUpWithFacebook,
  signInWithFacebook,
};
