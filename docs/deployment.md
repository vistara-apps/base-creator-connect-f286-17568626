# Base Creator Connect Deployment Guide

This document provides instructions for deploying the Base Creator Connect application to production.

## Prerequisites

Before deploying, ensure you have the following:

1. A Vercel account for hosting the application
2. A Supabase account for the database
3. A Privy account for wallet authentication
4. An OpenAI or OpenRouter API key for AI features
5. Access to the Base network for blockchain interactions

## Environment Variables

The following environment variables are required for deployment:

```
# App
NEXT_PUBLIC_APP_URL=https://your-app-domain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Privy
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# OpenAI/OpenRouter
OPENAI_API_KEY=your-openai-api-key
# OR
OPENROUTER_API_KEY=your-openrouter-api-key

# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-api-key
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL scripts from `lib/schema.ts` to create the necessary tables
3. Set up Row Level Security (RLS) policies for each table

### RLS Policies

#### Creators Table

```sql
-- Enable read access for all users
CREATE POLICY "Allow public read access" ON creators
  FOR SELECT USING (true);

-- Enable write access only for the creator's own record
CREATE POLICY "Allow write access for own record" ON creators
  FOR ALL USING (auth.uid()::text = farcasterId);
```

#### Tips Table

```sql
-- Enable read access for all users
CREATE POLICY "Allow public read access" ON tips
  FOR SELECT USING (true);

-- Enable insert access for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON tips
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

#### TipGoals Table

```sql
-- Enable read access for all users
CREATE POLICY "Allow public read access" ON tip_goals
  FOR SELECT USING (true);

-- Enable write access only for the creator's own goals
CREATE POLICY "Allow write access for own goals" ON tip_goals
  FOR ALL USING (
    creatorId IN (
      SELECT id FROM creators WHERE farcasterId = auth.uid()::text
    )
  );
```

#### Tiers Table

```sql
-- Enable read access for all users
CREATE POLICY "Allow public read access" ON tiers
  FOR SELECT USING (true);

-- Enable write access only for the creator's own tiers
CREATE POLICY "Allow write access for own tiers" ON tiers
  FOR ALL USING (
    creatorId IN (
      SELECT id FROM creators WHERE farcasterId = auth.uid()::text
    )
  );
```

## Deployment Steps

### 1. Prepare the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/base-creator-connect.git
   cd base-creator-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

### 2. Deploy to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel --prod
   ```

4. Set environment variables in the Vercel dashboard.

### 3. Configure Privy

1. Create a new application in the Privy dashboard
2. Configure the following settings:
   - Redirect URL: `https://your-app-domain.com`
   - Allowed Origins: `https://your-app-domain.com`
   - Login Methods: `wallet`
   - Default Chain: `Base`

### 4. Configure Farcaster Frames

1. Create a `.well-known/farcaster.json` file in the `public` directory:
   ```json
   {
     "frames": {
       "image": "https://your-app-domain.com/api/og",
       "post_url": "https://your-app-domain.com/api/frame",
       "buttons": [
         {
           "label": "Tip Creator",
           "action": "post"
         }
       ]
     }
   }
   ```

2. Verify your domain with Farcaster.

## Monitoring and Maintenance

### Logs

Access logs through the Vercel dashboard to monitor application performance and errors.

### Database Backups

Set up automatic backups for your Supabase database to prevent data loss.

### Performance Monitoring

Use Vercel Analytics to monitor application performance and user behavior.

## Scaling

### Horizontal Scaling

The application is designed to scale horizontally with Vercel's serverless functions.

### Database Scaling

Supabase provides scaling options for the database as your user base grows.

## Security Considerations

1. Regularly update dependencies to patch security vulnerabilities
2. Implement rate limiting for API endpoints
3. Use HTTPS for all communications
4. Validate all user inputs
5. Implement proper error handling
6. Use environment variables for sensitive information
7. Implement proper authentication and authorization

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check Supabase credentials
   - Verify network connectivity

2. **Authentication Issues**
   - Check Privy configuration
   - Verify wallet connection

3. **API Errors**
   - Check API keys
   - Verify rate limits

### Support

For deployment support, contact the Base Creator Connect team at support@basecreatorconnect.com.

