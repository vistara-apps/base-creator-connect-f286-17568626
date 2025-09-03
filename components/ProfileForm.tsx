/**
 * ProfileForm component for Base Creator Connect
 * 
 * This component allows creators to set up and edit their profile.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { creatorApi } from '@/lib/api';

interface ProfileFormProps {
  creator: {
    id: string;
    username?: string;
    bio?: string;
    profileImageUrl?: string;
    socialLinks?: Record<string, string>;
  };
  onUpdate: () => void;
}

export function ProfileForm({ creator, onUpdate }: ProfileFormProps) {
  const [username, setUsername] = useState(creator.username || '');
  const [bio, setBio] = useState(creator.bio || '');
  const [profileImageUrl, setProfileImageUrl] = useState(creator.profileImageUrl || '');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(
    creator.socialLinks || { twitter: '', farcaster: '', website: '' }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Handle social link change
  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedCreator = await creatorApi.updateProfile(creator.id, {
        username,
        bio,
        profileImageUrl,
        socialLinks,
      });
      
      if (updatedCreator) {
        setSuccess('Profile updated successfully');
        onUpdate();
      } else {
        setError('Failed to update profile');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your fans about yourself"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Profile Image URL</label>
            <Input
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              placeholder="https://example.com/your-image.jpg"
            />
            {profileImageUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={profileImageUrl}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Social Links</label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">Twitter</label>
                <Input
                  value={socialLinks.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Farcaster</label>
                <Input
                  value={socialLinks.farcaster || ''}
                  onChange={(e) => handleSocialLinkChange('farcaster', e.target.value)}
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Website</label>
                <Input
                  value={socialLinks.website || ''}
                  onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

