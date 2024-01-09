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
  return <>
    <h1 className="text-4xl text-center font-extrabold dark:text-white">Long</h1>
    <TableComponent props={props} />
    <h1 className="text-4xl text-center font-extrabold dark:text-white">Short</h1>
    <TableComponent props={props} />
  </>

}

function TableComponent({props}) {
  const { params: { strategy, pair } } = props;
  const data = JSON.parse(
    fs.readFileSync(process.cwd() + `/public/${strategy}.json`)
  )[strategy]?.[pair]?.commercial.data || {};
  const columns = ["1.5", "2", "3", "5"];
  const rows = [
    { name: "Gross Profit", key: "grossProfit" },
    { name: "Gross Loss", key: "grossLoss" },
    { name: "Net Profit", key: "netProfit" },
    { name: "Total Trades", key: "totalTrades", symbol: "Trades #", subtitle: "Long#/Short#" },
    { name: "Long Position Net Result", key: "longPositionNetResult", symbol: "$", subtitle: "trades#/win%" },
    { name: "Short Positions Net Result", key: "shortPositionNetResult", symbol: "$", subtitle: "trades#/win%" },
    { name: "Maximum Consecutive Wins", key: "maximumConsecutiveWins", symbol: "$", subtitle: "# of trades" },
    { name: "Maximum Consecutive Loses", key: "maximumConsecutiveLoses", symbol: "$", subtitle: "# of trades" },
    { name: "Relative Drawdown", key: "relativeDropdown", symbol: "$", subtitle: "# of trades" },
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
            <TableHead style={styles.header}>COT-CLST Score</TableHead>
            {columns.map((column, index) => (
              <TableHead key={index} style={styles.header}>
                {column}R
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((obj, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell>Trade # {obj["1.5"]["trade-no"]} | Net profit: {obj["1.5"]["net-profit"]}</TableCell>
              <TableCell>Trade # {obj["2"]["trade-no"]} | Net profit: {obj["2"]["net-profit"]}</TableCell>
              <TableCell>Trade # {obj["3"]["trade-no"]} | Net profit: {obj["3"]["net-profit"]}</TableCell>
              <TableCell>Trade # {obj["5"]["trade-no"]} | Net profit: {obj["5"]["net-profit"]}</TableCell>
            </TableRow>
          ))}
          <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>Trade # {data.reduce((acc, cumm) => acc+cumm["1.5"]["trade-no"], 0)} | Net profit: {data.reduce((acc, cumm) => acc+cumm["1.5"]["net-profit"], 0)}</TableCell>
              <TableCell>Trade # {data.reduce((acc, cumm) => acc+cumm["2"]["trade-no"], 0)} | Net profit: {data.reduce((acc, cumm) => acc+cumm["2"]["net-profit"], 0)}</TableCell>
              <TableCell>Trade # {data.reduce((acc, cumm) => acc+cumm["3"]["trade-no"], 0)} | Net profit: {data.reduce((acc, cumm) => acc+cumm["3"]["net-profit"], 0)}</TableCell>
              <TableCell>Trade # {data.reduce((acc, cumm) => acc+cumm["5"]["trade-no"], 0)} | Net profit: {data.reduce((acc, cumm) => acc+cumm["5"]["net-profit"], 0)}</TableCell>
              </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
