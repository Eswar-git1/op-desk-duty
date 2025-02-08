import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Medal, Coffee, Brain, Info, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("Officer");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          navigate("/auth");
          return;
        }

        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: player, error: playerError } = await supabase
          .from("players")
          .select("username")
          .eq("id", user.id)
          .single();

        if (playerError) {
          console.error("Error fetching username:", playerError);
          return;
        }

        if (player && player.username) {
          setUsername(player.username);
        } else {
          navigate("/set-username");
        }
      } catch (error) {
        console.error("Error in fetchUsername:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartDuty = () => navigate("/game");
  const handleLeaderboard = () => navigate("/leaderboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-8">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            Operation Desk Duty
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Navigate the hilarious world of military bureaucracy
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Welcome, {username}!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 bg-white border-2 border-yellow-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-yellow-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Medal className="w-12 h-12 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Earn Medals</h3>
            <p className="text-gray-600">
              Prove you're not just here for chai breaks! Answer quirky military dilemmas and stack up medals to become the ultimate officer.
            </p>
          </Card>

          <Card className="p-6 bg-white border-2 border-amber-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-amber-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Coffee className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Manage Chai Levels</h3>
            <p className="text-gray-600">
              Survive the chaos, one chai at a time! Keep your chai cup filled or risk losing focus amidst bureaucratic madness.
            </p>
          </Card>

          <Card className="p-6 bg-white border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Brain className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Preserve Sanity</h3>
            <p className="text-gray-600">
              Don't let the madness get to you! Avoid losing sanity by making clever decisions—and maybe avoid the CO's karaoke nights.
            </p>
          </Card>
        </div>


        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4"
            onClick={handleStartDuty}
          >
            Start Your Duty
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4"
            onClick={handleLeaderboard}
          >
            View Leaderboard
          </Button>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          Designed and Developed by Eswar © 2025
        </footer>
      </div>
    </div>
  );
}
