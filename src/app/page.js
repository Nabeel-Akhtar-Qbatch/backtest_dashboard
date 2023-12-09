import Link from "next/link";

export default function Home() {
  const styles = {
    container: {
      textAlign: "center",
      padding: "50px",
      backgroundColor: "#f0f4f7",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      color: "#2a3f54",
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "40px",
      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    list: {
      listStyle: "none",
      padding: "0",
      display: "inline-block",
      textAlign: "left",
    },
    listItem: {
      margin: "15px 0",
      backgroundColor: "#ffffff",
      border: "1px solid #dfe1e5",
      borderRadius: "8px",
      padding: "10px 20px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    link: {
      display: "block",
      padding: "10px 15px",
      backgroundColor: "#0070f3",
      color: "white",
      borderRadius: "5px",
      textDecoration: "none",
      transition: "background-color 0.3s, transform 0.2s",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Strategies Backtesting Dashboard</h1>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <Link href="/backtest" legacyBehavior>
            <a style={styles.link}>Backtest</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href="/optimal-trade" legacyBehavior>
            <a style={styles.link}>Optimal Trade</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href="/trading-day" legacyBehavior>
            <a style={styles.link}>Trading Day</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href="/trading-hour" legacyBehavior>
            <a style={styles.link}>Trading Hour</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
