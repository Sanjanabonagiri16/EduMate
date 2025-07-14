import { useState } from "react";
import { Calendar, Check, X, Clock, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  subject: string;
  date: string;
  status: "present" | "absent" | "late";
  classType: "lecture" | "lab" | "practical";
}

interface SubjectStats {
  subject: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  required: number;
}

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const attendanceRecords: AttendanceRecord[] = [
    { id: "1", subject: "Data Structures", date: "2024-01-15", status: "present", classType: "lecture" },
    { id: "2", subject: "Physics", date: "2024-01-15", status: "present", classType: "lab" },
    { id: "3", subject: "Mathematics", date: "2024-01-14", status: "absent", classType: "lecture" },
    { id: "4", subject: "Data Structures", date: "2024-01-14", status: "late", classType: "practical" },
    { id: "5", subject: "Chemistry", date: "2024-01-13", status: "present", classType: "lecture" }
  ];

  const subjectStats: SubjectStats[] = [
    { subject: "Data Structures", totalClasses: 25, attended: 23, percentage: 92, required: 75 },
    { subject: "Physics", totalClasses: 20, attended: 18, percentage: 90, required: 75 },
    { subject: "Mathematics", totalClasses: 22, attended: 16, percentage: 73, required: 75 },
    { subject: "Chemistry", totalClasses: 18, attended: 17, percentage: 94, required: 75 },
    { subject: "Computer Networks", totalClasses: 15, attended: 12, percentage: 80, required: 75 }
  ];

  const subjects = [...new Set(attendanceRecords.map(record => record.subject))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800 border-green-200";
      case "absent": return "bg-red-100 text-red-800 border-red-200";
      case "late": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <Check className="h-4 w-4" />;
      case "absent": return <X className="h-4 w-4" />;
      case "late": return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPercentageColor = (percentage: number, required: number) => {
    if (percentage >= required + 10) return "text-green-600";
    if (percentage >= required) return "text-blue-600";
    if (percentage >= required - 5) return "text-yellow-600";
    return "text-red-600";
  };

  const overallStats = {
    totalClasses: subjectStats.reduce((sum, stat) => sum + stat.totalClasses, 0),
    totalAttended: subjectStats.reduce((sum, stat) => sum + stat.attended, 0),
    averagePercentage: Math.round(subjectStats.reduce((sum, stat) => sum + stat.percentage, 0) / subjectStats.length)
  };

  const criticalSubjects = subjectStats.filter(stat => stat.percentage < stat.required + 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Attendance Tracker
        </h1>
        <p className="text-muted-foreground">Monitor your class attendance and maintain required percentage</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{overallStats.totalClasses}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attended</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.totalAttended}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average %</p>
                <p className={`text-2xl font-bold ${getPercentageColor(overallStats.averagePercentage, 75)}`}>
                  {overallStats.averagePercentage}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-red-600">{criticalSubjects.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjectStats.map((stat) => (
              <div key={stat.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{stat.subject}</h3>
                    <Badge 
                      variant={stat.percentage >= stat.required ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {stat.percentage}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.attended}/{stat.totalClasses} classes
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Progress 
                    value={stat.percentage} 
                    className="flex-1" 
                  />
                  <div className="text-sm text-muted-foreground min-w-fit">
                    Need {stat.required}%
                  </div>
                </div>
                {stat.percentage < stat.required && (
                  <p className="text-xs text-red-600">
                    ⚠️ Need to attend {Math.ceil((stat.required * stat.totalClasses / 100) - stat.attended)} more classes to reach {stat.required}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Attendance</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceRecords
              .filter(record => selectedSubject === "all" || record.subject === selectedSubject)
              .filter(record => !selectedDate || record.date === format(selectedDate, "yyyy-MM-dd"))
              .map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full border ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{record.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {record.classType} • {format(new Date(record.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;