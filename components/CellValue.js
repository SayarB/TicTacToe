import styles from "../styles/Game.module.css";
export default function CellValue({ value }) {
  if (value === 0) {
    return <h1 className={styles.cell_value}>O</h1>;
  } else if (value === 1) {
    return <h1 className={styles.cell_value}>X</h1>;
  }
}
