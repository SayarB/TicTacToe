import { useEffect, useState } from "react";
import styles from "../styles/Game.module.css";
import Board from "./Board";
import { io } from "socket.io-client";
export default function Game() {
  const [game_state, set_game_state] = useState([
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ]);

  const [socket, setSocket] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winner, setWinner] = useState(-1);
  const [turn, setTurn] = useState(-1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const newSocket = io("ws://192.168.0.5:8000");
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.on("connection", (g_state) => {
        set_game_state(g_state);
        console.log("Connected to Web Socket");
      });
    }
  }, [socket]);
  useEffect(() => {
    if (turn !== -1) {
      console.log("Turn is ", turn);
    }
  }, [turn]);

  socket?.on("set_turn", (turnToBeAssigned) => {
    setTurn(turnToBeAssigned);
  });
  socket?.on("set_draw", (draw) => {
    setIsDraw(true);
    setGameOver(true);
  });

  socket?.on("update_game_state", (game_state) => set_game_state(game_state));
  socket?.on("room_full", () => {
    console.log("room full");
    socket.disconnect();
  });

  socket?.on("set_winner", ({ isWin, comb, winner_turn }) => {
    if (isWin) {
      setWinner(winner_turn);
      setGameOver(true);
      showWinComb(comb);
    }
  });

  const emitTurn = (pos) => {
    socket?.emit("put_turn", pos, turn);
  };

  const showWinComb = (winComb) => {
    console.log(winComb);
    winComb.forEach((ele) => {
      const cell = document.getElementById("cell-" + ele);
      cell.classList.add(styles.winner_combination);
    });
  };

  return (
    <div className={styles.game_container}>
      <Board game_state={game_state} putTurn={emitTurn} />
      {winner !== -1 ? (
        <div className={styles.overlay}>
          <h1 className={styles.announcement + " " + styles.winner_text}>
            Winner is Player {winner === 0 ? "O" : "X"}
          </h1>
        </div>
      ) : (
        ""
      )}
      {isDraw ? (
        <h1 className={styles.announcement + " " + styles.game_draw_text}>
          It is a Draw
        </h1>
      ) : (
        ""
      )}
    </div>
  );
}
