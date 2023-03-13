import { Button } from "primereact/button";
import "./index.css";

export const CustomButton = ({
  label = null,
  icon = null,
  onClick = () => {},
  varient = "",
  type = "",
  disabled=false
}) => {
  return (
    <Button
      type={type}
      label={label}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      className={`skalebot-button flex ${varient}`}
    />
  );
};
