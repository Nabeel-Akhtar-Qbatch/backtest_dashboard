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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>TDW</TableHead>
          {columns.map((column) => (
            <TableHead className="text-center" colSpan={2}>
              {column}R
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ name, data }) => (
          <TableRow>
            <TableCell>{name}</TableCell>
            {columns.map((column) => (
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
