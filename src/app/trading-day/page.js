import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const data = [
    {
      name: "Monday",
      data: {
        1.5: {
          tradeCount: 12,
          netProfit: 12,
        },
        2: {
          tradeCount: 12,
          netProfit: 12,
        },
      },
    },
    {
      name: "Tuesday",
      data: {
        1.5: {
          tradeCount: 12,
          netProfit: 12,
        },
        2: {
          tradeCount: 12,
          netProfit: 12,
        },
      },
    },
    {
      name: "Wednesday",
      data: {
        1.5: {
          tradeCount: 12,
          netProfit: 12,
        },
        2: {
          tradeCount: 12,
          netProfit: 12,
        },
      },
    },
    {
      name: "Thursday",
      data: {
        1.5: {
          tradeCount: 12,
          netProfit: 12,
        },
        2: {
          tradeCount: 12,
          netProfit: 12,
        },
      },
    },
    {
      name: "Friday",
      data: {
        1.5: {
          tradeCount: 12,
          netProfit: 12,
        },
        2: {
          tradeCount: 12,
          netProfit: 12,
        },
      },
    },
  ];
  const columns = ["1.5", "2", "3", "5"];
  const subColumns = ["Trade Count", "Net Profit"];

  const styles = {
    header: {
      backgroundColor: "#0070f3",
      color: "white",
      padding: "10px",
      fontSize: "16px",
      textAlign: "center",
    },
    subHeader: {
      backgroundColor: "#e6e6e6",
      padding: "10px",
      fontSize: "14px",
      textAlign: "center",
      fontWeight: "500",
    },
    cell: {
      textAlign: "center",
      padding: "10px",
      fontSize: "14px",
    },
    row: {
      borderBottom: "1px solid #ddd",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
  };

  return (
    <Table style={styles.table}>
      <TableHeader>
        <TableRow>
          <TableHead style={styles.header}>Day</TableHead>
          {columns.map((column) => (
            <TableHead
              key={column}
              style={styles.header}
              colSpan={subColumns.length}
            >
              {column}R
            </TableHead>
          ))}
        </TableRow>
        <TableRow>
          {columns.map((column) =>
            subColumns.map((subColumn) => (
              <TableCell
                key={`${column}-${subColumn}`}
                style={styles.subHeader}
              >
                {subColumn}
              </TableCell>
            ))
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ name, data }, index) => (
          <TableRow key={name} style={styles.row}>
            <TableCell style={styles.cell}>{name}</TableCell>
            {columns.flatMap((column) =>
              subColumns.map((subColumn, subIdx) => (
                <TableCell
                  key={`${name}-${column}-${subIdx}`}
                  style={styles.cell}
                >
                  {subColumn === "Trade Count"
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
}
