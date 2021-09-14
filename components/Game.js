import { useState } from "react";
import styles from "../styles/Game.module.css";
import Board from "./Board";
export default function Game() {
  const [game_state, set_game_state] = useState([
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ]);
  const [turn, setTurn] = useState(0);
  
  return (
    <div className={styles.game_container}>
      <Board game_state={game_state} />
    </div>
  );
}
