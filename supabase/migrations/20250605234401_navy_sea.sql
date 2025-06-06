/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `status` (text)
      - `plan` (text)
      - `price_id` (text, nullable)
      - `quantity` (integer)
      - `cancel_at_period_end` (boolean)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `created_at` (timestamptz)
      - `ended_at` (timestamptz, nullable)
      - `trial_start` (timestamptz, nullable)
      - `trial_end` (timestamptz, nullable)
      - `stripe_customer_id` (text, nullable)
      - `stripe_subscription_id` (text, nullable)
  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for authenticated users to read their own subscriptions
    - Add policy for service role to manage all subscriptions
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL,
  plan text NOT NULL,
  price_id text,
  quantity integer DEFAULT 1 NOT NULL,
  cancel_at_period_end boolean DEFAULT false NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  UNIQUE(stripe_subscription_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Default free subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (
    user_id, 
    status, 
    plan, 
    current_period_start, 
    current_period_end
  )
  VALUES (
    NEW.id, 
    'active', 
    'free', 
    now(), 
    (now() + interval '100 years')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE PROCEDURE create_default_subscription();