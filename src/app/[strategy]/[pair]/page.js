import Link from "next/link";

export default function Home(props) {
  const styles = {
    container: {
      textAlign: "center",
      padding: "50px",
      background: "linear-gradient(to right, #83a4d4, #b6fbff)", // Gradient background
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
      transition: "transform 0.2s", // Smooth transition for hover effect
    },
    link: {
      display: "block",
      padding: "10px 15px",
      color: "white",
      borderRadius: "5px",
      textDecoration: "none",
      transition: "background-color 0.3s, transform 0.2s",
      fontWeight: "bold",
    },
  };
  const pair = props.params.pair;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Results</h1>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <Link href={`${pair}/backtest`} legacyBehavior>
            <a style={styles.link} className="hover:bg-black bg-blue-500">Backtest</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href={`${pair}/optimal-trade`} legacyBehavior>
            <a style={styles.link} className="hover:bg-black bg-blue-500">Optimal Trade</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href={`${pair}/trading-day`} legacyBehavior>
            <a style={styles.link} className="hover:bg-black bg-blue-500">Trading Day</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href={`${pair}/trading-hour`} legacyBehavior>
            <a style={styles.link} className="hover:bg-black bg-blue-500">Trading Hour</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href={`${pair}/trading-month`} legacyBehavior>
            <a style={styles.link} className="hover:bg-black bg-blue-500">Trading Month</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href={`${pair}/commercial`} legacyBehavior>
            <a style={styles.link} className="hover:bg-black bg-blue-500">Commercials</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href={`${pair}/seasonality`} legacyBehavior>
            <a style={styles.link} className="hover:bg-black bg-blue-500">Seasonality score</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
