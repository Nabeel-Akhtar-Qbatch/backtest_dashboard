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

  const strategy = props.params.strategy;

  const pairs = [
    "USDCHF",
    "AUDJPY",
    "EURUSD",
    "AUDUSD",
    "EURJPY",
    "FTSE100",
    "GER30",
    "USDJPY",
    "GBPJPY",
    "USO",
    "USDCAD",
    "GBPUSD",
    "NZDUSD",
    "US100",
    "XAU",
    "XAG",
    "EU",
    "GU",
    "UC",
    "UJ",
    "AU",
    "US",
    "NU",
    "GS",
    "CS",
    "AS",
    "NS",
    "NJ",
    "GJ",
    "EJ",
    "ES",
    "GC",
    "EC",
    "US50",
    "US10",
    "US30",
    "GER3",
    "FTSE",
    "USOil",
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pairs </h1>
      <ul style={styles.list}>
        {pairs.map((pair) => (
          <li style={styles.listItem}>
            <Link href={`/${strategy}/${pair}`} legacyBehavior>
              <a style={styles.link} className="hover:bg-black bg-blue-500">
                {pair}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
