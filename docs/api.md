# Base Creator Connect API Documentation

This document provides comprehensive documentation for the Base Creator Connect API.

## Overview

Base Creator Connect provides a set of APIs for integrating tipping functionality into your applications. The API allows you to:

- Manage creator profiles
- Create and manage tipping tiers
- Set up and track funding goals
- Process tips and transactions
- Generate embeddable widgets and Farcaster frames

## Base URL

All API endpoints are relative to the base URL:

```
https://base-creator-connect.vercel.app/api
```

## Authentication

Authentication is handled through Privy. Users must connect their wallet to authenticate with the API.

## API Endpoints

### Creator Endpoints

#### Get Creator

Retrieves a creator's profile information.

```
GET /creator/{creatorId}
```

**Parameters:**
- `creatorId` (path) - The ID of the creator to retrieve

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "bio": "string",
  "profileImageUrl": "string",
  "walletAddress": "string",
  "socialLinks": {
    "twitter": "string",
    "farcaster": "string",
    "website": "string"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Update Creator Profile

Updates a creator's profile information.

```
PUT /creator/{creatorId}
```

**Parameters:**
- `creatorId` (path) - The ID of the creator to update

**Request Body:**
```json
{
  "username": "string",
  "bio": "string",
  "profileImageUrl": "string",
  "socialLinks": {
    "twitter": "string",
    "farcaster": "string",
    "website": "string"
  }
}
```

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "bio": "string",
  "profileImageUrl": "string",
  "walletAddress": "string",
  "socialLinks": {
    "twitter": "string",
    "farcaster": "string",
    "website": "string"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Tier Endpoints

#### Get Tiers

Retrieves all tiers for a creator.

```
GET /tiers/{creatorId}
```

**Parameters:**
- `creatorId` (path) - The ID of the creator to retrieve tiers for

**Response:**
```json
[
  {
    "id": "string",
    "creatorId": "string",
    "name": "string",
    "minAmount": 0.01,
    "perkDescription": "string",
    "isActive": true,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### Create Tier

Creates a new tier for a creator.

```
POST /tiers
```

**Request Body:**
```json
{
  "creatorId": "string",
  "name": "string",
  "minAmount": 0.01,
  "perkDescription": "string",
  "isActive": true
}
```

**Response:**
```json
{
  "id": "string",
  "creatorId": "string",
  "name": "string",
  "minAmount": 0.01,
  "perkDescription": "string",
  "isActive": true,
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Update Tier

Updates an existing tier.

```
PUT /tiers/{tierId}
```

**Parameters:**
- `tierId` (path) - The ID of the tier to update

**Request Body:**
```json
{
  "name": "string",
  "minAmount": 0.01,
  "perkDescription": "string",
  "isActive": true
}
```

**Response:**
```json
{
  "id": "string",
  "creatorId": "string",
  "name": "string",
  "minAmount": 0.01,
  "perkDescription": "string",
  "isActive": true,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Goal Endpoints

#### Get Goals

Retrieves all goals for a creator.

```
GET /goals/{creatorId}
```

**Parameters:**
- `creatorId` (path) - The ID of the creator to retrieve goals for

**Response:**
```json
[
  {
    "id": "string",
    "creatorId": "string",
    "name": "string",
    "description": "string",
    "targetAmount": 1.0,
    "currentAmount": 0.5,
    "imageUrl": "string",
    "isActive": true,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### Create Goal

Creates a new goal for a creator.

```
POST /goals
```

**Request Body:**
```json
{
  "creatorId": "string",
  "name": "string",
  "description": "string",
  "targetAmount": 1.0,
  "imageUrl": "string",
  "isActive": true
}
```

**Response:**
```json
{
  "id": "string",
  "creatorId": "string",
  "name": "string",
  "description": "string",
  "targetAmount": 1.0,
  "currentAmount": 0.0,
  "imageUrl": "string",
  "isActive": true,
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Update Goal

Updates an existing goal.

```
PUT /goals/{goalId}
```

**Parameters:**
- `goalId` (path) - The ID of the goal to update

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "targetAmount": 1.0,
  "imageUrl": "string",
  "isActive": true
}
```

**Response:**
```json
{
  "id": "string",
  "creatorId": "string",
  "name": "string",
  "description": "string",
  "targetAmount": 1.0,
  "currentAmount": 0.5,
  "imageUrl": "string",
  "isActive": true,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Tip Endpoints

#### Create Tip

Creates a new tip.

```
POST /tips
```

**Request Body:**
```json
{
  "creatorId": "string",
  "fanWalletAddress": "string",
  "amount": 0.01,
  "currency": "ETH",
  "message": "string",
  "reaction": "string",
  "transactionHash": "string",
  "tierId": "string",
  "tipGoalId": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "creatorId": "string",
  "fanWalletAddress": "string",
  "amount": 0.01,
  "currency": "ETH",
  "message": "string",
  "reaction": "string",
  "transactionHash": "string",
  "tierId": "string",
  "tipGoalId": "string",
  "createdAt": "string"
}
```

#### Get Tips by Creator

Retrieves all tips for a creator.

```
GET /tips/creator/{creatorId}
```

**Parameters:**
- `creatorId` (path) - The ID of the creator to retrieve tips for
- `page` (query, optional) - Page number (default: 1)
- `pageSize` (query, optional) - Number of tips per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "creatorId": "string",
      "fanWalletAddress": "string",
      "amount": 0.01,
      "currency": "ETH",
      "message": "string",
      "reaction": "string",
      "transactionHash": "string",
      "tierId": "string",
      "tipGoalId": "string",
      "createdAt": "string"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

### Widget Endpoints

#### Get Widget Embed Code

Retrieves the embed code for a creator's widget.

```
GET /widget/{creatorId}
```

**Parameters:**
- `creatorId` (path) - The ID of the creator to retrieve the widget for
- `format` (query, optional) - Format of the response (json, html, farcaster) (default: json)
- `width` (query, optional) - Width of the widget (default: 100%)
- `height` (query, optional) - Height of the widget (default: 400px)
- `theme` (query, optional) - Theme of the widget (light, dark) (default: light)

**Response (JSON):**
```json
{
  "creator": {
    "id": "string",
    "username": "string",
    "profileImageUrl": "string"
  },
  "embedCode": "string",
  "farcasterFrameCode": "string",
  "widgetUrl": "string",
  "frameUrl": "string"
}
```

**Response (HTML):**
```html
<iframe
  src="https://base-creator-connect.vercel.app/widget/{creatorId}?theme=light"
  width="100%"
  height="400px"
  frameborder="0"
  allow="clipboard-write; encrypted-media"
  style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
></iframe>
```

**Response (Farcaster):**
```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://base-creator-connect.vercel.app/api/og?creatorId={creatorId}" />
<meta property="fc:frame:post_url" content="https://base-creator-connect.vercel.app/api/frame?creatorId={creatorId}" />
<meta property="fc:frame:button:1" content="Tip Creator" />
```

### Frame Endpoints

#### Get Frame

Retrieves the Farcaster frame for a creator.

```
GET /frame?creatorId={creatorId}
```

**Parameters:**
- `creatorId` (query) - The ID of the creator to retrieve the frame for

**Response:**
HTML content for the Farcaster frame.

#### Process Frame Action

Processes a Farcaster frame action.

```
POST /frame
```

**Request Body:**
Farcaster frame message.

**Response:**
HTML content for the next frame state.

### Thank-You Note Endpoints

#### Generate Thank-You Note

Generates a personalized thank-you note for a tip.

```
POST /generate-thankyou
```

**Request Body:**
```json
{
  "message": "string",
  "amount": "0.01",
  "tierId": "string",
  "style": "grateful"
}
```

**Response:**
```json
{
  "note": "string"
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses include a JSON object with an error message:

```json
{
  "error": "Error message"
}
```

## Rate Limiting

API requests are rate-limited to 100 requests per minute per IP address.

## Webhooks

Webhooks are available for the following events:

- Tip received
- Goal reached
- New creator registered

To register a webhook, contact the Base Creator Connect team.

## SDK

A JavaScript SDK is available for integrating with the Base Creator Connect API:

```javascript
import { BaseCreatorConnect } from 'base-creator-connect';

const client = new BaseCreatorConnect({
  apiKey: 'your-api-key',
});

// Get creator
const creator = await client.getCreator('creator-id');

// Create tip
const tip = await client.createTip({
  creatorId: 'creator-id',
  amount: 0.01,
  message: 'Great work!',
});
```

## Support

For API support, contact the Base Creator Connect team at support@basecreatorconnect.com.

