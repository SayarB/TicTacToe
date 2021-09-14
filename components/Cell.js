import styles from "../styles/Game.module.css";
import CellValue from "./CellValue";
export default function cell({ value }) {
  return (
    <div className={styles.game_cell}>
      {value !== -1 ? <CellValue value={value} /> : ""}
    </div>
  );
}
