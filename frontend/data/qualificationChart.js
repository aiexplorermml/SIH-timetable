// Faculty qualification distribution data
export const qualificationData = [
  { name: "Ph.D.", value: 45, color: "#8B5CF6" },
  { name: "M.Tech", value: 35, color: "#3B82F6" },
  { name: "M.Sc", value: 15, color: "#10B981" },
  { name: "Others", value: 5, color: "#F59E0B" }
];

// Helper function to get total faculty count
export const getTotalFacultyCount = () => {
  return qualificationData.reduce((total, item) => total + item.value, 0);
};

// Helper function to get qualification percentage
export const getQualificationPercentage = (qualification) => {
  const total = getTotalFacultyCount();
  const item = qualificationData.find(q => q.name === qualification);
  return item ? Math.round((item.value / total) * 100) : 0;
};