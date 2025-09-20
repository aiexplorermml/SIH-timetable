// News and events data
export const newsEvents = [
  {
    id: 1,
    title: "Annual Tech Fest 2024 Registration Open",
    description: "Students can now register for the biggest technical event of the year featuring competitions, workshops, and industry talks.",
    date: "2024-01-15",
    type: "Event",
    priority: "high"
  },
  {
    id: 2,
    title: "New Research Center Inauguration",
    description: "The state-of-the-art AI and Machine Learning research center will be inaugurated next month by the Chief Minister.",
    date: "2024-01-12",
    type: "News",
    priority: "medium"
  },
  {
    id: 3,
    title: "Placement Drive - Microsoft",
    description: "Microsoft will be conducting campus placements for final year students. Pre-placement talk scheduled for next week.",
    date: "2024-01-10",
    type: "Event",
    priority: "high"
  },
  {
    id: 4,
    title: "Workshop on Machine Learning",
    description: "A comprehensive 3-day workshop on advanced machine learning techniques by industry experts.",
    date: "2024-01-08",
    type: "Event",
    priority: "medium"
  },
  {
    id: 5,
    title: "Academic Excellence Awards",
    description: "Recognizing outstanding academic performance of students across all departments for the previous semester.",
    date: "2024-01-05",
    type: "News",
    priority: "low"
  }
];

// Helper functions for news events
export const getEventsByType = (type) => {
  return newsEvents.filter(event => event.type === type);
};

export const getEventsByPriority = (priority) => {
  return newsEvents.filter(event => event.priority === priority);
};

export const getRecentEvents = (limit = 5) => {
  return newsEvents
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

// Badge variant mapping for event types
export const getBadgeVariant = (type) => {
  return type === "Event" ? "default" : "secondary";
};

// Priority color mapping
export const getPriorityColor = (priority) => {
  switch(priority) {
    case "high": return "text-red-600";
    case "medium": return "text-yellow-600"; 
    case "low": return "text-green-600";
    default: return "text-gray-600";
  }
};