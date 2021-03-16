const Router = require("express");
const auth = require("../../utils/auth");
const {
  addEatingPlan,
  getUserEatingPlan,
  editEatingPlan,
} = require("./eatingPlan.controllers");

const router = Router();

// /eating_plan

// dodawanie
router.route("/").post(auth.protect, (req, res) => {
  addEatingPlan(req, res);
});

// pobieranie
router.route("/:date").get(auth.protect, (req, res) => {
  getUserEatingPlan(req, res);
});

// edycja
router.route("/:date").put(auth.protect, (req, res) => {
  editEatingPlan(req, res);
});

module.exports = router;
