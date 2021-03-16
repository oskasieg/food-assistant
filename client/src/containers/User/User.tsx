import React, { useEffect } from "react";
import UserProfile from "../../components/UserProfile/UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "./actions";
import { IStoreType } from "../../utils/store";
import { getTokenUser, setToken } from "../../utils/cookies";
import UserForm from "../../components/UserForm/UserForm";
import UserVerification from "../../components/UserVerification/UserVerification";
import { forwardTo } from "../../utils/history";

interface TParams {
  user_id?: string;
  token?: string;
}

// do poprawy props

const User = (props: any) => {
  const dispatcher = useDispatch();
  const user = useSelector((state: IStoreType) => state.user.data);
  const isLogged = useSelector((state: IStoreType) => state.user.isLogged);

  useEffect(() => {
    if (
      props &&
      props.match &&
      props.match.params &&
      props.match.params.user_id
    ) {
      setToken(props.match.params.token, props.match.params.user_id);
    }

    const tokenExist = getTokenUser();
    if (tokenExist) {
      dispatcher(getUserProfileAction());
    } else {
      forwardTo("/");
    }
  }, [dispatcher, props]);

  return (
    <>
      {user.age && <UserProfile user={user} />}
      {user.isVerified && !user.age && <UserForm type="add" />}
      {!user.isVerified && isLogged && <UserVerification user={user} />}
    </>
  );
};

export default User;
