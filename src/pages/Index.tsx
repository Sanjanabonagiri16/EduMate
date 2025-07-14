import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";
import Timetable from "@/components/Timetable";
import AssignmentTracker from "@/components/AssignmentTracker";
import Notes from "@/components/Notes";
import StudyResources from "@/components/StudyResources";
import Attendance from "@/components/Attendance";
import CGPACalculator from "@/components/CGPACalculator";
import PomodoroTimer from "@/components/PomodoroTimer";
import QuestionBank from "@/components/QuestionBank";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import PeerConnect from "@/components/PeerConnect";
import Settings from "@/components/Settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'timetable':
        return <Timetable />;
      case 'assignments':
        return <AssignmentTracker />;
      case 'notes':
        return <Notes />;
      case 'resources':
        return <StudyResources />;
      case 'attendance':
        return <Attendance />;
      case 'cgpa':
        return <CGPACalculator />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'questions':
        return <QuestionBank />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'connect':
        return <PeerConnect />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-6 pt-20 md:pt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
