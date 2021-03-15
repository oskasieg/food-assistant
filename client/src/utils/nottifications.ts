import { ReactNotificationOptions, store } from "react-notifications-component";

type IType = "success" | "danger" | "info" | "default" | "warning";

const showNotification = (title: string, message: string, type: IType) => {
  const notification: ReactNotificationOptions = {
    title,
    message,
    type,
    dismiss: {
      duration: 5000,
      pauseOnHover: true,
    },
    animationIn: ["animate__animated", "animate__slideInUp"],
    animationOut: ["animate__animated", "animate__boundeOutDown"],
    container: "bottom-center",
  };

  store.addNotification({ ...notification });
};

export default showNotification;
