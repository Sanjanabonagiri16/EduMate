import { Calendar, Clock, BookOpen, CheckSquare, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const todaysClasses = [
    { subject: "Data Structures", time: "09:00 AM", room: "CS-101", status: "upcoming" },
    { subject: "Database Systems", time: "11:00 AM", room: "CS-201", status: "current" },
    { subject: "Software Engineering", time: "02:00 PM", room: "CS-301", status: "upcoming" },
  ];

  const pendingAssignments = [
    { title: "Binary Tree Implementation", subject: "Data Structures", dueDate: "Tomorrow", priority: "high" },
    { title: "Database Design Project", subject: "DBMS", dueDate: "3 days", priority: "medium" },
    { title: "UML Diagrams", subject: "Software Eng", dueDate: "1 week", priority: "low" },
  ];

  const stats = [
    { label: "Attendance", value: "87%", icon: TrendingUp, color: "success" },
    { label: "CGPA", value: "8.5", icon: BookOpen, color: "primary" },
    { label: "Pending", value: "5", icon: CheckSquare, color: "warning" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Good morning! 👋
        </h1>
        <p className="text-muted-foreground text-lg">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysClasses.map((classItem, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-l-4 ${
                  classItem.status === 'current' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{classItem.subject}</h3>
                    <p className="text-sm text-muted-foreground">{classItem.room}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={classItem.status === 'current' ? 'default' : 'secondary'}>
                      {classItem.time}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View Full Timetable
            </Button>
          </CardContent>
        </Card>

        {/* Pending Assignments */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-accent" />
              Pending Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingAssignments.map((assignment, index) => (
              <div key={index} className="p-4 rounded-lg bg-card border hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{assignment.title}</h3>
                  <Badge 
                    variant={
                      assignment.priority === 'high' ? 'destructive' : 
                      assignment.priority === 'medium' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {assignment.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{assignment.subject}</p>
                <p className="text-xs text-warning">Due in {assignment.dueDate}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Assignments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: "Add Class", bg: "bg-gradient-primary" },
            { icon: CheckSquare, label: "New Assignment", bg: "bg-gradient-secondary" },
            { icon: BookOpen, label: "Take Notes", bg: "bg-primary" },
            { icon: Bell, label: "Set Reminder", bg: "bg-accent" },
          ].map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex-col gap-2 ${action.bg} text-white border-0 hover:scale-105 transition-transform`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;