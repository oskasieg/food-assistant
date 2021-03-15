import React from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IDish } from "../../containers/EatingPlans/types";
import { IStoreType } from "../../utils/store";
import styles from "./EatingPlan.module.scss";
import { IEatingPlanProps } from "./types";

const EatingPlan = ({ eatingPlan }: IEatingPlanProps) => {
  const date = useSelector((state: IStoreType) => state.eatingPlans.date);

  const paramDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  return (
    <div className={styles.EatingPlan}>
      <p className={styles.EatingPlan__title}>Śniadanie</p>
      {eatingPlan.breakfast.length === 0 && (
        <div className={styles.EatingPlan__dish} style={{ cursor: "default" }}>
          <Link to={`/eatingplan/edit/${paramDate}/breakfast`}>
            <FaPlus className={styles.EatingPlan__addButton} />
          </Link>
        </div>
      )}
      <Link
        to={`/eatingplan/edit/${paramDate}/breakfast`}
        className={styles.EatingPlan__dish}
      >
        {eatingPlan.breakfast.length > 0 &&
          eatingPlan.breakfast.map((dish: IDish, index: number) => (
            <p key={index} className={styles.EatingPlan__dishName}>
              {index + 1}. {dish.name}{" "}
              {dish.pieces && dish.pieces === 1 && <>({dish.weight}g) </>}
              {dish.pieces && dish.pieces > 1 && <>(x{dish.pieces}) </>}
              {dish.current_values
                ? dish.current_values.kcal
                : dish.values.kcal}
              kcal
            </p>
          ))}
      </Link>
      <p className={styles.EatingPlan__title}>Drugie śniadanie</p>
      {eatingPlan.brunch.length === 0 && (
        <div className={styles.EatingPlan__dish} style={{ cursor: "default" }}>
          <Link to={`/eatingplan/edit/${paramDate}/brunch`}>
            <FaPlus className={styles.EatingPlan__addButton} />
          </Link>
        </div>
      )}
      <Link
        to={`/eatingplan/edit/${paramDate}/brunch`}
        className={styles.EatingPlan__dish}
      >
        {eatingPlan.brunch.length > 0 &&
          eatingPlan.brunch.map((dish: IDish, index: number) => (
            <p key={index} className={styles.EatingPlan__dishName}>
              {index + 1}. {dish.name}{" "}
              {dish.pieces && dish.pieces > 1 && <>(x{dish.pieces}) </>}
              {dish.current_values
                ? dish.current_values.kcal
                : dish.values.kcal}
              kcal
            </p>
          ))}
      </Link>{" "}
      <p className={styles.EatingPlan__title}>Obiad</p>
      {eatingPlan.dinner.length === 0 && (
        <div className={styles.EatingPlan__dish} style={{ cursor: "default" }}>
          <Link to={`/eatingplan/edit/${paramDate}/dinner`}>
            <FaPlus className={styles.EatingPlan__addButton} />
          </Link>
        </div>
      )}
      <Link
        to={`/eatingplan/edit/${paramDate}/dinner`}
        className={styles.EatingPlan__dish}
      >
        {eatingPlan.dinner.length > 0 &&
          eatingPlan.dinner.map((dish: IDish, index: number) => (
            <p key={index} className={styles.EatingPlan__dishName}>
              {index + 1}. {dish.name}{" "}
              {dish.pieces && dish.pieces > 1 && <>(x{dish.pieces}) </>}
              {dish.current_values
                ? dish.current_values.kcal
                : dish.values.kcal}
              kcal
            </p>
          ))}
      </Link>{" "}
      <p className={styles.EatingPlan__title}>Deser</p>
      {eatingPlan.lunch.length === 0 && (
        <div className={styles.EatingPlan__dish} style={{ cursor: "default" }}>
          <Link to={`/eatingplan/edit/${paramDate}/lunch`}>
            <FaPlus className={styles.EatingPlan__addButton} />
          </Link>
        </div>
      )}
      <Link
        to={`/eatingplan/edit/${paramDate}/lunch`}
        className={styles.EatingPlan__dish}
      >
        {eatingPlan.lunch.length > 0 &&
          eatingPlan.lunch.map((dish: IDish, index: number) => (
            <p key={index} className={styles.EatingPlan__dishName}>
              {index + 1}. {dish.name}{" "}
              {dish.pieces && dish.pieces > 1 && <>(x{dish.pieces}) </>}
              {dish.current_values
                ? dish.current_values.kcal
                : dish.values.kcal}
              kcal
            </p>
          ))}
      </Link>{" "}
      <p className={styles.EatingPlan__title}>Kolacja</p>
      {eatingPlan.supper.length === 0 && (
        <div className={styles.EatingPlan__dish} style={{ cursor: "default" }}>
          <Link to={`/eatingplan/edit/${paramDate}/supper`}>
            <FaPlus className={styles.EatingPlan__addButton} />
          </Link>
        </div>
      )}
      <Link
        to={`/eatingplan/edit/${paramDate}/supper`}
        className={styles.EatingPlan__dish}
      >
        {eatingPlan.supper.length > 0 &&
          eatingPlan.supper.map((dish: IDish, index: number) => (
            <p key={index} className={styles.EatingPlan__dishName}>
              {index + 1}. {dish.name}{" "}
              {dish.pieces && dish.pieces > 1 && <>(x{dish.pieces}) </>}
              {dish.pieces && dish.pieces === 1 && <>({dish.weight}g) </>}
              {dish.current_values
                ? dish.current_values.kcal
                : dish.values.kcal}
              kcal
            </p>
          ))}
      </Link>
    </div>
  );
};

export default EatingPlan;
