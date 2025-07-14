import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";
import Timetable from "@/components/Timetable";
import AssignmentTracker from "@/components/AssignmentTracker";

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
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Course Notes
            </h1>
            <p className="text-muted-foreground">Coming soon! 📝</p>
          </div>
        );
      case 'connect':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Peer Connect
            </h1>
            <p className="text-muted-foreground">Coming soon! 👥</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-muted-foreground">Coming soon! ⚙️</p>
          </div>
        );
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
