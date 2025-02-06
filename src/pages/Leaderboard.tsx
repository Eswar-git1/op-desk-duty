import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/card';
import { Medal, Trophy, Crown, Star } from 'lucide-react';
import { useGameStore } from '../lib/store';

interface PlayerData {
  username: string;
  current_rank: string;
  medals_earned: number;
}

interface LeaderboardEntry {
  id: string;
  player_id: string;
  score: number;
  rank_achieved: string;
  created_at: string;
  // Use the relationship name from your foreign key constraint (usually matching the table name)
  players: PlayerData | PlayerData[];
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const resetGame = useGameStore((state) => state.resetGame);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          id,
          player_id,
          score,
          rank_achieved,
          created_at,
          players (
            username,
            current_rank,
            medals_earned
          )
        `)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Normalize the returned data so that "players" is always an object.
      const typedData: LeaderboardEntry[] = data?.map((entry) => ({
        ...entry,
        players: Array.isArray(entry.players) ? entry.players[0] : entry.players,
      })) || [];

      console.log('Raw data from Supabase:', data);
      console.log('Processed data:', typedData);

      setEntries(typedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update this function to use the "players" field
  const getPlayerData = (entry: LeaderboardEntry): PlayerData => {
    if (Array.isArray(entry.players)) {
      return entry.players[0] || { username: 'Anonymous', current_rank: 'Unknown', medals_earned: 0 };
    }
    return entry.players || { username: 'Anonymous', current_rank: 'Unknown', medals_earned: 0 };
  };

  const handleStartGame = () => {
    resetGame();
    navigate('/game');
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      resetGame();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // New handler to navigate to the Home page
  const handleGoHome = () => {
    navigate('/home');
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-7 h-7 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-amber-700" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">{index + 1}</span>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Star className="w-8 h-8 text-yellow-500" />
            Top Officers
            <Star className="w-8 h-8 text-yellow-500" />
          </h1>
          <p className="text-gray-600">Masters of Military Bureaucracy</p>
        </div>

        {entries.length === 0 ? (
          <Card className="p-6 text-center text-gray-600">
            No entries found. Be the first to join the leaderboard!
          </Card>
        ) : (
          <div className="space-y-4 mb-8">
            {entries.map((entry, index) => {
              const playerData = getPlayerData(entry);
              return (
                <Card
                  key={entry.id}
                  className={`p-6 bg-white border-2 ${
                    index === 0
                      ? 'border-yellow-200 shadow-yellow-100'
                      : index === 1
                      ? 'border-gray-200 shadow-gray-100'
                      : index === 2
                      ? 'border-amber-200 shadow-amber-100'
                      : 'border-indigo-100'
                  } hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full ${
                          index < 3 ? 'bg-gradient-to-br' : 'bg-gray-50'
                        } ${
                          index === 0
                            ? 'from-yellow-100 to-yellow-200'
                            : index === 1
                            ? 'from-gray-100 to-gray-200'
                            : index === 2
                            ? 'from-amber-100 to-amber-200'
                            : ''
                        } flex items-center justify-center shadow-inner`}
                      >
                        {getRankIcon(index)}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {getPlayerData(entry).username || 'Anonymous Officer'}
                      </h3>
                      <div className="flex gap-2 items-center">
                        <p className="text-sm text-gray-600 font-medium">
                          {entry.rank_achieved}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          {formatDate(entry.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-bold text-indigo-600">
                        {entry.score.toLocaleString()}
                      </span>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        points
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-green-500 text-white text-lg font-medium rounded-lg shadow hover:bg-green-600 transition-all"
          >
            Home
          </button>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-red-500 text-white text-lg font-medium rounded-lg shadow hover:bg-red-600 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
