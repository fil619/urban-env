const businessUnits = [
  "Retail Banking",
  "Corporate Banking",
  "Wealth Management",
  "Insurance",
  "Investment Banking",
];

const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa",
];

const statuses = ["completed", "processing", "pending"];

function generateRecords(count = 200) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(2024, 0, index + 1);

    return {
      id: index + 1,
      date: date.toLocaleDateString("en-GB"),
      businessUnit: businessUnits[index % businessUnits.length],
      region: regions[index % regions.length],
      revenue: `£${(
        Math.floor(Math.random() * 4000000) + 100000
      ).toLocaleString("en-GB")}`,
      transactions: Math.floor(Math.random() * 1500) + 100,
      status: statuses[index % statuses.length],
    };
  });
}

export const records = generateRecords(200);
