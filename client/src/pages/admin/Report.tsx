import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RouteStats {
  route: string;
  date: Date;
  total_bookings: number;
  cancellations: number;
}

interface RevenueStats {
  flight: string;
  revenue: string;
}

const Report: React.FC = () => {
  const [routes, setRoutes] = useState<RouteStats[]>([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueStats[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<string>("Loading...");
  const [discountsApplied, setDiscountsApplied] =
    useState<string>("Loading...");
  discountsApplied;
  // Fetch the report data
  useEffect(() => {
    async function fetchReportData() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/report`
        ); // Adjust endpoint if necessary
        const data = await response.json();

        setRoutes(data.routes);
        setRoutes(
          (data.routes as RouteStats[]).map((value) => {
            return { ...value, date: new Date(value.date) };
          })
        );
        setRevenueBreakdown(data.revenueBreakdown);
        setTotalRevenue(data.totalRevenue);
        setDiscountsApplied(data.discountsApplied);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }

    fetchReportData();
  }, []);

  const handlePrint = (): void => {
    window.print();
  };

  return (
    <div className="flex justify-center items-center min-h-screen print:block">
      <div className="w-full max-w-4xl border border-gray-300 shadow-lg rounded-lg p-8 bg-card print:w-full print:max-w-none text-sm mt-10 mb-10">
        <div className="text-right mb-4 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            Print Report
          </button>
        </div>

        {/* Report Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">Turistoe Report</h1>
          <p className="text-sm text-foreground">
            Bookings and Revenue Insights
          </p>
        </div>

        {/* Booking Details */}
        <div>
          <h2 className="text-lg font-bold mb-4">Booking Summary</h2>
          <Table>
            <TableCaption>A summary of recent bookings.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Cancellations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route, index) => (
                <TableRow key={index}>
                  <TableCell>{route.route}</TableCell>
                  <TableCell>{route.date.toLocaleDateString()}</TableCell>
                  <TableCell>{route.total_bookings}</TableCell>
                  <TableCell>{route.cancellations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Revenue Details */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Revenue Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-4">
              <h3 className="font-bold">Total Revenue</h3>
              <p>${totalRevenue}</p>
            </div>
          </div>
          <h3 className="text-lg mt-6">Revenue Breakdown by Flight</h3>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Flight</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueBreakdown.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.flight}</TableCell>
                  <TableCell>${item.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t mt-4">
          <p className="text-xs text-foreground">
            Generated at: {new Date().toLocaleString()}
          </p>
          <p className="text-xs text-foreground mt-2">
            Thank you for using Turistoe!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;
