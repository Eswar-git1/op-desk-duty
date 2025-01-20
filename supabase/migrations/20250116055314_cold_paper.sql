/*
  # Add initial scenarios data

  1. Data Import
    - Adds initial set of military bureaucracy scenarios
    - Each scenario includes:
      - Situation text
      - Multiple choice options
      - Correct answer
      - Difficulty level
      - Sanity loss value (default 10)

  2. Security
    - Maintains existing RLS policies
*/

INSERT INTO public.scenarios (situation, solutions, correct_solution_index, difficulty, sanity_loss)
VALUES
  ('A junior officer spilled chai on the commanderar''s uniform during review. What should you do?', 
   '["Make him rewrite ''Yes Sir'' 1000 times", "Praise his dedication to chai culture", "Assign him janitorial duties for a month"]',
   1, 'Lieutenant', 10),
  ('The mess hall accidentally served Maggi instead of proper rations. Your response?',
   '["Declare Maggi as official combat food", "Organize a Maggi tasting contest", "Promote the culprit for boosting morale"]',
   2, 'Lieutenant', 10),
  ('A soldier reports his bunk is haunted by a friendly ghost reciting poetry. Your decision?',
   '["Encourage ghost poetry nights", "Send a team to exorcise the ghost", "Offer the ghost a corner office for motivational talks"]',
   2, 'Lieutenant', 10),
  ('The supply officer ordered 1000 pens, but they were all broken. What do you do?',
   '["Commission a pen repair workshop", "Use broken pens for quirky art projects", "Hold a contest for the best improvised pen invention"]',
   1, 'Lieutenant', 10),
  ('A military file labeled ''Top Secret'' is accidentally circulated to everyone. Your action?',
   '["Frame it as shared wisdom for all", "Initiate a fun ''Spot the Secret'' game", "Recall the file and throw a tea party apology"]',
   2, 'Lieutenant', 10),
  ('Your computer system now only accepts ''Babu_Rao_123'' as the password. Your plan?',
   '["Host a password party themed ''Babu Rao''", "Hire a local IT expert to reset everything", "Switch to voice commands temporarily"]',
   1, 'Lieutenant', 10),
  ('A cow joined the parade unexpectedly. How do you handle the situation?',
   '["Appoint the cow as parade mascot", "Redirect the parade to avoid the cow", "Integrate the cow into a new training exercise"]',
   0, 'Lieutenant', 10),
  ('The coffee machine is leaking, causing a caffeine flood. What are your next steps?',
   '["Collect spilled coffee as ''special brew''", "Call an emergency repair team", "Declare a coffee shortage and schedule a tasting event"]',
   1, 'Lieutenant', 10),
  ('A soldier starts teaching Bhangra moves during drill. How do you react?',
   '["Integrate Bhangra into daily PT routine", "Send him to formal dance classes", "Make him choreograph the next unit performance"]',
   0, 'Lieutenant', 10),
  ('All paperwork is now written in emoji language by mistake. You decide to:',
   '["Embrace the change and hold an emoji workshop", "Hire a linguist to translate every document", "Introduce mandatory emoji decoding sessions"]',
   0, 'Lieutenant', 10);