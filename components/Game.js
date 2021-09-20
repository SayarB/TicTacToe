import { useEffect, useState } from "react";
import styles from "../styles/Game.module.css";
import Board from "./Board";
import { io } from "socket.io-client";
export default function Game() {
  const [game_state, set_game_state] = useState([
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ]);

  const [socket, setSocket] = useState(null);
  const [winComb, setWinComb] = useState([]);
  const [winner, setWinner] = useState(-1);
  const winning_positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  useEffect(() => {
    const socket = io("ws://localhost:8000");
    setSocket(socket);
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.on("connection", () => {
        console.log("Connected to Web Socket");
      });
    }
  }, [socket]);

  socket?.on("put_turn", (pos) => {
    console.log("Put turn at ", pos);
    putTurn(pos);
  });

  const [turn, setTurn] = useState(0);
  const [isDraw, setIsDraw] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const putTurn = (pos) => {
    if (!gameOver) {
      var arr = [...game_state];
      if (arr[pos] === -1) {
        arr[pos] = turn;
        set_game_state(arr);
      }
    }
  };

  const emitTurn = (pos) => {
    socket?.emit("put_turn", pos);
  };

  useEffect(() => {
    const { isWin, comb, winner } = checkWin();
    setWinner(winner);
    setWinComb(comb);
    console.log(isWin, "asdasdasdasd", comb);

    if (!isWin) {
      const isDraw = checkDraw();
      if (!isDraw) {
        changeTurn();
      } else {
        setGameOver(true);
        setIsDraw(true);
      }
    } else {
      setGameOver(true);
    }
  }, [game_state]);

  useEffect(() => {
    if (winComb.length === 3) {
      showWinComb();
    }
  }, [winComb]);

  const showWinComb = () => {
    console.log(winComb);
    winComb.forEach((ele) => {
      const cell = document.getElementById("cell-" + ele);
      cell.classList.add(styles.winner_combination);
    });
  };

  const changeTurn = () => {
    setTurn((turn) => {
      if (turn === 1) return 0;
      else if (turn === 0) return 1;
    });
  };

  const checkDraw = () => {
    var ans = true;
    game_state.forEach((ele) => {
      if (ele === -1) {
        ans = false;
      }
    });
    return ans;
  };

  const checkWin = () => {
    var check = turn;
    var comb = [];
    var isWin = false;
    winning_positions.forEach((element) => {
      var ans = true;
      element.forEach((pos) => {
        if (check !== game_state[pos]) {
          ans = false;
        }
      });
      if (ans) {
        comb = element;
        isWin = true;
      }
    });
    var win = isWin ? turn : -1;

    return { isWin, comb, winner: win };
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
