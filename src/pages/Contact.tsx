import { Home, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cost of Living Bengaluru
          </h2>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" className="gap-2 hover:bg-primary/10 transition-all">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="gap-2 hover:bg-primary/10 transition-all">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </Button>
            </Link>
            {/* Contact Link removed as requested */}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Contact Us
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12">
            Get in touch with us for any questions or feedback.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Home className="h-8 w-8 mb-4 text-primary" /> {/* Swapped Mail icon for generic Home or keep Mail if imported */}
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">
                pranavarun19@gmail.com
              </p>
            </Card>

            <Card className="p-6">
              <Info className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">
                +91 70191 07903
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;