import { http, HttpResponse } from "msw";
import { records, regions } from "./generateRecords";

const kpis = [
  {
    name: "Revenue",
    earn: "4,42,236",
    percent: "59.3%",
    color: "primary",
    icon: "mdi-trending-up",
  },
  {
    name: "Active Customers",
    earn: "78,250",
    percent: "70.5%",
    color: "success",
    icon: "mdi-trending-up",
  },
  {
    name: "Transactions",
    earn: "18,800",
    percent: "27.4%",
    color: "warning",
    icon: "mdi-trending-down",
  },
  {
    name: "Conversion Rate",
    earn: "$35,078",
    percent: "27.4%",
    color: "error",
    icon: "mdi-trending-down",
  },
];

const revenueTrend = [31, 40, 28, 51, 42, 109, 100];

const revenueByRegion = [80, 95, 70, 42, 65, 55, 78];

const notifications = [
  {
    id: 1,
    title: "Monthly target reached",
    message: "Revenue target achieved for this month.",
    time: "3:00 AM",
    icon: "mdi-trending-up",
    color: "success",
    avatar: "lightsuccess",
  },
  {
    id: 2,
    title: "New payment received",
    message: "Acme Corp completed their payment.",
    time: "6:00 PM",
    icon: "mdi-cash-check",
    color: "primary",
    avatar: "lightprimary",
  },
  {
    id: 3,
    title: "Forecast updated",
    message: "Revenue forecast increased by 8%.",
    time: "2:45 PM",
    icon: "mdi-chart-line",
    color: "warning",
    avatar: "lightwarning",
  },
  {
    id: 4,
    title: "Invoice overdue",
    message: "Northwind invoice is 5 days overdue.",
    time: "9:10 PM",
    icon: "mdi-file-document-alert-outline",
    color: "error",
    avatar: "lighterror",
  },
];

type RecordItem = (typeof records)[number];

export const handlers = [
  http.get("/api/dashboard/kpis", () => HttpResponse.json(kpis)),
  http.get("/api/dashboard/revenue-trend", () =>
    HttpResponse.json({ data: revenueTrend }),
  ),
  http.get("/api/dashboard/revenue-by-region", () =>
    HttpResponse.json({ data: revenueByRegion }),
  ),
  http.get("/api/records/recent", () =>
    HttpResponse.json(records.slice(0, 10)),
  ),

  http.get("/api/records", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";
    const sortBy = url.searchParams.get("sortBy") as keyof RecordItem | null;
    const sortOrder = url.searchParams.get("sortOrder") === "desc" ? -1 : 1;
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const itemsPerPage = Number(url.searchParams.get("itemsPerPage") ?? "10");

    let result = records;

    if (search) {
      result = result.filter((record) =>
        Object.values(record).some((value) =>
          String(value).toLowerCase().includes(search),
        ),
      );
    }

    if (sortBy) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (aValue === bValue) return 0;
        return aValue > bValue ? sortOrder : -sortOrder;
      });
    }

    const total = result.length;
    const start = itemsPerPage === -1 ? 0 : (page - 1) * itemsPerPage;
    const end = itemsPerPage === -1 ? total : start + itemsPerPage;

    return HttpResponse.json({ items: result.slice(start, end), total });
  }),

  http.get("/api/notifications", () => HttpResponse.json(notifications)),

  http.get("/api/regions", () => HttpResponse.json(regions)),
];
