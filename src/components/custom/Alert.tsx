import React from "react";
import { Alert } from "flowbite-react";

interface AlertCustomProps {
  title?: string;
  content: string;
  type: AlertType;
}

type AlertType = "success" | "warning" | "danger" | "info";
type AlertColor = "blue" | "red" | "green" | "yellow";

const AlertCustom = ({
  title = "Info alert!",
  content,
  type,
}: AlertCustomProps) => {
  const alertTypeMap = new Map<AlertType, AlertColor>();
  alertTypeMap.set("success", "green");
  alertTypeMap.set("info", "blue");
  alertTypeMap.set("danger", "red");
  alertTypeMap.set("warning", "yellow");
  return (
    <Alert color={alertTypeMap.get(type)}>
      <h3 className="font-medium">
        {title} : <span>{content}</span>
      </h3>
    </Alert>
  );
};

export default AlertCustom;
