import styles from "../styles/Game.module.css";
import Cell from "./Cell";
export default function Board({ game_state, putTurn }) {
  return (
    <div className={styles.game_board}>
      {game_state.map((cell, i) => (
        <Cell key={"cell-" + i} value={cell} putTurn={putTurn} cell_num={i} />
      ))}
    </div>
  );
}
