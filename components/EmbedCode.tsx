/**
 * EmbedCode component for Base Creator Connect
 * 
 * This component displays embed code for creators to use on their websites.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EmbedCodeProps {
  creatorId: string;
  embedCode: string;
  farcasterFrameCode: string;
}

export function EmbedCode({ creatorId, embedCode, farcasterFrameCode }: EmbedCodeProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [width, setWidth] = useState<string>('100%');
  const [height, setHeight] = useState<string>('400px');
  const [theme, setTheme] = useState<string>('light');
  
  // Base URL for the app
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://base-creator-connect.vercel.app';
  
  // Generate embed code with current options
  const generateEmbedCode = () => {
    return `<iframe
  src="${BASE_URL}/widget/${creatorId}?theme=${theme}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="clipboard-write; encrypted-media"
  style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
></iframe>`;
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Tipping Widget</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="website">
          <TabsList className="mb-4">
            <TabsTrigger value="website">Website Embed</TabsTrigger>
            <TabsTrigger value="farcaster">Farcaster Frame</TabsTrigger>
          </TabsList>
          
          <TabsContent value="website">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Width</label>
                  <Input
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Width (e.g., 100%, 400px)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Height</label>
                  <Input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Height (e.g., 400px)"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Embed Code</label>
                <div className="relative">
                  <Textarea
                    value={generateEmbedCode()}
                    readOnly
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generateEmbedCode(), 'embed')}
                  >
                    {copied === 'embed' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: generateEmbedCode() }}
                  className="border rounded"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="farcaster">
            <div className="space-y-4">
              <p className="text-sm">
                Add this code to your website to create a Farcaster Frame that allows users to tip you directly from Farcaster.
              </p>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Farcaster Frame Code</label>
                <div className="relative">
                  <Textarea
                    value={farcasterFrameCode}
                    readOnly
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(farcasterFrameCode, 'farcaster')}
                  >
                    {copied === 'farcaster' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Frame URL</label>
                <div className="relative">
                  <Input
                    value={`${BASE_URL}/api/frame?creatorId=${creatorId}`}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-1 right-1"
                    onClick={() => copyToClipboard(`${BASE_URL}/api/frame?creatorId=${creatorId}`, 'frameUrl')}
                  >
                    {copied === 'frameUrl' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

