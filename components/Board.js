import styles from "../styles/Game.module.css";
import Cell from "./Cell";
export default function Board({ game_state }) {
  return (
    <div className={styles.game_board}>
      {game_state.map((cell) => (
        <Cell value={cell} />
      ))}
    </div>
  );
}
