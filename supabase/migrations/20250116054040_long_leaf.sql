/*
  # Initial Schema for Operation Desk Duty

  1. New Tables
    - players: Stores user profiles and game progress
    - scenarios: Contains game scenarios and solutions
    - player_progress: Tracks player attempts and outcomes
    - leaderboard: Records high scores and achievements

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE IF NOT EXISTS public.players (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  current_rank TEXT NOT NULL DEFAULT 'Lieutenant',
  sanity_points INTEGER NOT NULL DEFAULT 100,
  paperwork_completed INTEGER NOT NULL DEFAULT 0,
  medals_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Scenarios table
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  situation TEXT NOT NULL,
  sanity_loss INTEGER NOT NULL,
  solutions JSONB NOT NULL,
  correct_solution_index INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Player Progress table
CREATE TABLE IF NOT EXISTS public.player_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player_id UUID REFERENCES public.players NOT NULL,
  scenario_id UUID REFERENCES public.scenarios NOT NULL,
  success BOOLEAN NOT NULL,
  sanity_change INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player_id UUID REFERENCES public.players NOT NULL,
  score INTEGER NOT NULL,
  rank_achieved TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Policies for players table
CREATE POLICY "Users can read own data"
  ON public.players
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.players
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for scenarios table
CREATE POLICY "Anyone can read scenarios"
  ON public.scenarios
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for player_progress table
CREATE POLICY "Users can read own progress"
  ON public.player_progress
  FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON public.player_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

-- Policies for leaderboard table
CREATE POLICY "Anyone can read leaderboard"
  ON public.leaderboard
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own leaderboard entries"
  ON public.leaderboard
  FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

-- Function to update player's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update the updated_at column
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();