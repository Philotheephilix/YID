import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useContract } from '@/hooks/useContract';
import { useUserStore } from '@/stores/userStore';

export const UserRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { deployUserContract } = useContract();
  const { setUser, setUserContract, setError } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contractAddress = await deployUserContract(name, email);
      
      const user = {
        name,
        email,
        isActive: true,
        createdAt: Math.floor(Date.now() / 1000),
        contractAddress,
      };

      setUser(user);
      setUserContract({
        address: contractAddress,
        name,
        email,
        isActive: true,
        createdAt: Math.floor(Date.now() / 1000),
      });

      // Reset form
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Failed to register user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register Your YID</CardTitle>
        <CardDescription>
          Create your decentralized identity on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register YID'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
