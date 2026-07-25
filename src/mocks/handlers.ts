import { http, HttpResponse } from "msw";

const kpis = [
  {
    name: "Revenue",
    earn: "4,42,236",
    percent: "59.3%",
    color: "primary",
    icon: "mdi-trending-up",
    text: "35,000",
  },
  {
    name: "Active Customers",
    earn: "78,250",
    percent: "70.5%",
    color: "success",
    icon: "mdi-trending-up",
    text: "8,900",
  },
  {
    name: "Transactions",
    earn: "18,800",
    percent: "27.4%",
    color: "warning",
    icon: "mdi-trending-down",
    text: "1,943",
  },
  {
    name: "Conversion Rate",
    earn: "$35,078",
    percent: "27.4%",
    color: "error",
    icon: "mdi-trending-down",
    text: "$20,395",
  },
];

const revenueTrend = [31, 40, 28, 51, 42, 109, 100];

const revenueByRegion = [80, 95, 70, 42, 65, 55, 78];

const recentRecords = [
  {
    date: "20/12/2023",
    businessUnit: "Retail Banking",
    region: "North America",
    revenue: "£1,245,000",
    transactions: 1248,
    status: "completed",
  },
  {
    date: "21/12/2023",
    businessUnit: "Corporate Banking",
    region: "Europe",
    revenue: "£987,500",
    transactions: 856,
    status: "processing",
  },
  {
    date: "22/12/2023",
    businessUnit: "Wealth Management",
    region: "Asia Pacific",
    revenue: "£2,134,750",
    transactions: 432,
    status: "completed",
  },
  {
    date: "23/12/2023",
    businessUnit: "Insurance",
    region: "Latin America",
    revenue: "£645,200",
    transactions: 521,
    status: "pending",
  },
  {
    date: "24/12/2023",
    businessUnit: "Investment Banking",
    region: "Middle East",
    revenue: "£3,560,000",
    transactions: 187,
    status: "completed",
  },
  {
    date: "25/12/2023",
    businessUnit: "Retail Banking",
    region: "Africa",
    revenue: "£423,800",
    transactions: 674,
    status: "processing",
  },
  {
    date: "26/12/2023",
    businessUnit: "Corporate Banking",
    region: "North America",
    revenue: "£1,789,900",
    transactions: 938,
    status: "completed",
  },
  {
    date: "27/12/2023",
    businessUnit: "Insurance",
    region: "Europe",
    revenue: "£712,450",
    transactions: 603,
    status: "pending",
  },
  {
    date: "28/12/2023",
    businessUnit: "Wealth Management",
    region: "Asia Pacific",
    revenue: "£1,365,700",
    transactions: 351,
    status: "completed",
  },
  {
    date: "29/12/2023",
    businessUnit: "Investment Banking",
    region: "North America",
    revenue: "£4,028,100",
    transactions: 142,
    status: "processing",
  },
];

const notifications = [
  {
    id: 1,
    title: "Cristina danny's birthday",
    message: "It's Cristina danny's birthday today.",
    time: "3:00 AM",
    icon: "mdi-cake-variant",
    color: "success",
    avatar: "lightsuccess",
  },
  {
    id: 2,
    title: "New comment",
    message: "Aida Burg commented on your post.",
    time: "6:00 PM",
    icon: "mdi-message-outline",
    color: "primary",
    avatar: "lightprimary",
  },
  {
    id: 3,
    title: "Profile 60% complete",
    message: "Your profile is complete 60%.",
    time: "2:45 PM",
    icon: "mdi-cog-outline",
    color: "error",
    avatar: "lighterror",
  },
  {
    id: 4,
    title: "Meeting invitation",
    message: "Cristina Danny invited you to join Metting.",
    time: "9:10 PM",
    icon: "mdi-account-multiple-outline",
    color: "primary",
    avatar: "lightprimary",
  },
];

export const handlers = [
  http.get("/api/dashboard/kpis", () => HttpResponse.json(kpis)),
  http.get("/api/dashboard/revenue-trend", () =>
    HttpResponse.json({ data: revenueTrend }),
  ),
  http.get("/api/dashboard/revenue-by-region", () =>
    HttpResponse.json({ data: revenueByRegion }),
  ),
  http.get("/api/records/recent", () => HttpResponse.json(recentRecords)),
  http.get("/api/notifications", () => HttpResponse.json(notifications)),
];
