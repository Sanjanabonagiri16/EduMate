import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, Clock, Coffee, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface PomodoroSession {
  id: string;
  type: "work" | "shortBreak" | "longBreak";
  duration: number;
  completedAt: string;
}

interface PomodoroStats {
  totalSessions: number;
  totalWorkTime: number;
  averageSessionsPerDay: number;
  longestStreak: number;
}

const PomodoroTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [currentMode, setCurrentMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false
  });

  const [sessions] = useState<PomodoroSession[]>([
    { id: "1", type: "work", duration: 25, completedAt: "2024-01-15T10:30:00Z" },
    { id: "2", type: "shortBreak", duration: 5, completedAt: "2024-01-15T10:35:00Z" },
    { id: "3", type: "work", duration: 25, completedAt: "2024-01-15T11:00:00Z" }
  ]);

  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();

  const modes = {
    work: { 
      duration: settings.workDuration, 
      label: "Focus Time", 
      color: "bg-red-500",
      description: "Time to focus and be productive!"
    },
    shortBreak: { 
      duration: settings.shortBreakDuration, 
      label: "Short Break", 
      color: "bg-green-500",
      description: "Take a quick break and relax"
    },
    longBreak: { 
      duration: settings.longBreakDuration, 
      label: "Long Break", 
      color: "bg-blue-500",
      description: "Time for a longer rest"
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    if (currentMode === "work") {
      setCompletedSessions(prev => prev + 1);
      
      // Determine next break type
      const nextBreakType = (completedSessions + 1) % settings.sessionsBeforeLongBreak === 0 
        ? "longBreak" 
        : "shortBreak";
      
      setCurrentMode(nextBreakType);
      setTimeLeft(modes[nextBreakType].duration * 60);
      
      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      setCurrentMode("work");
      setTimeLeft(modes.work.duration * 60);
      
      if (settings.autoStartWork) {
        setIsRunning(true);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[currentMode].duration * 60);
  };

  const switchMode = (mode: "work" | "shortBreak" | "longBreak") => {
    setCurrentMode(mode);
    setTimeLeft(modes[mode].duration * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentProgress = () => {
    const totalTime = modes[currentMode].duration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const stats: PomodoroStats = {
    totalSessions: sessions.length,
    totalWorkTime: sessions.filter(s => s.type === "work").reduce((sum, s) => sum + s.duration, 0),
    averageSessionsPerDay: 3.2,
    longestStreak: 12
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Pomodoro Timer
          </h1>
          <p className="text-muted-foreground">Boost productivity with focused work sessions</p>
        </div>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Work Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.workDuration}
                    onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 25 }))}
                  />
                </div>
                <div>
                  <Label>Short Break (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.shortBreakDuration}
                    onChange={(e) => setSettings(prev => ({ ...prev, shortBreakDuration: parseInt(e.target.value) || 5 }))}
                  />
                </div>
                <div>
                  <Label>Long Break (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings(prev => ({ ...prev, longBreakDuration: parseInt(e.target.value) || 15 }))}
                  />
                </div>
                <div>
                  <Label>Sessions before Long Break</Label>
                  <Input
                    type="number"
                    value={settings.sessionsBeforeLongBreak}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionsBeforeLongBreak: parseInt(e.target.value) || 4 }))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsSettingsOpen(false)}>
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timer Display */}
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Mode Indicator */}
              <div className="space-y-2">
                <Badge className={`${modes[currentMode].color} text-white`}>
                  {modes[currentMode].label}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {modes[currentMode].description}
                </p>
              </div>

              {/* Timer Display */}
              <div className="relative">
                <div className="text-6xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </div>
                <Progress 
                  value={getCurrentProgress()} 
                  className="mt-4"
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="gap-2"
                >
                  {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </Button>
              </div>

              {/* Mode Switcher */}
              <div className="flex justify-center gap-2">
                <Button
                  variant={currentMode === "work" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchMode("work")}
                >
                  Work
                </Button>
                <Button
                  variant={currentMode === "shortBreak" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchMode("shortBreak")}
                >
                  Short Break
                </Button>
                <Button
                  variant={currentMode === "longBreak" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchMode("longBreak")}
                >
                  Long Break
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Sessions</p>
                <p className="text-2xl font-bold">{completedSessions}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Focus Time</p>
                <p className="text-2xl font-bold">{stats.totalWorkTime}h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Streak</p>
                <p className="text-2xl font-bold">{stats.longestStreak}</p>
              </div>
              <Coffee className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={`${modes[session.type].color} text-white`}>
                    {modes[session.type].label}
                  </Badge>
                  <div>
                    <p className="font-semibold">{session.duration} minutes</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element for notifications */}
      <audio
        ref={audioRef}
        preload="auto"
      >
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmseAUSD3PDJdSwdHHfH8N2QQAoUXrTp66hVFApGn+DyvmseAUSD3PDJdSwdHHfH8N2QQAoUXrTp66hVFApGn+DyvmseAUSD3PDJdc" type="audio/wav" />
      </audio>
    </div>
  );
};

export default PomodoroTimer;