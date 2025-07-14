import { useState } from "react";
import { Plus, Star, TrendingUp, Award, Code, Palette, Database, Globe, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 1-100
  level: "beginner" | "intermediate" | "advanced" | "expert";
  verified: boolean;
  endorsements: number;
  projects: number;
  lastUsed: string;
  tags: string[];
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: "1",
      name: "React",
      category: "Frontend Development",
      proficiency: 85,
      level: "advanced",
      verified: true,
      endorsements: 12,
      projects: 8,
      lastUsed: "2024-01-15",
      tags: ["javascript", "ui", "components"]
    },
    {
      id: "2",
      name: "Python",
      category: "Programming Languages",
      proficiency: 90,
      level: "expert",
      verified: true,
      endorsements: 18,
      projects: 15,
      lastUsed: "2024-01-14",
      tags: ["backend", "data science", "automation"]
    },
    {
      id: "3",
      name: "UI/UX Design",
      category: "Design",
      proficiency: 70,
      level: "intermediate",
      verified: false,
      endorsements: 5,
      projects: 6,
      lastUsed: "2024-01-10",
      tags: ["figma", "prototyping", "user research"]
    },
    {
      id: "4",
      name: "PostgreSQL",
      category: "Database",
      proficiency: 75,
      level: "intermediate",
      verified: true,
      endorsements: 8,
      projects: 12,
      lastUsed: "2024-01-12",
      tags: ["sql", "database design", "optimization"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isAdding, setIsAdding] = useState(false);

  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "",
    proficiency: "",
    level: "",
    tags: ""
  });

  const categories = [
    { name: "Programming Languages", icon: Code, color: "bg-blue-100 text-blue-800" },
    { name: "Frontend Development", icon: Globe, color: "bg-green-100 text-green-800" },
    { name: "Backend Development", icon: Database, color: "bg-purple-100 text-purple-800" },
    { name: "Database", icon: Database, color: "bg-orange-100 text-orange-800" },
    { name: "Design", icon: Palette, color: "bg-pink-100 text-pink-800" },
    { name: "DevOps", icon: Code, color: "bg-gray-100 text-gray-800" }
  ];

  const levels = ["beginner", "intermediate", "advanced", "expert"];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || skill.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const skillsByCategory = categories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category === category.name),
    count: skills.filter(skill => skill.category === category.name).length
  }));

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.category && newSkill.proficiency && newSkill.level) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name,
        category: newSkill.category,
        proficiency: parseInt(newSkill.proficiency),
        level: newSkill.level as "beginner" | "intermediate" | "advanced" | "expert",
        verified: false,
        endorsements: 0,
        projects: 0,
        lastUsed: new Date().toISOString().split('T')[0],
        tags: newSkill.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      };

      setSkills(prev => [...prev, skill]);
      setNewSkill({ name: "", category: "", proficiency: "", level: "", tags: "" });
      setIsAdding(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-yellow-100 text-yellow-800";
      case "intermediate": return "bg-blue-100 text-blue-800";
      case "advanced": return "bg-purple-100 text-purple-800";
      case "expert": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return "bg-green-500";
    if (proficiency >= 60) return "bg-blue-500";
    if (proficiency >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const overallStats = {
    totalSkills: skills.length,
    verifiedSkills: skills.filter(s => s.verified).length,
    averageProficiency: Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length),
    totalProjects: skills.reduce((sum, s) => sum + s.projects, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Skills Portfolio
          </h1>
          <p className="text-muted-foreground">Track and showcase your technical skills</p>
        </div>

        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Skill name"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              />
              <Select value={newSkill.category} onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>
                <label className="text-sm font-medium">Proficiency Level: {newSkill.proficiency}%</label>
                <Input
                  type="range"
                  min="1"
                  max="100"
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <Select value={newSkill.level} onValueChange={(value) => setNewSkill(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Tags (comma separated)"
                value={newSkill.tags}
                onChange={(e) => setNewSkill(prev => ({ ...prev, tags: e.target.value }))}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSkill}>
                  Add Skill
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
                <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                <p className="text-2xl font-bold">{overallStats.totalSkills}</p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.verifiedSkills}</p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Proficiency</p>
                <p className="text-2xl font-bold text-blue-600">{overallStats.averageProficiency}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projects</p>
                <p className="text-2xl font-bold">{overallStats.totalProjects}</p>
              </div>
              <Code className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skills */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <Card key={skill.id} className="hover:shadow-card transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        {skill.verified && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{skill.category}</p>
                    </div>
                    <Badge className={getLevelColor(skill.level)}>
                      {skill.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Proficiency</span>
                      <span className="font-medium">{skill.proficiency}%</span>
                    </div>
                    <Progress 
                      value={skill.proficiency} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {skill.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{skill.endorsements} endorsements</span>
                    <span>{skill.projects} projects</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last used: {new Date(skill.lastUsed).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          {skillsByCategory.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">{category.count} skills</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{skill.name}</h4>
                          {skill.verified && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getLevelColor(skill.level)} variant="outline">
                            {skill.level}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <Progress value={skill.proficiency} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No skills found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all" || selectedLevel !== "all"
              ? "Try adjusting your search or filters"
              : "Add your first skill to get started"
            }
          </p>
          {!searchTerm && selectedCategory === "all" && selectedLevel === "all" && (
            <Button onClick={() => setIsAdding(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Skill
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Skills;