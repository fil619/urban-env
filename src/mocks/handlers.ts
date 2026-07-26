import { http, HttpResponse } from "msw";
import { records, regions } from "./generateRecords";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DATA_START_MONTH = new Date(2026, 0, 1);
const DATA_END_MONTH = new Date(2026, 11, 1);

function parseRevenue(revenue: string) {
  return Number(revenue.replace(/[£,]/g, ""));
}

function monthLabel(date: Date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function getMonthRange(url: URL) {
  const fromDate = url.searchParams.get("fromDate");
  const toDate = url.searchParams.get("toDate");

  const start = fromDate
    ? new Date(
        new Date(fromDate).getFullYear(),
        new Date(fromDate).getMonth(),
        1,
      )
    : DATA_START_MONTH;
  const end = toDate
    ? new Date(new Date(toDate).getFullYear(), new Date(toDate).getMonth(), 1)
    : DATA_END_MONTH;

  const months = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
}

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

function parseGbDate(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function applyRecordFilters(url: URL) {
  const fromDate = url.searchParams.get("fromDate");
  const toDate = url.searchParams.get("toDate");
  const region = url.searchParams.get("region");
  const status = url.searchParams.get("status");

  let result = records;

  if (fromDate) {
    const from = new Date(fromDate);
    result = result.filter((record) => parseGbDate(record.date) >= from);
  }

  if (toDate) {
    const to = new Date(toDate);
    result = result.filter((record) => parseGbDate(record.date) <= to);
  }

  if (region) {
    result = result.filter((record) => record.region === region);
  }

  if (status) {
    result = result.filter((record) => record.status === status.toLowerCase());
  }

  return result;
}

function computeKpis(url: URL) {
  const filtered = applyRecordFilters(url);

  const totalRevenue = filtered.reduce(
    (sum, record) => sum + parseRevenue(record.revenue),
    0,
  );

  const totalTransactions = filtered.reduce(
    (sum, record) => sum + record.transactions,
    0,
  );

  const activeBusinessUnits = new Set(
    filtered.map((record) => record.businessUnit),
  ).size;

  const completedCount = filtered.filter(
    (record) => record.status === "completed",
  ).length;
  const completionRate =
    filtered.length > 0
      ? Math.round((completedCount / filtered.length) * 1000) / 10
      : 0;

  return [
    {
      name: "Revenue",
      earn: `£${Math.round(totalRevenue).toLocaleString("en-GB")}`,
      percent: "59.3%",
      color: "primary",
      icon: "mdi-trending-up",
    },
    {
      name: "Active Business Units",
      earn: String(activeBusinessUnits),
      percent: "70.5%",
      color: "success",
      icon: "mdi-trending-up",
    },
    {
      name: "Transactions",
      earn: totalTransactions.toLocaleString("en-GB"),
      percent: "27.4%",
      color: "warning",
      icon: "mdi-trending-down",
    },
    {
      name: "Completion Rate",
      earn: `${completionRate}%`,
      percent: "27.4%",
      color: "error",
      icon: "mdi-trending-down",
    },
  ];
}

export const handlers = [
  http.get("/api/dashboard/kpis", ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(computeKpis(url));
  }),
  http.get("/api/dashboard/revenue-trend", ({ request }) => {
    const url = new URL(request.url);
    const filtered = applyRecordFilters(url);
    const months = getMonthRange(url);

    const data = months.map((month) =>
      Math.round(
        filtered
          .filter((record) => {
            const recordDate = parseGbDate(record.date);
            return (
              recordDate.getFullYear() === month.getFullYear() &&
              recordDate.getMonth() === month.getMonth()
            );
          })
          .reduce((sum, record) => sum + parseRevenue(record.revenue), 0),
      ),
    );

    return HttpResponse.json({ labels: months.map(monthLabel), data });
  }),
  http.get("/api/dashboard/revenue-by-region", ({ request }) => {
    const url = new URL(request.url);
    const filtered = applyRecordFilters(url);

    const data = regions.map((region) =>
      Math.round(
        filtered
          .filter((record) => record.region === region.name)
          .reduce((sum, record) => sum + parseRevenue(record.revenue), 0),
      ),
    );

    return HttpResponse.json({ labels: regions.map((r) => r.name), data });
  }),
  http.get("/api/records/recent", ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(applyRecordFilters(url).slice(0, 10));
  }),

  http.get("/api/records", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";
    const sortBy = url.searchParams.get("sortBy") as keyof RecordItem | null;
    const sortOrder = url.searchParams.get("sortOrder") === "desc" ? -1 : 1;
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const itemsPerPage = Number(url.searchParams.get("itemsPerPage") ?? "10");

    let result = applyRecordFilters(url);

    if (search) {
      result = result.filter((record) =>
        Object.values(record).some((value) =>
          String(value).toLowerCase().includes(search),
        ),
      );
    }

    if (sortBy) {
      result = [...result].sort((a, b) => {
        const aValue =
          sortBy === "date" ? parseGbDate(a.date).getTime() : a[sortBy];
        const bValue =
          sortBy === "date" ? parseGbDate(b.date).getTime() : b[sortBy];
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
