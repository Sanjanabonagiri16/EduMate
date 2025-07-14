import { useState } from "react";
import { Plus, Search, Filter, BookOpen, Clock, Award, Eye, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Question {
  id: string;
  question: string;
  answer: string;
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  type: "mcq" | "short" | "long" | "numerical";
  year: number;
  tags: string[];
  isStarred: boolean;
  createdAt: string;
}

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "What is the time complexity of binary search?",
      answer: "O(log n) - Binary search divides the search space in half with each comparison.",
      subject: "Data Structures",
      topic: "Searching Algorithms",
      difficulty: "medium",
      type: "short",
      year: 2023,
      tags: ["algorithms", "complexity", "searching"],
      isStarred: true,
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      question: "Explain the concept of polymorphism in OOP",
      answer: "Polymorphism allows objects of different types to be treated as objects of a common base type.",
      subject: "Object Oriented Programming",
      topic: "Concepts",
      difficulty: "medium",
      type: "long",
      year: 2023,
      tags: ["oop", "polymorphism", "concepts"],
      isStarred: false,
      createdAt: "2024-01-14T15:45:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answer: "",
    subject: "",
    topic: "",
    difficulty: "",
    type: "",
    year: "",
    tags: ""
  });

  const subjects = ["Data Structures", "Object Oriented Programming", "Database Systems", "Computer Networks", "Mathematics"];
  const difficulties = ["easy", "medium", "hard"];
  const questionTypes = [
    { value: "mcq", label: "Multiple Choice" },
    { value: "short", label: "Short Answer" },
    { value: "long", label: "Long Answer" },
    { value: "numerical", label: "Numerical" }
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         question.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || question.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "all" || question.difficulty === selectedDifficulty;
    const matchesType = selectedType === "all" || question.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });

  const handleCreateQuestion = () => {
    if (newQuestion.question && newQuestion.answer && newQuestion.subject) {
      const question: Question = {
        id: Date.now().toString(),
        question: newQuestion.question,
        answer: newQuestion.answer,
        subject: newQuestion.subject,
        topic: newQuestion.topic,
        difficulty: newQuestion.difficulty as "easy" | "medium" | "hard",
        type: newQuestion.type as "mcq" | "short" | "long" | "numerical",
        year: parseInt(newQuestion.year) || new Date().getFullYear(),
        tags: newQuestion.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        isStarred: false,
        createdAt: new Date().toISOString()
      };

      setQuestions(prev => [question, ...prev]);
      setNewQuestion({ question: "", answer: "", subject: "", topic: "", difficulty: "", type: "", year: "", tags: "" });
      setIsCreating(false);
    }
  };

  const toggleStar = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, isStarred: !q.isStarred } : q
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mcq": return "🔘";
      case "short": return "📝";
      case "long": return "📄";
      case "numerical": return "🔢";
      default: return "❓";
    }
  };

  const starredQuestions = questions.filter(q => q.isStarred);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Question Bank
          </h1>
          <p className="text-muted-foreground">Build and practice with your custom question collection</p>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your question..."
                value={newQuestion.question}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                rows={3}
              />
              <Textarea
                placeholder="Enter the answer..."
                value={newQuestion.answer}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, answer: e.target.value }))}
                rows={4}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Topic"
                  value={newQuestion.topic}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, topic: e.target.value }))}
                />
                <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Year"
                  value={newQuestion.year}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, year: e.target.value }))}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuestion}>
                  Add Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{questions.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold text-yellow-600">{starredQuestions.length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {questionTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Questions */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="all">All Questions</TabsTrigger>
          <TabsTrigger value="starred">Starred ({starredQuestions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-card transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getTypeIcon(question.type)}</span>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline">{question.subject}</Badge>
                      {question.topic && <Badge variant="secondary">{question.topic}</Badge>}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {question.question}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {question.answer}
                    </p>
                    {question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {question.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStar(question.id)}
                      className={question.isStarred ? "text-yellow-500" : ""}
                    >
                      <Star className={`h-4 w-4 ${question.isStarred ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setViewingQuestion(question)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Year: {question.year}</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="starred" className="space-y-4">
          {starredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-card transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline">{question.subject}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {question.question}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {question.answer}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Question Detail Dialog */}
      <Dialog open={!!viewingQuestion} onOpenChange={() => setViewingQuestion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          {viewingQuestion && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(viewingQuestion.difficulty)}>
                  {viewingQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{viewingQuestion.subject}</Badge>
                {viewingQuestion.topic && <Badge variant="secondary">{viewingQuestion.topic}</Badge>}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Question:</h3>
                <p className="text-sm">{viewingQuestion.question}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Answer:</h3>
                <p className="text-sm">{viewingQuestion.answer}</p>
              </div>
              {viewingQuestion.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-1">
                    {viewingQuestion.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedSubject !== "all" || selectedDifficulty !== "all" || selectedType !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first question to get started"
            }
          </p>
          {!searchTerm && selectedSubject === "all" && selectedDifficulty === "all" && selectedType === "all" && (
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Question
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionBank;