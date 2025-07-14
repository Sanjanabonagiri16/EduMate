import { useState } from "react";
import { Home, Calendar, CheckSquare, BookOpen, Users, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'timetable', icon: Calendar, label: 'Timetable' },
    { id: 'assignments', icon: CheckSquare, label: 'Assignments' },
    { id: 'notes', icon: BookOpen, label: 'Notes' },
    { id: 'connect', icon: Users, label: 'Connect' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card shadow-elevated z-40">
        <div className="flex flex-col w-full p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EduMate
            </h1>
            <p className="text-sm text-muted-foreground">Your College Companion</p>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2 flex-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 text-left transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-gradient-primary text-white shadow-glow" 
                    : "hover:bg-muted hover:scale-105"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Made with 💜 for students
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 bg-card shadow-card z-50 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            EduMate
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Mobile Menu */}
        <div className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card shadow-elevated z-50 transform transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 pt-20">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 text-left",
                    activeTab === item.id 
                      ? "bg-gradient-primary text-white" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-card shadow-elevated z-40 p-4 md:hidden">
          <div className="flex justify-around">
            {navItems.slice(0, 4).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-col gap-1 h-auto py-2",
                  activeTab === item.id && "text-primary"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;