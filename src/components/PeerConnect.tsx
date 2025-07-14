import { useState } from "react";
import { Search, MessageCircle, UserPlus, Users, Star, MapPin, BookOpen, Calendar, Filter, Video, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  members: number;
  maxMembers: number;
  meetingTime: string;
  isPublic: boolean;
  tags: string[];
  admin: string;
}

interface Peer {
  id: string;
  name: string;
  avatar?: string;
  year: string;
  branch: string;
  location: string;
  subjects: string[];
  rating: number;
  studyGroups: string[];
  isOnline: boolean;
  bio: string;
  skills: string[];
}

interface StudySession {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  host: string;
  participants: number;
  maxParticipants: number;
  type: "virtual" | "in-person";
  location?: string;
  meetingLink?: string;
}

const PeerConnect = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [activeTab, setActiveTab] = useState("peers");

  const studyGroups: StudyGroup[] = [
    {
      id: "1",
      name: "Data Structures Study Circle",
      subject: "Computer Science",
      description: "Weekly DSA problem solving and concept discussions",
      members: 8,
      maxMembers: 12,
      meetingTime: "Tuesdays 7:00 PM",
      isPublic: true,
      tags: ["algorithms", "coding", "interview-prep"],
      admin: "Alice Johnson"
    },
    {
      id: "2",
      name: "Physics Lab Partners",
      subject: "Physics",
      description: "Collaborate on physics experiments and lab reports",
      members: 6,
      maxMembers: 8,
      meetingTime: "Fridays 3:00 PM",
      isPublic: true,
      tags: ["experiments", "lab-work", "reports"],
      admin: "Bob Smith"
    }
  ];

  const peers: Peer[] = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "",
      year: "3rd Year",
      branch: "Computer Science",
      location: "Mumbai",
      subjects: ["Data Structures", "Algorithms", "Database Systems"],
      rating: 4.8,
      studyGroups: ["Data Structures Study Circle"],
      isOnline: true,
      bio: "Passionate about algorithms and competitive programming. Always happy to help with DSA concepts!",
      skills: ["C++", "Python", "React"]
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "",
      year: "2nd Year",
      branch: "Physics",
      location: "Delhi",
      subjects: ["Quantum Mechanics", "Thermodynamics", "Optics"],
      rating: 4.6,
      studyGroups: ["Physics Lab Partners"],
      isOnline: false,
      bio: "Physics enthusiast with a love for quantum mechanics and experimental physics.",
      skills: ["MATLAB", "Python", "Lab Techniques"]
    },
    {
      id: "3",
      name: "Carol Davis",
      avatar: "",
      year: "4th Year",
      branch: "Mathematics",
      location: "Bangalore",
      subjects: ["Calculus", "Linear Algebra", "Statistics"],
      rating: 4.9,
      studyGroups: [],
      isOnline: true,
      bio: "Math tutor with 2+ years experience. Love helping students with complex mathematical concepts.",
      skills: ["Mathematical Modeling", "R", "Statistics"]
    }
  ];

  const studySessions: StudySession[] = [
    {
      id: "1",
      title: "Binary Trees Deep Dive",
      subject: "Data Structures",
      date: "2024-01-20",
      time: "7:00 PM",
      duration: "2 hours",
      host: "Alice Johnson",
      participants: 5,
      maxParticipants: 10,
      type: "virtual",
      meetingLink: "https://meet.google.com/abc-def-ghi"
    },
    {
      id: "2",
      title: "Quantum Mechanics Problem Solving",
      subject: "Physics",
      date: "2024-01-21",
      time: "4:00 PM",
      duration: "1.5 hours",
      host: "Bob Smith",
      participants: 3,
      maxParticipants: 6,
      type: "in-person",
      location: "Physics Lab, Room 201"
    }
  ];

  const subjects = ["Computer Science", "Physics", "Mathematics", "Chemistry", "Engineering"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const filteredPeers = peers.filter(peer => {
    const matchesSearch = peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         peer.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         peer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || peer.subjects.includes(selectedSubject);
    const matchesYear = selectedYear === "all" || peer.year === selectedYear;
    
    return matchesSearch && matchesSubject && matchesYear;
  });

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || group.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Peer Connect
        </h1>
        <p className="text-muted-foreground">Connect with fellow students, join study groups, and collaborate</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Peers</p>
                <p className="text-2xl font-bold">{peers.filter(p => p.isOnline).length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Groups</p>
                <p className="text-2xl font-bold">{studyGroups.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions Today</p>
                <p className="text-2xl font-bold">{studySessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Rating</p>
                <p className="text-2xl font-bold text-yellow-600">4.7</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search peers, groups, or subjects..."
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
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="peers">Peers</TabsTrigger>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="peers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeers.map((peer) => (
              <Card key={peer.id} className="hover:shadow-card transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={peer.avatar} />
                          <AvatarFallback>{getInitials(peer.name)}</AvatarFallback>
                        </Avatar>
                        {peer.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{peer.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{peer.year} • {peer.branch}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{peer.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {peer.bio}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{peer.location}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {peer.subjects.slice(0, 2).map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {peer.subjects.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{peer.subjects.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {peer.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                  
                  {peer.studyGroups.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Active in {peer.studyGroups.length} study group{peer.studyGroups.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-card transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{group.subject}</p>
                    </div>
                    <Badge variant={group.isPublic ? "default" : "secondary"}>
                      {group.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{group.members}/{group.maxMembers} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{group.meetingTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Admin: {group.admin}
                  </div>
                  
                  <Button className="w-full gap-2">
                    <UserPlus className="h-4 w-4" />
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="space-y-4">
            {studySessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{session.title}</h3>
                        <Badge variant="outline">{session.subject}</Badge>
                        <Badge className={session.type === "virtual" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                          {session.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{session.time}</span>
                        </div>
                        <div>
                          Duration: {session.duration}
                        </div>
                        <div>
                          Host: {session.host}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          {session.participants}/{session.maxParticipants} participants
                        </div>
                        {session.type === "in-person" && session.location && (
                          <div className="text-sm text-muted-foreground">
                            📍 {session.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Join Session
                      </Button>
                      {session.type === "virtual" && (
                        <Button size="sm" variant="outline" className="gap-2">
                          <Video className="h-4 w-4" />
                          Meeting Link
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Messages</h3>
              <p className="text-muted-foreground mb-4">
                Connect with peers to start messaging
              </p>
              <Button>Start Conversation</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredPeers.length === 0 && activeTab === "peers" && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No peers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find study partners
          </p>
        </div>
      )}
    </div>
  );
};

export default PeerConnect;