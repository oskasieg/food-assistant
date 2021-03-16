import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EatingPlan from "../../components/EatingPlan/EatingPlan";
import Summary from "../../components/Summary/Summary";
import { IStoreType } from "../../utils/store";
import { changeEatingPlanDateAction, getEatingPlanAction } from "./actions";
import styles from "./EatingPlans.module.scss";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import useHiddenComponent from "../../hooks/useHiddenComponent";

const EatingPlans = () => {
  const dispatcher = useDispatch();

  const hidden = useHiddenComponent(100);

  const state = useSelector((state: IStoreType) => state);

  const eatingPlan = state.eatingPlans.eatingPlan;
  const isLogged = state.user.isLogged;
  const date = state.eatingPlans.date;

  const changeDate = (action: string) => {
    dispatcher(changeEatingPlanDateAction(action));
  };

  useEffect(() => {
    dispatcher(getEatingPlanAction(date));
  }, [date, dispatcher]);

  return (
    <div className={hidden ? styles.EatingPlansHidden : styles.EatingPlans}>
      {isLogged && (
        <>
          <h3 className={styles.EatingPlans__title}>Planowanie posiłków</h3>
          <div className={styles.EatingPlans__header}>
            <FaAngleDoubleLeft
              className={styles.EatingPlans__icon}
              onClick={() => changeDate("minus")}
            />
            <div className={styles.EatingPlans__text}>
              {date.toDateString()}
            </div>
            <FaAngleDoubleRight
              className={styles.EatingPlans__icon}
              onClick={() => changeDate("plus")}
            />
          </div>
          <EatingPlan eatingPlan={eatingPlan} />
          <Summary eatingPlan={eatingPlan} />
        </>
      )}
    </div>
  );
};

export default EatingPlans;
