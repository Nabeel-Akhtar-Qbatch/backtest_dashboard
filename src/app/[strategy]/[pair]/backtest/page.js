import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import fs from "fs";

export default function Home(props) {
  const { params: { strategy, pair } } = props;
  const data = JSON.parse(
    fs.readFileSync(process.cwd() + "/public/data.json")
  )[strategy]?.[pair].backtesting.data || {};
  const columns = ["1.5", "2", "3", "5"];
  const rows = [
    { name: "Gross Profit", key: "grossProfit" },
    { name: "Gross Loss", key: "grossLoss" },
    { name: "Net Profit", key: "netProfit" },
    { name: "Total Trades", key: "totalTrades" },
    { name: "Long Position Net Result", key: "longPositionNetResult" },
    { name: "Short Positions Net Result", key: "shortPositionNetResult" },
    { name: "Maximum Consecutive Wins", key: "maximumConsecutiveWins" },
    { name: "Maximum Consecutive Loses", key: "maximumConsecutiveLoses" },
    { name: "Relative Drawdown", key: "relativeDropdown" },
  ];
  const styles = {
    header: {
      backgroundColor: "#0070f3",
      color: "white",
      padding: "15px",
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
    },
    cell: {
      padding: "10px",
      fontSize: "14px",
      borderBottom: "1px solid #ddd",
    },
    row: {
      backgroundColor: "#F7F7F7",
    },
    alternateRow: {
      backgroundColor: "white",
    },
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={styles.header}></TableHead>
            {columns.map((column, index) => (
              <TableHead key={index} style={styles.header}>
                {column}R
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ name, key }, index) => (
            <TableRow
              key={index}
              style={index % 2 === 0 ? styles.row : styles.alternateRow}
            >
              <TableCell style={styles.cell}>{name}</TableCell>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} style={styles.cell}>
                  {data[column]?.[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
