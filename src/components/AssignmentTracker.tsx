import { useState } from "react";
import { CheckSquare, Plus, Calendar, AlertTriangle, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const AssignmentTracker = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const assignments = [
    {
      id: 1,
      title: "Binary Tree Implementation",
      subject: "Data Structures",
      description: "Implement AVL tree with insertion, deletion, and traversal operations",
      dueDate: "2024-01-20",
      priority: "high",
      status: "pending",
      progress: 60,
    },
    {
      id: 2,
      title: "Database Design Project",
      subject: "DBMS",
      description: "Design and implement a library management system database",
      dueDate: "2024-01-25",
      priority: "medium",
      status: "pending",
      progress: 30,
    },
    {
      id: 3,
      title: "UML Class Diagrams",
      subject: "Software Engineering",
      description: "Create UML diagrams for online shopping system",
      dueDate: "2024-01-28",
      priority: "low",
      status: "pending",
      progress: 10,
    },
    {
      id: 4,
      title: "Network Protocol Analysis",
      subject: "Computer Networks",
      description: "Analyze TCP/IP protocol suite and create presentation",
      dueDate: "2024-01-15",
      priority: "high",
      status: "completed",
      progress: 100,
    },
    {
      id: 5,
      title: "Web Application Development",
      subject: "Web Development",
      description: "Build a responsive e-commerce website using React",
      dueDate: "2024-02-05",
      priority: "medium",
      status: "pending",
      progress: 0,
    },
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: "text-destructive" };
    if (diffDays === 0) return { text: "Due today", color: "text-warning" };
    if (diffDays === 1) return { text: "Due tomorrow", color: "text-warning" };
    return { text: `${diffDays} days left`, color: "text-muted-foreground" };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const toggleAssignmentStatus = (id: number) => {
    // In a real app, this would update the backend
    console.log(`Toggle assignment ${id} status`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Assignments
          </h1>
          <p className="text-muted-foreground">Track and manage your assignments</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{assignments.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{assignments.filter(a => a.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{assignments.filter(a => a.priority === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'pending' | 'completed')}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assignments found</p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="shadow-card hover:shadow-elevated transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={assignment.status === 'completed'}
                        onCheckedChange={() => toggleAssignmentStatus(assignment.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${assignment.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                          {assignment.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">{assignment.subject}</p>
                        <p className="text-sm">{assignment.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={getPriorityColor(assignment.priority)}>
                        {assignment.priority}
                      </Badge>
                      <div className="text-right">
                        <div className={`text-sm ${getDaysUntilDue(assignment.dueDate).color}`}>
                          {getDaysUntilDue(assignment.dueDate).text}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {assignment.status === 'pending' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{assignment.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${assignment.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssignmentTracker;