import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../lib/store';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { supabase } from '../lib/supabase';
import { Howl } from 'howler';
import { useToast } from '../components/ui/use-toast';
import {
  Coffee,
  Brain,
  Medal,
  FileText,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';

// Sound effects with preloading for better performance
const successSound = new Howl({
  src: ['https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'],
  volume: 0.5,
  preload: true,
});

const failureSound = new Howl({
  src: ['https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'],
  volume: 0.5,
  preload: true,
});

const levelUpSound = new Howl({
  src: ['https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'],
  volume: 0.5,
  preload: true,
});

const buttonHoverSound = new Howl({
  src: ['https://assets.mixkit.co/sfx/preview/mixkit-click-melodic-tone-1129.mp3'],
  volume: 0.2,
  preload: true,
});

interface Scenario {
  id: string;
  situation: string;
  solutions: string[];
  correct_solution_index: number;
  sanity_loss: number;
  difficulty: string;
}

const emojis = {
  sanity: '🧠',
  chai: '☕',
  medal: '🎖️',
  paperwork: '📝',
  success: '✨',
  failure: '💫',
  levelUp: '🌟',
};

const RANKS = [
  'Lieutenant',
  'Captain',
  'Major',
  'Lieutenant Colonel',
  'Colonel',
  'Brigadier',
  'Major General',
  'Lieutenant General',
  'General',
];

const TOTAL_QUESTIONS_PER_LEVEL = 11;
const QUESTIONS_TO_LEVEL_UP = 8;
const SANITY_PENALTY_MULTIPLIER = 1.5;

export default function Game() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    sanityPoints,
    chaiLevel,
    currentRank,
    medals,
    paperworkCompleted,
    correctAnswers,
    wrongAnswers,
    currentLevel,
    answeredQuestions,
    setSanityPoints,
    setChaiLevel,
    setPaperworkCompleted,
    setMedals,
    setCorrectAnswers,
    setWrongAnswers,
    setCurrentLevel,
    setCurrentRank,
    addAnsweredQuestion,
    resetLevelProgress,
    setFinalScore,
    isGuest,
  } = useGameStore();

  const fetchNextScenario = useCallback(async () => {
    if (isTransitioning) return;

    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('difficulty', RANKS[currentLevel - 1])
        .not('id', 'in', `(${answeredQuestions.join(',')})`)
        .limit(1)
        .single();

      if (error && !isGuest) throw error;

      if (!data || isGuest) {
        setCurrentScenario({
          id: `guest-${Date.now()}`,
          situation:
            "A junior officer spilled chai on the commander's uniform during review. What should you do?",
          solutions: [
            'Make him rewrite "Yes Sir" 1000 times 📝',
            'Praise his dedication to chai culture ☕',
            'Assign him janitorial duties for a month 🧹',
          ],
          correct_solution_index: 1,
          sanity_loss: 15,
          difficulty: RANKS[currentLevel - 1],
        });
      } else {
        setCurrentScenario(data);
      }
    } catch (err) {
      console.error('Error fetching scenario:', err);
      toast({
        title: '❌ Error',
        description: 'Failed to fetch next scenario',
        variant: 'destructive',
      });
    }
  }, [currentLevel, answeredQuestions, isGuest, toast, isTransitioning]);

  useEffect(() => {
    fetchNextScenario();
  }, [currentLevel, fetchNextScenario]);

  const handleGameOver = async () => {
    const finalScore = medals * 100 + correctAnswers * 50;
    setFinalScore(finalScore);

    if (!isGuest) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('leaderboard').insert({
            player_id: user.id,
            score: finalScore,
            rank_achieved: currentRank,
          });
        }
      } catch (error) {
        console.error('Error saving to leaderboard:', error);
      }
    }

    toast({
      title: '🎮 Game Over!',
      description: `Final Score: ${finalScore}. Check the leaderboard!`,
    });

    navigate('/leaderboard');
  };

  const checkLevelUp = () => {
    if (correctAnswers >= QUESTIONS_TO_LEVEL_UP) {
      if (currentLevel < RANKS.length) {
        levelUpSound.play();
        setCurrentLevel(currentLevel + 1);
        setCurrentRank(RANKS[currentLevel]);
        resetLevelProgress();

        toast({
          title: `${emojis.levelUp} Promotion!`,
          description: `Congratulations! You've been promoted to ${RANKS[currentLevel]}!`,
        });
      } else {
        toast({
          title: '🏆 Congratulations!',
          description: "You've reached the highest rank! Game completed!",
        });
        handleGameOver();
      }
    } else if (wrongAnswers > TOTAL_QUESTIONS_PER_LEVEL - QUESTIONS_TO_LEVEL_UP) {
      handleGameOver();
    }
  };

  const handleAnswer = async (solutionIndex: number) => {
    if (!currentScenario || isAnswering) return;
    setIsAnswering(true);
    setIsTransitioning(true);

    const isCorrect = solutionIndex === currentScenario.correct_solution_index;
    const baseSanityLoss = currentLevel * 10;
    const sanityChange = isCorrect
      ? 0
      : -Math.floor(baseSanityLoss * SANITY_PENALTY_MULTIPLIER);

    if (isCorrect) {
      successSound.play();
      setMedals(medals + 1);
      setPaperworkCompleted(paperworkCompleted + 1);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      failureSound.play();
      setWrongAnswers(wrongAnswers + 1);
      setSanityPoints(Math.max(0, sanityPoints + sanityChange));
    }

    setChaiLevel(Math.max(0, chaiLevel - 10));

    if (currentScenario.id) {
      addAnsweredQuestion(currentScenario.id);
    }

    if (!isGuest && currentScenario.id) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('player_progress').insert({
            player_id: user.id,
            scenario_id: currentScenario.id,
            success: isCorrect,
            sanity_change: sanityChange,
          });
        }
      } catch (error) {
        console.error('Error recording progress:', error);
      }
    }

    toast({
      title: isCorrect ? `${emojis.success} Success!` : `${emojis.failure} Oops!`,
      description: isCorrect
        ? 'Great job handling that situation!'
        : 'That could have been handled better...',
      variant: isCorrect ? 'default' : 'destructive',
    });

    if (chaiLevel <= 20) {
      toast({
        title: '☕ Low Chai Alert!',
        description: 'Your chai levels are critically low! Take a chai break!',
      });
    }

    if (sanityPoints <= 0) {
      handleGameOver();
      return;
    }

    checkLevelUp();

    setTimeout(() => {
      setIsAnswering(false);
      setIsTransitioning(false);
      fetchNextScenario();
    }, 1000);
  };

  const handleDrinkChai = () => {
    setChaiLevel(Math.min(100, chaiLevel + 30));
    toast({
      title: '☕ Refreshing!',
      description: 'You enjoyed a refreshing cup of chai!',
    });
  };

  const handleResign = () => {
    handleGameOver();
  };

  if (!currentScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin text-indigo-600 text-4xl">🎮</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur border-2 border-indigo-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5" /> Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  {emojis.sanity} Sanity
                </label>
                <Progress
                  value={sanityPoints}
                  className="h-2 bg-gray-100 [&>div]:bg-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  {emojis.chai} Chai Level
                </label>
                <Progress
                  value={chaiLevel}
                  className="h-2 bg-gray-100 [&>div]:bg-amber-500"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur border-2 border-indigo-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" /> Progress
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                Rank: {currentRank}
              </p>
              <p className="flex items-center gap-2">
                {emojis.medal} Medals: {medals}
              </p>
              <p className="flex items-center gap-2">
                {emojis.paperwork} Correct/Required: {correctAnswers}/{QUESTIONS_TO_LEVEL_UP}
              </p>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  Level Progress
                </label>
                <Progress
                  value={(correctAnswers / QUESTIONS_TO_LEVEL_UP) * 100}
                  className="h-2 bg-gray-100 [&>div]:bg-indigo-500"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Scenario Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-white/80 backdrop-blur border-2 border-indigo-100 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-600" />
                Level {currentLevel} Situation
              </h2>
              <p className="text-lg mb-8 text-gray-700 leading-relaxed">
                {currentScenario.situation}
              </p>
              <div className="space-y-4">
                {currentScenario.solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-left p-4 bg-white hover:bg-indigo-50 border-2 border-indigo-100 text-gray-700 transition-all"
                      onClick={() => handleAnswer(index)}
                      disabled={isAnswering}
                      onMouseEnter={() => buttonHoverSound.play()}
                    >
                      {solution}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 justify-center">
          <Button
            variant="outline"
            className="border-2 border-indigo-100 bg-white hover:bg-indigo-50 text-indigo-600"
            onClick={handleDrinkChai}
          >
            ☕ Drink Chai
          </Button>
          <Button
            variant="outline"
            className="border-2 border-red-200 bg-white hover:bg-red-50 text-red-600"
            onClick={handleResign}
          >
            🏳️ Resign Commission
          </Button>
        </div>
      </div>
    </div>
  );
}