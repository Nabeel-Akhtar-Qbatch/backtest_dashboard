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
  const {
    params: { strategy, pair },
  } = props;
  const data =
    JSON.parse(fs.readFileSync(process.cwd() + `/public/${strategy}.json`))[
      strategy
    ]?.[pair]?.backtest.data || {};
  const columns = ["1.5", "2", "3", "5"];

  // console.log("test", data[0].long_win_percentage);
  // const rows = [
  //   { name: "Gross Profit", key: "grossProfit" },
  //   { name: "Gross Loss", key: "grossLoss" },
  //   { name: "Net Profit", key: "netProfit" },
  //   { name: "long_win_percentage", key: "long_win_percentage" },
  //   // { name: "Long Position Net Result", key: "longPositionNetResult", symbol: "$", subtitle: "trades# "+{name: "Gross Profit", key: "long_win_percentage" }+"/win%"+{long_win_percentage} },
  //   // { name: "Short Positions Net Result", key: "shortPositionNetResult", symbol: "$", subtitle: "trades#  "+{}+"/win%" +  { name: "long_win_percentage", key: "long_win_percentage"}},
  //   // { name: "Maximum Consecutive Wins", key: "long_win_percentage", symbol: "$", subtitle: `# of trades" ${}`},
  //   {
  //     name: "Maximum Consecutive Loses",
  //     key: "maximumConsecutiveLoses",
  //     symbol: "$",
  //     subtitle: "# of trades",
  //     subKey: "long_win_percentage",
  //   },
  //   {
  //     name: "Relative Drawdown",
  //     key: "relativeDropdown",
  //     symbol: "$",
  //     subtitle: "# of trades",
  //   },
  // ];
  const rows = [
    { name: "Gross Profit", key: "grossProfit" },
    { name: "Gross Loss", key: "grossLoss" },
    { name: "Net Profit", key: "netProfit" },
    {
      name: "Total Trades",
      key: "totalTrades",
    },
    { name: "Long Trades", key: "longTrades" },
    { name: "Short Trades", key: "shortTrades" },
    {
      name: "Long Position Net Result",
      key: "longPositionNetResult",
      symbol: "$",
      subtitle: "win%",
      subKey: "long_win_percentage",
    },
    {
      name: "Short Positions Net Result",
      key: "shortPositionNetResult",
      symbol: "$",
      subtitle: "win%",
      subKey: "short_win_percentage",
    },
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
          {rows.map(({ name, key, symbol, subtitle, subKey }, index) => (
            <TableRow
              key={index}
              style={index % 2 === 0 ? styles.row : styles.alternateRow}
            >
              <TableCell style={styles.cell}>{name}</TableCell>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} style={styles.cell}>
                  {symbol} {data[column]?.[key]}
                  {subtitle && (
                    <p className="flex text-sky-600">
                      {subtitle}{" "}
                      <p className="text-black pl-1">
                        {data[column]?.[subKey]}
                      </p>
                      {/* <p className="text-black pl-1">{data[column]?.[key]}</p> */}
                    </p>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
