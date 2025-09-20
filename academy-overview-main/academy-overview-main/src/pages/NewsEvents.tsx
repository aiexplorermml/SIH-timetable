import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NewsEventsFilter } from "@/components/NewsEventsFilter";
import { NewsEventsList } from "@/components/NewsEventsList";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download, Upload } from "lucide-react";
import { NewsEvent } from "@/types/newsEvent";

// Sample news & events data
const sampleNewsEvents: NewsEvent[] = [
  {
    id: "1",
    title: "Annual Tech Fest 2024 - TechnoVision",
    description: "Join us for the biggest technology festival of the year featuring competitions, workshops, and industry expert sessions. Register now for exciting prizes and networking opportunities.",
    content: "Detailed content about the tech fest...",
    date: "2024-03-15",
    status: "Upcoming",
    type: "Event",
    location: "Main Auditorium",
    category: "Cultural",
    author: "Dr. Rajesh Kumar",
    image: "/images/tech-fest.jpg"
  },
  {
    id: "2",
    title: "New Research Lab Inauguration",
    description: "State-of-the-art AI and Machine Learning research lab inaugurated with advanced computing facilities and collaboration spaces for students and faculty.",
    date: "2024-01-20",
    status: "Published",
    type: "News",
    location: "Block C, 3rd Floor",
    category: "Research",
    author: "Prof. Meera Sharma"
  },
  {
    id: "3",
    title: "Placement Drive - Microsoft",
    description: "Microsoft will be conducting campus recruitment for Software Engineer positions. Eligible students from CSE and IT departments can apply.",
    date: "2024-02-28",
    status: "Upcoming",
    type: "Event",
    location: "Placement Office",
    category: "Placement",
    author: "Placement Officer"
  },
  {
    id: "4",
    title: "Student Achievement in International Robotics Competition",
    description: "Our robotics team secured 2nd place in the International Robotics Championship held in Singapore, bringing pride to the institution.",
    date: "2024-01-15",
    status: "Published",
    type: "News",
    category: "Academic",
    author: "Dr. Amit Patel"
  },
  {
    id: "5",
    title: "Sports Week 2024",
    description: "Annual sports week featuring inter-department competitions in cricket, football, basketball, and track events. All students are encouraged to participate.",
    date: "2024-03-01",
    status: "Upcoming",
    type: "Event",
    location: "Sports Complex",
    category: "Sports",
    author: "Sports Coordinator"
  },
  {
    id: "6",
    title: "New Academic Calendar Released",
    description: "The academic calendar for the upcoming semester has been released. Students and faculty can access it from the portal.",
    date: "2024-01-10",
    status: "Published",
    type: "News",
    category: "Announcement",
    author: "Academic Office"
  },
  {
    id: "7",
    title: "Industry-Academia Collaboration Workshop",
    description: "Workshop on bridging the gap between industry requirements and academic curriculum. Industry experts will share insights on current trends.",
    date: "2024-04-10",
    status: "Upcoming",
    type: "Event",
    location: "Conference Hall",
    category: "Academic",
    author: "Dr. Sunita Reddy"
  },
  {
    id: "8",
    title: "Research Paper Publication Success",
    description: "Faculty and students have successfully published 15 research papers in reputed international journals this quarter.",
    date: "2024-01-25",
    status: "Published",
    type: "News",
    category: "Research",
    author: "Research Coordinator"
  }
];

export default function NewsEvents() {
  const { toast } = useToast();
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and search logic
  const filteredNewsEvents = useMemo(() => {
    return sampleNewsEvents.filter((item) => {
      // Search filter
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = 
        statusFilter === "all" || 
        item.status.toLowerCase() === statusFilter;

      // Type filter
      const matchesType = 
        typeFilter === "all" || 
        item.type.toLowerCase() === typeFilter;

      // Category filter
      const matchesCategory = 
        categoryFilter === "all" || 
        item.category.toLowerCase() === categoryFilter;

      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });
  }, [searchTerm, statusFilter, typeFilter, categoryFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredNewsEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNewsEvents = filteredNewsEvents.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filters change
  const handleFiltersChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  // Action handlers
  const handleViewDetails = (newsEvent: NewsEvent) => {
    toast({
      title: "View Details",
      description: `Opening details for "${newsEvent.title}"`,
    });
  };

  const handleEdit = (newsEvent: NewsEvent) => {
    toast({
      title: "Edit News/Event",
      description: `Opening edit form for "${newsEvent.title}"`,
    });
  };

  const handleDelete = (newsEvent: NewsEvent) => {
    toast({
      title: "Delete News/Event",
      description: `This would delete "${newsEvent.title}"`,
      variant: "destructive",
    });
  };

  const handleAddNewsEvent = () => {
    toast({
      title: "Add News/Event",
      description: "Opening news/event creation form",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">News & Events</h2>
            <p className="text-muted-foreground">
              Manage college news, announcements, and upcoming events.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button onClick={handleAddNewsEvent} className="gap-2 bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Add News/Event
            </Button>
          </div>
        </div>

        {/* Filters */}
        <NewsEventsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={(value) => {
            setStatusFilter(value);
            handleFiltersChange();
          }}
          typeFilter={typeFilter}
          setTypeFilter={(value) => {
            setTypeFilter(value);
            handleFiltersChange();
          }}
          categoryFilter={categoryFilter}
          setCategoryFilter={(value) => {
            setCategoryFilter(value);
            handleFiltersChange();
          }}
          onClearFilters={clearFilters}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredNewsEvents.length} of {sampleNewsEvents.length} items
          </p>
        </div>

        {/* News & Events List */}
        <NewsEventsList
          newsEvents={paginatedNewsEvents}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {filteredNewsEvents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNewsEvents.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}