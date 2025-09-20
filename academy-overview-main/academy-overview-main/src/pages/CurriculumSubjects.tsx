import { useState } from "react";
import { Plus, Edit, Trash2, Book, Clock, Users, GraduationCap } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/SearchBar";
import { subjects } from "../../data/subjects";

// Sample data for subjects (same as in Curriculum page)
const sampleSubjects = subjects;

export default function CurriculumSubjects() {
  const [subjects] = useState(sampleSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSubjectData = subjects.find(subject => subject.id === selectedSubject);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Curriculum - Subjects</h1>
            <p className="text-muted-foreground">
              Browse and manage subjects in the curriculum
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subjects List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Subjects
              </CardTitle>
              <CardDescription>
                Click on a subject to view details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSubjects.map((subject) => (
                  <Card 
                    key={subject.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSubject === subject.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{subject.code}</Badge>
                            <Badge variant="secondary">{subject.credits} Credits</Badge>
                          </div>
                          <h3 className="font-medium mb-1">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {subject.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Theory: {subject.totalTheoryHours}h
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Practical: {subject.totalPracticalHours}h
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Subject Details
              </CardTitle>
              <CardDescription>
                {selectedSubjectData 
                  ? `Details for ${selectedSubjectData.name}`
                  : "Select a subject to view details"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSubjectData ? (
                <div className="space-y-6">
                  {/* Subject Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Subject Code</p>
                      <p className="text-lg font-semibold">{selectedSubjectData.code}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Credits</p>
                      <p className="text-lg font-semibold">{selectedSubjectData.credits}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                      <p className="text-lg font-semibold">
                        {selectedSubjectData.totalTheoryHours + selectedSubjectData.totalPracticalHours}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm">{selectedSubjectData.description}</p>
                  </div>

                  {/* Prerequisites */}
                  {selectedSubjectData.prerequisites && selectedSubjectData.prerequisites.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Prerequisites</p>
                      <div className="flex gap-2">
                        {selectedSubjectData.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline">{prereq}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assessment Pattern */}
                  {selectedSubjectData.assessmentPattern && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Assessment Pattern</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Internal Marks</p>
                          <p className="text-sm font-medium">{selectedSubjectData.assessmentPattern.internalMarks}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">External Marks</p>
                          <p className="text-sm font-medium">{selectedSubjectData.assessmentPattern.externalMarks}</p>
                        </div>
                        {selectedSubjectData.assessmentPattern.practicalMarks && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Practical Marks</p>
                            <p className="text-sm font-medium">{selectedSubjectData.assessmentPattern.practicalMarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sub Topics */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">Topics</p>
                    <div className="space-y-3">
                      {selectedSubjectData.subTopics.map((topic) => (
                        <Card key={topic.id}>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">{topic.name}</h4>
                              <p className="text-sm text-muted-foreground">{topic.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Theory: {topic.theoryHours}h
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Practical: {topic.practicalHours}h
                                </div>
                              </div>
                              {topic.learningOutcomes && topic.learningOutcomes.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Learning Outcomes:</p>
                                  <ul className="text-xs text-muted-foreground space-y-1">
                                    {topic.learningOutcomes.map((outcome, index) => (
                                      <li key={index} className="flex items-start gap-1">
                                        <span className="text-primary">•</span>
                                        <span>{outcome}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Book className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a subject from the left to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}