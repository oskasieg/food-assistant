import React from "react";
import { ISummaryProps } from "./types";
import styles from "./Summary.module.scss";

import { useDispatch } from "react-redux";
import { editEatingPlanAction } from "../../containers/EatingPlans/actions";

const Summary = (props: ISummaryProps) => {
  const dispatcher = useDispatch();

  const { eatingPlan } = props;

  const addWater = () => {
    dispatcher(
      editEatingPlanAction({ ...eatingPlan, water: eatingPlan.water + 250 })
    );
  };

  return (
    <div className={styles.Summary}>
      <h3 className={styles.Summary__title}>Podsumowanie:</h3>
      <div className={styles.Summary__values}>
        <span>Kalorie: {eatingPlan.values && eatingPlan.values.kcal}</span>
        <span>
          Węglowodany: {eatingPlan.values && eatingPlan.values.carbohydrates}
        </span>
        <span>Białko: {eatingPlan.values && eatingPlan.values.protein}</span>
        <span>Tłuszcz: {eatingPlan.values && eatingPlan.values.fat}</span>
      </div>
      {eatingPlan.waterRequired > 0 && (
        <div
          className={styles.Summary__water}
          style={{ alignSelf: "flex-start" }}
        >
          <span>
            Woda: {eatingPlan.water} / {eatingPlan.waterRequired}ml
          </span>
          <button onClick={() => addWater()} type="button">
            + 250ml
          </button>
        </div>
      )}
    </div>
  );
};

export default Summary;
