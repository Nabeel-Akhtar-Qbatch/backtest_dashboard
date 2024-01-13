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
  console.log("props", props);
  return (
    <>
      <h1 className="text-4xl text-center font-extrabold dark:text-white">
        Long
      </h1>
      <TableComponent props={props} />
      {/* <h1 className="text-4xl text-center font-extrabold dark:text-white">Short</h1>
    <TableComponent props={props} /> */}
    </>
  );
}

const TableComponent = ({ props }) => {
  const {
    params: { strategy, pair },
  } = props;

  const Long =
    JSON.parse(fs.readFileSync(process.cwd() + `/public/${strategy}.json`))[
      strategy
    ]?.[pair]?.trading_month.Long || [];
  const Short =
    JSON.parse(fs.readFileSync(process.cwd() + `/public/${strategy}.json`))[
      strategy
    ]?.[pair]?.trading_month.Short || [];

  const columns = ["1.5", "2", "3", "5"];
  const subHeaders = ["Trade Count", "Net Profit"];

  const styles = {
    tableHead: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px",
      fontSize: "18px",
      fontWeight: "bold",
    },
    subHeader: {
      backgroundColor: "#e2e3e5",
      color: "black",
      padding: "10px",
      fontSize: "16px",
      fontWeight: "bold",
    },
    tableRow: {
      borderBottom: "1px solid #dee2e6",
    },
    tableCell: {
      padding: "10px",
      textAlign: "center",
      fontSize: "14px",
    },
    timeCell: {
      backgroundColor: "#f8f9fa",
      fontWeight: "bold",
    },
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={styles.tableHead}>TDM</TableHead>
          {columns.map((column) => (
            <TableHead
              key={column}
              className="text-center"
              style={styles.tableHead}
              colSpan={subHeaders.length}
            >
              {column}R
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Long.map(({ name, data }, rowIndex) => (
          <TableRow key={name} style={styles.tableRow}>
            <TableCell style={{ ...styles.tableCell, ...styles.timeCell }}>
              {name}
            </TableCell>
            {columns.flatMap((column) =>
              subHeaders.map((_, subIndex) => (
                <TableCell
                  key={`${rowIndex}-${column}-${subIndex}`}
                  style={styles.tableCell}
                >
                  {subIndex === 0
                    ? data[column]?.tradeCount
                    : data[column]?.netProfit}
                </TableCell>
              ))
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableCell colSpan={9}>
        <div className="text-center">
          <h1 className="text-4xl text-center font-extrabold dark:text-white">
            Short
          </h1>
        </div>
      </TableCell>
      <TableHeader>
        <TableRow>
          <TableHead style={styles.tableHead}>TDM</TableHead>
          {columns.map((column) => (
            <TableHead
              key={column}
              className="text-center"
              style={styles.tableHead}
              colSpan={subHeaders.length}
            >
              {column}R
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Short.map(({ name, data }, rowIndex) => (
          <TableRow key={name} style={styles.tableRow}>
            <TableCell style={{ ...styles.tableCell, ...styles.timeCell }}>
              {name}
            </TableCell>
            {columns.flatMap((column) =>
              subHeaders.map((_, subIndex) => (
                <TableCell
                  key={`${rowIndex}-${column}-${subIndex}`}
                  style={styles.tableCell}
                >
                  {subIndex === 0
                    ? data[column]?.tradeCount
                    : data[column]?.netProfit}
                </TableCell>
              ))
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
