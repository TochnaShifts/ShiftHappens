const colorPalette = [
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-blue-100 text-blue-800",
  "bg-yellow-100 text-yellow-800",
  "bg-red-100 text-red-800",
];

export function getGroupColor(groupId: string, groupIds: string[]) {
  const index = groupIds.indexOf(groupId);
  return colorPalette[index % colorPalette.length];
} 