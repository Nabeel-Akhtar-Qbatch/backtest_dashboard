import Link from "next/link";

export default function Home() {
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
      backgroundColor: "#0070f3",
      color: "white",
      borderRadius: "5px",
      textDecoration: "none",
      transition: "background-color 0.3s, transform 0.2s",
      fontWeight: "bold",
      // Hover effect for the links
      ":hover": {
        backgroundColor: "#0056b3",
        transform: "scale(1.05)",
      },
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Strategies Backtesting Dashboard</h1>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <Link href="/strategy-1" legacyBehavior>
            <a style={styles.link}>Strategy 1</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href="/strategy-2" legacyBehavior>
            <a style={styles.link}>Strategy 2</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href="/strategy-3" legacyBehavior>
            <a style={styles.link}>Strategy 3</a>
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link href="/strategy-4" legacyBehavior>
            <a style={styles.link}>Strategy 4</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
