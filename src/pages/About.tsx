import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, Users, Home, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative">
      
      {/* --- TOP RIGHT NAVIGATION --- */}
      <nav className="absolute top-0 right-0 p-4 md:p-6 flex items-center gap-4 z-50">
        <Link to="/">
          <Button 
            variant="ghost" 
            className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </Button>
        </Link>
        
        <Link to="/contact">
          <Button 
            variant="ghost" 
            className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Mail className="w-4 h-4" /> Contact
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-12 pt-10">
        
        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent pb-2">
            About the Project
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Empowering Bengaluru students and residents with real-time, crowdsourced cost of living data.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Database className="w-5 h-5" /> The Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 leading-relaxed">
              Moving to a new city like Bengaluru can be daunting. Information about rent, food, and transport costs is often scattered or outdated. 
              <br /><br />
              This project aims to solve that by providing a <strong>transparent, community-driven database</strong> where real people contribute real prices, helping everyone budget better.
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Code className="w-5 h-5" /> Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 text-sm border border-blue-800">React + Vite</span>
                <span className="px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-300 text-sm border border-emerald-800">Supabase</span>
                <span className="px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-300 text-sm border border-cyan-800">Tailwind CSS</span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">Shadcn UI</span>
              </div>
              <p className="text-sm text-slate-500">
                Built with modern web technologies to ensure speed, reliability, and a beautiful user experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-200">
            <Users className="w-6 h-6 text-pink-500" /> Meet the Team
          </h2>
          <p className="text-slate-500">
            Developed by students from <strong>K.S. School of Engineering and Management</strong>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Syed", role: "Team Lead / Dev" },
              { name: "Supreeth", role: "Frontend Dev" },
              { name: "Rohith.R", role: "Backend / Database" },
              { name: "Pranav", role: "UI / UX Designer" }
            ].map((member) => (
              <Card key={member.name} className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-all">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl font-bold text-slate-400">
                    {member.name[0]}
                  </div>
                  <h3 className="font-bold text-lg text-slate-200">{member.name}</h3>
                  <p className="text-xs text-blue-400 uppercase tracking-wider">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-900 pt-8 text-center text-slate-600 text-sm">
          © 2025 Bengaluru Living Cost Project. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;