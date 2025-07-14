import { useState } from "react";
import { Plus, ExternalLink, Github, Calendar, Code, Folder, Eye, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  type: "personal" | "academic" | "freelance" | "open-source";
  technologies: string[];
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  demoUrl?: string;
  isStarred: boolean;
  progress: number;
  collaborators: number;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "EduMate - Student Management System",
      description: "A comprehensive student management system with features for tracking assignments, grades, and schedules.",
      status: "completed",
      type: "academic",
      technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
      startDate: "2023-11-01",
      endDate: "2024-01-15",
      githubUrl: "https://github.com/user/edumate",
      demoUrl: "https://edumate-demo.com",
      isStarred: true,
      progress: 100,
      collaborators: 3
    },
    {
      id: "2",
      title: "Weather Dashboard",
      description: "Real-time weather dashboard with interactive maps and forecasting.",
      status: "in-progress",
      type: "personal",
      technologies: ["Vue.js", "Node.js", "OpenWeather API", "Chart.js"],
      startDate: "2024-01-10",
      githubUrl: "https://github.com/user/weather-dashboard",
      isStarred: false,
      progress: 65,
      collaborators: 1
    },
    {
      id: "3",
      title: "E-commerce Mobile App",
      description: "Cross-platform mobile app for online shopping with payment integration.",
      status: "planning",
      type: "freelance",
      technologies: ["React Native", "Firebase", "Stripe", "Redux"],
      startDate: "2024-02-01",
      isStarred: true,
      progress: 15,
      collaborators: 2
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "",
    type: "",
    technologies: "",
    startDate: "",
    endDate: "",
    githubUrl: "",
    demoUrl: ""
  });

  const statuses = [
    { value: "planning", label: "Planning", color: "bg-blue-100 text-blue-800" },
    { value: "in-progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
    { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
    { value: "on-hold", label: "On Hold", color: "bg-gray-100 text-gray-800" }
  ];

  const types = [
    { value: "personal", label: "Personal", color: "bg-purple-100 text-purple-800" },
    { value: "academic", label: "Academic", color: "bg-blue-100 text-blue-800" },
    { value: "freelance", label: "Freelance", color: "bg-green-100 text-green-800" },
    { value: "open-source", label: "Open Source", color: "bg-orange-100 text-orange-800" }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    const matchesType = selectedType === "all" || project.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateProject = () => {
    if (newProject.title && newProject.description && newProject.status && newProject.type) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        status: newProject.status as "planning" | "in-progress" | "completed" | "on-hold",
        type: newProject.type as "personal" | "academic" | "freelance" | "open-source",
        technologies: newProject.technologies.split(",").map(tech => tech.trim()).filter(Boolean),
        startDate: newProject.startDate,
        endDate: newProject.endDate || undefined,
        githubUrl: newProject.githubUrl || undefined,
        demoUrl: newProject.demoUrl || undefined,
        isStarred: false,
        progress: newProject.status === "completed" ? 100 : newProject.status === "planning" ? 0 : 50,
        collaborators: 1
      };

      setProjects(prev => [project, ...prev]);
      setNewProject({ title: "", description: "", status: "", type: "", technologies: "", startDate: "", endDate: "", githubUrl: "", demoUrl: "" });
      setIsCreating(false);
    }
  };

  const toggleStar = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, isStarred: !p.isStarred } : p
    ));
  };

  const getStatusConfig = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getTypeConfig = (type: string) => {
    return types.find(t => t.value === type) || types[0];
  };

  const projectStats = {
    total: projects.length,
    completed: projects.filter(p => p.status === "completed").length,
    inProgress: projects.filter(p => p.status === "in-progress").length,
    starred: projects.filter(p => p.isStarred).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Projects Portfolio
          </h1>
          <p className="text-muted-foreground">Showcase your development projects and achievements</p>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Project title"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Project description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={newProject.status} onValueChange={(value) => setNewProject(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={newProject.type} onValueChange={(value) => setNewProject(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Technologies (comma separated)"
                value={newProject.technologies}
                onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date (Optional)</label>
                  <Input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="GitHub URL (optional)"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                />
                <Input
                  placeholder="Demo URL (optional)"
                  value={newProject.demoUrl}
                  onChange={(e) => setNewProject(prev => ({ ...prev, demoUrl: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
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
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projectStats.total}</p>
              </div>
              <Folder className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{projectStats.completed}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{projectStats.inProgress}</p>
              </div>
              <Code className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold text-blue-600">{projectStats.starred}</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const statusConfig = getStatusConfig(project.status);
              const typeConfig = getTypeConfig(project.type);
              
              return (
                <Card key={project.id} className="hover:shadow-card transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStar(project.id)}
                            className={project.isStarred ? "text-yellow-500" : ""}
                          >
                            <Star className={`h-4 w-4 ${project.isStarred ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                          <Badge className={typeConfig.color}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    {project.status !== "planning" && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                      {project.endDate && (
                        <span>Ended: {new Date(project.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <Github className="h-3 w-3" />
                          </Button>
                        )}
                        {project.demoUrl && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewingProject(project)}>
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
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {filteredProjects.map((project) => {
            const statusConfig = getStatusConfig(project.status);
            const typeConfig = getTypeConfig(project.type);
            
            return (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        {project.isStarred && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                        <Badge className={typeConfig.color}>
                          {typeConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                        {project.endDate && (
                          <span>Ended: {new Date(project.endDate).toLocaleDateString()}</span>
                        )}
                        <span>{project.collaborators} collaborator{project.collaborators !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <Github className="h-3 w-3" />
                          Code
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Demo
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setViewingProject(project)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Project Detail Dialog */}
      <Dialog open={!!viewingProject} onOpenChange={() => setViewingProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewingProject?.title}
              {viewingProject?.isStarred && (
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              )}
            </DialogTitle>
          </DialogHeader>
          {viewingProject && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusConfig(viewingProject.status).color}>
                  {getStatusConfig(viewingProject.status).label}
                </Badge>
                <Badge className={getTypeConfig(viewingProject.type).color}>
                  {getTypeConfig(viewingProject.type).label}
                </Badge>
              </div>
              
              <p className="text-sm">{viewingProject.description}</p>
              
              <div>
                <h4 className="font-semibold mb-2">Technologies Used:</h4>
                <div className="flex flex-wrap gap-1">
                  {viewingProject.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Start Date:</span>
                  <br />
                  {new Date(viewingProject.startDate).toLocaleDateString()}
                </div>
                {viewingProject.endDate && (
                  <div>
                    <span className="font-medium">End Date:</span>
                    <br />
                    {new Date(viewingProject.endDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {viewingProject.githubUrl && (
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" />
                    View Code
                  </Button>
                )}
                {viewingProject.demoUrl && (
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedStatus !== "all" || selectedType !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"
            }
          </p>
          {!searchTerm && selectedStatus === "all" && selectedType === "all" && (
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;