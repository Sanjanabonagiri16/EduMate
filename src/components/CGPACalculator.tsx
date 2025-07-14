import { useState } from "react";
import { Plus, Calculator, TrendingUp, Award, BookOpen, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  grade: string;
  gradePoints: number;
  semester: number;
}

interface SemesterStats {
  semester: number;
  subjects: Subject[];
  sgpa: number;
  totalCredits: number;
}

const CGPACalculator = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Data Structures", code: "CS201", credits: 4, grade: "A", gradePoints: 9, semester: 3 },
    { id: "2", name: "Physics", code: "PH101", credits: 3, grade: "B+", gradePoints: 8, semester: 3 },
    { id: "3", name: "Mathematics", code: "MA201", credits: 4, grade: "A+", gradePoints: 10, semester: 3 },
    { id: "4", name: "Chemistry", code: "CH101", credits: 3, grade: "B", gradePoints: 7, semester: 2 },
    { id: "5", name: "Programming", code: "CS101", credits: 4, grade: "A+", gradePoints: 10, semester: 2 }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    credits: "",
    grade: "",
    semester: ""
  });

  const gradeOptions = [
    { grade: "A+", points: 10 },
    { grade: "A", points: 9 },
    { grade: "B+", points: 8 },
    { grade: "B", points: 7 },
    { grade: "C+", points: 6 },
    { grade: "C", points: 5 },
    { grade: "D", points: 4 },
    { grade: "F", points: 0 }
  ];

  // Calculate semester-wise stats
  const semesterStats: SemesterStats[] = [];
  const semesters = [...new Set(subjects.map(s => s.semester))].sort();

  semesters.forEach(semester => {
    const semesterSubjects = subjects.filter(s => s.semester === semester);
    const totalCredits = semesterSubjects.reduce((sum, s) => sum + s.credits, 0);
    const totalGradePoints = semesterSubjects.reduce((sum, s) => sum + (s.gradePoints * s.credits), 0);
    const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    semesterStats.push({
      semester,
      subjects: semesterSubjects,
      sgpa: Math.round(sgpa * 100) / 100,
      totalCredits
    });
  });

  // Calculate overall CGPA
  const overallCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const overallGradePoints = subjects.reduce((sum, s) => sum + (s.gradePoints * s.credits), 0);
  const cgpa = overallCredits > 0 ? overallGradePoints / overallCredits : 0;

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code && newSubject.credits && newSubject.grade && newSubject.semester) {
      const gradeInfo = gradeOptions.find(g => g.grade === newSubject.grade);
      
      const subject: Subject = {
        id: Date.now().toString(),
        name: newSubject.name,
        code: newSubject.code,
        credits: parseInt(newSubject.credits),
        grade: newSubject.grade,
        gradePoints: gradeInfo?.points || 0,
        semester: parseInt(newSubject.semester)
      };

      setSubjects(prev => [...prev, subject]);
      setNewSubject({ name: "", code: "", credits: "", grade: "", semester: "" });
      setIsAdding(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-green-100 text-green-800";
    if (grade === "B+" || grade === "B") return "bg-blue-100 text-blue-800";
    if (grade === "C+" || grade === "C") return "bg-yellow-100 text-yellow-800";
    if (grade === "D") return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getCGPAStatus = (cgpa: number) => {
    if (cgpa >= 9) return { status: "Excellent", color: "text-green-600", description: "Outstanding performance!" };
    if (cgpa >= 8) return { status: "Very Good", color: "text-blue-600", description: "Great academic performance" };
    if (cgpa >= 7) return { status: "Good", color: "text-yellow-600", description: "Good academic standing" };
    if (cgpa >= 6) return { status: "Satisfactory", color: "text-orange-600", description: "Room for improvement" };
    return { status: "Needs Improvement", color: "text-red-600", description: "Focus on studies required" };
  };

  const cgpaStatus = getCGPAStatus(cgpa);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CGPA Calculator
          </h1>
          <p className="text-muted-foreground">Track your academic performance and calculate CGPA</p>
        </div>

        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Subject name"
                value={newSubject.name}
                onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Subject code"
                value={newSubject.code}
                onChange={(e) => setNewSubject(prev => ({ ...prev, code: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Credits"
                value={newSubject.credits}
                onChange={(e) => setNewSubject(prev => ({ ...prev, credits: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Semester"
                value={newSubject.semester}
                onChange={(e) => setNewSubject(prev => ({ ...prev, semester: e.target.value }))}
              />
              <Select value={newSubject.grade} onValueChange={(value) => setNewSubject(prev => ({ ...prev, grade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map(option => (
                    <SelectItem key={option.grade} value={option.grade}>
                      {option.grade} ({option.points} points)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubject}>
                  Add Subject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CGPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current CGPA</p>
                <p className={`text-4xl font-bold ${cgpaStatus.color}`}>
                  {cgpa.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">{cgpaStatus.status}</p>
              </div>
              <div className="text-right">
                <Calculator className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Out of 10.0</p>
              </div>
            </div>
            <Progress value={cgpa * 10} className="mb-2" />
            <p className="text-xs text-muted-foreground">{cgpaStatus.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold">{overallCredits}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subjects</p>
                <p className="text-2xl font-bold">{subjects.length}</p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semester-wise Breakdown */}
      <div className="space-y-6">
        {semesterStats.map((semesterData) => (
          <Card key={semesterData.semester}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  Semester {semesterData.semester}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    SGPA: {semesterData.sgpa}
                  </Badge>
                  <Badge variant="secondary">
                    {semesterData.totalCredits} Credits
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {semesterData.subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold">{subject.name}</h4>
                        <p className="text-sm text-muted-foreground">{subject.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{subject.credits} Credits</p>
                        <p className="text-xs text-muted-foreground">{subject.gradePoints} grade points</p>
                      </div>
                      <Badge className={getGradeColor(subject.grade)}>
                        {subject.grade}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSubjects(prev => prev.filter(s => s.id !== subject.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No subjects added</h3>
          <p className="text-muted-foreground mb-4">Add your subjects to calculate CGPA</p>
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Subject
          </Button>
        </div>
      )}
    </div>
  );
};

export default CGPACalculator;