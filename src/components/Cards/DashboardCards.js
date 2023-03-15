import { Text } from "../Text";
import styles from "./dashboardCardStyles.module.css";
function DashboardCard({ count, title }) {
  return (
    <div className={`${styles["dashboard-card"]}`}>
      <div className="flex flex-column justify-content-center align-items-center">
        <div className={`${styles["count"]}`}>{count}</div>
        <Text type={"heading"} color={"#808080"}>
          {title}
        </Text>
      </div>
    </div>
  );
}

export default DashboardCard;
