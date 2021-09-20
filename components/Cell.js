import styles from "../styles/Game.module.css";
import CellValue from "./CellValue";
export default function cell({ value, putTurn, cell_num }) {
  return (
    <div
      className={styles.game_cell}
      id={"cell-" + cell_num}
      onClick={() => {
        putTurn(cell_num);
      }}
    >
      {value !== -1 ? <CellValue value={value} /> : ""}
    </div>
  );
}
