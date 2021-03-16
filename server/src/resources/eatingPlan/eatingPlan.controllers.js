const EatingPlan = require("./eatingPlan.model");
const User = require("../user/user.model");

const addEatingPlan = async (req, res) => {
  try {
    // tworzenie daty jako String
    const date = `${new Date(req.body.date).getFullYear()}-${
      new Date(req.body.date).getMonth() + 1
    }-${new Date(req.body.date).getDate()}`;

    // pobranie informacji o uzytkowniku
    // wyliczenie odpowiedniej ilosci wody
    const user = await User.findOne({ _id: req.payloadId });
    if (!user) {
      return res.status(400).json({ message: "Couldn't find user!" });
    }

    const { weight_kg } = user;
    // 1500ml + 15ml na kazdy ponadmiarowy kg ciala > 20kg
    const waterRequired = 1500 + 15 * (weight_kg - 20);

    // obliczanie wartosci planu jedzenia
    const values = {
      fat: 0,
      kcal: 0,
      protein: 0,
      carbohydrates: 0,
    };

    req.body.breakfast.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    req.body.brunch.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    req.body.dinner.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    req.body.lunch.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    req.body.supper.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    values.kcal = Math.round(values.kcal * 100) / 100;
    values.fat = Math.round(values.fat * 100) / 100;
    values.carbohydrates = Math.round(values.carbohydrates * 100) / 100;
    values.protein = Math.round(values.protein * 100) / 100;

    const eatingPlanAdded = await EatingPlan.create({
      ...req.body,
      date,
      waterRequired,
      user_id: req.payloadId,
      values,
    });
    if (!eatingPlanAdded) {
      return res.status(400).json({ message: "Can't add eating plan!" });
    }

    res.status(200).json({ message: "You have added an eating plan!" });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const editEatingPlan = async (req, res) => {
  if (!req.params.date) {
    return res.status(400).json({ message: "Date in req.params is required!" });
  }

  try {
    // obliczanie wartosci planu jedzenia
    const values = {
      fat: 0,
      kcal: 0,
      protein: 0,
      carbohydrates: 0,
    };

    req.body.breakfast.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    req.body.brunch.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    req.body.dinner.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    req.body.lunch.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    req.body.supper.forEach((dish) => {
      if (dish.current_values) {
        values.kcal += dish.current_values.kcal;
        values.carbohydrates += dish.current_values.carbohydrates;
        values.protein += dish.current_values.protein;
        values.fat += dish.current_values.fat;
      } else {
        values.kcal += dish.values.kcal;
        values.carbohydrates += dish.values.carbohydrates;
        values.protein += dish.values.protein;
        values.fat += dish.values.fat;
      }
    });

    values.kcal = Math.round(values.kcal * 100) / 100;
    values.fat = Math.round(values.fat * 100) / 100;
    values.carbohydrates = Math.round(values.carbohydrates * 100) / 100;
    values.protein = Math.round(values.protein * 100) / 100;

    const eatingPlanUpdated = await EatingPlan.findOneAndUpdate(
      {
        date: req.params.date,
        user_id: req.payloadId,
      },
      { ...req.body, values }
    );
    if (!eatingPlanUpdated) {
      return res.status(400).json({ message: "Cant edit eating plan!" });
    }

    res.status(200).json({ message: "You have edited eating plan!" });
  } catch (e) {
    res.status(500).json({ message: "Server error!" });
    console.error(e);
  }
};

const getUserEatingPlan = async (req, res) => {
  if (!req.params.date) {
    return res.status(400).json({ message: "Date in req.params is required!" });
  }

  try {
    const eatingPlan = await EatingPlan.findOne({
      date: req.params.date,
      user_id: req.payloadId,
    });
    if (!eatingPlan) {
      return res.status(201).json({ message: "Eating plan doesn't exist!" });
    }

    res.status(200).json(eatingPlan);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error!" });
  }
};

module.exports = { addEatingPlan, editEatingPlan, getUserEatingPlan };
