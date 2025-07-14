import { useState } from "react";
import { Calendar, Clock, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Timetable = () => {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const schedule = {
    Monday: [
      { subject: "Data Structures", time: "09:00-10:30", room: "CS-101", professor: "Dr. Smith", color: "bg-blue-500" },
      { subject: "Database Systems", time: "11:00-12:30", room: "CS-201", professor: "Dr. Johnson", color: "bg-purple-500" },
      { subject: "Software Engineering", time: "02:00-03:30", room: "CS-301", professor: "Dr. Brown", color: "bg-green-500" },
    ],
    Tuesday: [
      { subject: "Computer Networks", time: "09:00-10:30", room: "CS-102", professor: "Dr. Wilson", color: "bg-orange-500" },
      { subject: "Web Development", time: "11:00-12:30", room: "Lab-1", professor: "Dr. Davis", color: "bg-pink-500" },
      { subject: "Mathematics", time: "02:00-03:30", room: "Math-101", professor: "Dr. Taylor", color: "bg-indigo-500" },
    ],
    Wednesday: [
      { subject: "Data Structures Lab", time: "09:00-11:00", room: "Lab-2", professor: "Dr. Smith", color: "bg-blue-500" },
      { subject: "Database Lab", time: "02:00-04:00", room: "Lab-3", professor: "Dr. Johnson", color: "bg-purple-500" },
    ],
    Thursday: [
      { subject: "Operating Systems", time: "09:00-10:30", room: "CS-103", professor: "Dr. Miller", color: "bg-red-500" },
      { subject: "Algorithm Design", time: "11:00-12:30", room: "CS-202", professor: "Dr. White", color: "bg-yellow-500" },
      { subject: "Project Work", time: "02:00-04:00", room: "CS-401", professor: "Dr. Brown", color: "bg-teal-500" },
    ],
    Friday: [
      { subject: "Computer Graphics", time: "09:00-10:30", room: "CS-104", professor: "Dr. Garcia", color: "bg-cyan-500" },
      { subject: "Seminar", time: "11:00-12:00", room: "Auditorium", professor: "Various", color: "bg-gray-500" },
    ],
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysClasses = schedule[today as keyof typeof schedule] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Timetable
          </h1>
          <p className="text-muted-foreground">Manage your class schedule</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'week' | 'day')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="week">Weekly View</TabsTrigger>
          <TabsTrigger value="day">Today's Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-6">
          {/* Weekly View */}
          <div className="grid gap-4">
            {Object.entries(schedule).map(([day, classes]) => (
              <Card key={day} className="shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {day}
                    <Badge variant="secondary" className="ml-auto">
                      {classes.length} classes
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {classes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No classes scheduled</p>
                  ) : (
                    <div className="space-y-3">
                      {classes.map((classItem, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${classItem.color}`} />
                            <div>
                              <h3 className="font-semibold">{classItem.subject}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {classItem.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {classItem.room}
                                </span>
                                <span>{classItem.professor}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="day" className="space-y-6">
          {/* Today's Schedule */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Today's Classes ({today})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysClasses.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No classes scheduled for today</p>
                  <Button variant="outline" className="mt-4">
                    Add a Class
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaysClasses.map((classItem, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-lg border-l-4 bg-card hover:shadow-card transition-all duration-200"
                      style={{ borderLeftColor: classItem.color.replace('bg-', '').replace('-500', '') }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{classItem.subject}</h3>
                        <Badge variant="outline">{classItem.time}</Badge>
                      </div>
                      <div className="space-y-1 text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {classItem.room}
                        </p>
                        <p>Professor: {classItem.professor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Timetable;