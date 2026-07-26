export const businessUnits = [
  { id: 1, name: "Retail Banking" },
  { id: 2, name: "Corporate Banking" },
  { id: 3, name: "Wealth Management" },
  { id: 4, name: "Insurance" },
  { id: 5, name: "Investment Banking" },
];

export const regions = [
  { id: 1, name: "North America" },
  { id: 2, name: "Europe" },
  { id: 3, name: "Asia Pacific" },
  { id: 4, name: "Latin America" },
  { id: 5, name: "Middle East" },
  { id: 6, name: "Africa" },
];

const statuses = ["completed", "processing", "pending"];

function randomDateBetween(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateRecords(count = 300) {
  return Array.from({ length: count }, (_, index) => {
    const date = randomDateBetween(
      new Date(2026, 0, 1),
      new Date(2026, 11, 31),
    );

    return {
      id: index + 1,
      date: date.toLocaleDateString("en-GB"),
      businessUnit: businessUnits[index % businessUnits.length].name,
      region: regions[index % regions.length].name,
      revenue: `£${(Math.floor(Math.random() * 49000) + 1000).toLocaleString(
        "en-GB",
      )}`,
      transactions: Math.floor(Math.random() * 1500) + 100,
      status: statuses[index % statuses.length],
    };
  });
}

export const records = generateRecords(200);
