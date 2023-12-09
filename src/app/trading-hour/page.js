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
      name: "0000 to 0100",
      data: {
        1.5: {
          tradeCount: 12,
          netProfit: 24,
        },
        2: {
          tradeCount: 112212,
          netProfit: 12354,
        },
      },
    },
    {
      name: "0100 to 0200",
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
      name: "0200 to 0300",
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
      name: "0300 to 0400",
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
      name: "0400 to 0500",
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>UTC-2</TableHead>
          {columns.map((column) => (
            <TableHead className="text-center" colSpan={2}>
              {column}R
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell />
          <TableCell
            className="text-center text-2xl font-bold"
            colSpan={columns.length}
          >
            Long
          </TableCell>
        </TableRow>
        {data.map(({ name, data }, index) => (
          <TableRow key={index}>
            <TableCell>{name}</TableCell>
            {columns.map((column, index) => (
              <>
                <TableCell className="text-center">
                  <div>{data[column]?.tradeCount}</div>
                </TableCell>
                <TableCell className="text-center">
                  <div>{data[column]?.netProfit}</div>
                </TableCell>
              </>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
