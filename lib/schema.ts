/**
 * Supabase database schema definitions for Base Creator Connect
 * 
 * This file defines the database schema and relationships for the application.
 * It includes tables for creators, fans, tips, tip goals, and tiers.
 */

// Database table names
export const TABLES = {
  CREATORS: 'creators',
  FANS: 'fans',
  TIPS: 'tips',
  TIP_GOALS: 'tip_goals',
  TIERS: 'tiers',
};

/**
 * SQL schema for creating tables in Supabase
 * 
 * Execute these statements in the Supabase SQL editor to create the database schema.
 */

export const createCreatorsTableSQL = `
CREATE TABLE IF NOT EXISTS ${TABLES.CREATORS} (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farcasterId TEXT,
  username TEXT,
  bio TEXT,
  profileImageUrl TEXT,
  walletAddress TEXT NOT NULL,
  socialLinks JSONB,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on wallet address for faster lookups
CREATE INDEX IF NOT EXISTS creators_wallet_address_idx ON ${TABLES.CREATORS} (walletAddress);
-- Create index on farcaster ID for faster lookups
CREATE INDEX IF NOT EXISTS creators_farcaster_id_idx ON ${TABLES.CREATORS} (farcasterId);
`;

export const createFansTableSQL = `
CREATE TABLE IF NOT EXISTS ${TABLES.FANS} (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farcasterId TEXT,
  walletAddress TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on wallet address for faster lookups
CREATE INDEX IF NOT EXISTS fans_wallet_address_idx ON ${TABLES.FANS} (walletAddress);
-- Create index on farcaster ID for faster lookups
CREATE INDEX IF NOT EXISTS fans_farcaster_id_idx ON ${TABLES.FANS} (farcasterId);
`;

export const createTipsTableSQL = `
CREATE TABLE IF NOT EXISTS ${TABLES.TIPS} (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creatorId UUID NOT NULL REFERENCES ${TABLES.CREATORS}(id) ON DELETE CASCADE,
  fanWalletAddress TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ETH',
  message TEXT,
  reaction TEXT,
  transactionHash TEXT NOT NULL,
  tierId UUID REFERENCES ${TABLES.TIERS}(id),
  tipGoalId UUID REFERENCES ${TABLES.TIP_GOALS}(id),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on creator ID for faster lookups
CREATE INDEX IF NOT EXISTS tips_creator_id_idx ON ${TABLES.TIPS} (creatorId);
-- Create index on fan wallet address for faster lookups
CREATE INDEX IF NOT EXISTS tips_fan_wallet_address_idx ON ${TABLES.TIPS} (fanWalletAddress);
-- Create index on transaction hash for faster lookups
CREATE INDEX IF NOT EXISTS tips_transaction_hash_idx ON ${TABLES.TIPS} (transactionHash);
`;

export const createTipGoalsTableSQL = `
CREATE TABLE IF NOT EXISTS ${TABLES.TIP_GOALS} (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creatorId UUID NOT NULL REFERENCES ${TABLES.CREATORS}(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  targetAmount DECIMAL NOT NULL,
  currentAmount DECIMAL NOT NULL DEFAULT 0,
  imageUrl TEXT,
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on creator ID for faster lookups
CREATE INDEX IF NOT EXISTS tip_goals_creator_id_idx ON ${TABLES.TIP_GOALS} (creatorId);
-- Create index on active status for faster lookups
CREATE INDEX IF NOT EXISTS tip_goals_is_active_idx ON ${TABLES.TIP_GOALS} (isActive);
`;

export const createTiersTableSQL = `
CREATE TABLE IF NOT EXISTS ${TABLES.TIERS} (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creatorId UUID NOT NULL REFERENCES ${TABLES.CREATORS}(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  minAmount DECIMAL NOT NULL,
  perkDescription TEXT,
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on creator ID for faster lookups
CREATE INDEX IF NOT EXISTS tiers_creator_id_idx ON ${TABLES.TIERS} (creatorId);
-- Create index on active status for faster lookups
CREATE INDEX IF NOT EXISTS tiers_is_active_idx ON ${TABLES.TIERS} (isActive);
`;

// Function to create all tables
export const createAllTables = `
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

${createCreatorsTableSQL}
${createFansTableSQL}
${createTipGoalsTableSQL}
${createTiersTableSQL}
${createTipsTableSQL}
`;

// Function to drop all tables (for development/testing)
export const dropAllTables = `
DROP TABLE IF EXISTS ${TABLES.TIPS};
DROP TABLE IF EXISTS ${TABLES.TIERS};
DROP TABLE IF EXISTS ${TABLES.TIP_GOALS};
DROP TABLE IF EXISTS ${TABLES.FANS};
DROP TABLE IF EXISTS ${TABLES.CREATORS};
`;

