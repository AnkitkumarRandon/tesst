/*
  # AI Call Center Platform Schema

  ## Overview
  This migration creates the database schema for an AI Call Center SaaS platform
  where businesses can configure AI phone agents.

  ## New Tables
  
  ### `business_profiles`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to auth.users
  - `company_name` (text) - Business name
  - `business_category` (text) - Industry category
  - `support_phone` (text) - Business phone number
  - `business_email` (text) - Business contact email
  - `operating_hours_start` (text) - Opening time
  - `operating_hours_end` (text) - Closing time
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `knowledge_documents`
  - `id` (uuid, primary key) - Unique identifier
  - `business_id` (uuid) - Reference to business_profiles
  - `file_name` (text) - Name of uploaded file
  - `file_url` (text) - Storage URL
  - `status` (text) - Processing status (processing/indexed/ready)
  - `upload_progress` (integer) - Upload progress percentage
  - `created_at` (timestamptz) - Upload timestamp

  ### `ai_agent_configs`
  - `id` (uuid, primary key) - Unique identifier
  - `business_id` (uuid) - Reference to business_profiles
  - `greeting_message` (text) - Agent greeting
  - `response_tone` (text) - Tone setting
  - `language` (text) - Language preference
  - `max_response_length` (text) - Response length setting
  - `created_at` (timestamptz) - Configuration creation
  - `updated_at` (timestamptz) - Last update

  ### `payment_status`
  - `id` (uuid, primary key) - Unique identifier
  - `business_id` (uuid) - Reference to business_profiles
  - `is_active` (boolean) - Payment active status
  - `phone_number` (text) - Assigned AI phone number
  - `activated_at` (timestamptz) - Activation timestamp

  ### `call_activities`
  - `id` (uuid, primary key) - Unique identifier
  - `business_id` (uuid) - Reference to business_profiles
  - `caller_number` (text) - Incoming caller number
  - `status` (text) - Call status
  - `duration` (integer) - Call duration in seconds
  - `created_at` (timestamptz) - Call timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own business data
*/

-- Create business_profiles table
CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  company_name text DEFAULT '',
  business_category text DEFAULT '',
  support_phone text DEFAULT '',
  business_email text DEFAULT '',
  operating_hours_start text DEFAULT '09:00',
  operating_hours_end text DEFAULT '17:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create knowledge_documents table
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text DEFAULT '',
  status text DEFAULT 'processing',
  upload_progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create ai_agent_configs table
CREATE TABLE IF NOT EXISTS ai_agent_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  greeting_message text DEFAULT 'Hello, how can I assist you today?',
  response_tone text DEFAULT 'Professional',
  language text DEFAULT 'English',
  max_response_length text DEFAULT 'Medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment_status table
CREATE TABLE IF NOT EXISTS payment_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  is_active boolean DEFAULT false,
  phone_number text DEFAULT '',
  activated_at timestamptz
);

-- Create call_activities table
CREATE TABLE IF NOT EXISTS call_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  caller_number text NOT NULL,
  status text NOT NULL,
  duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_profiles
CREATE POLICY "Users can view own business profile"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business profile"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profile"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for knowledge_documents
CREATE POLICY "Users can view own documents"
  ON knowledge_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = knowledge_documents.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own documents"
  ON knowledge_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = knowledge_documents.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own documents"
  ON knowledge_documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = knowledge_documents.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for ai_agent_configs
CREATE POLICY "Users can view own agent config"
  ON ai_agent_configs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = ai_agent_configs.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent config"
  ON ai_agent_configs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = ai_agent_configs.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own agent config"
  ON ai_agent_configs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = ai_agent_configs.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for payment_status
CREATE POLICY "Users can view own payment status"
  ON payment_status FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = payment_status.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own payment status"
  ON payment_status FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = payment_status.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own payment status"
  ON payment_status FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = payment_status.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for call_activities
CREATE POLICY "Users can view own call activities"
  ON call_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = call_activities.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own call activities"
  ON call_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = call_activities.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );