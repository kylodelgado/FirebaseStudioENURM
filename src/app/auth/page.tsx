"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';
import { Chrome, Apple } from 'lucide-react'; // Using Chrome as a placeholder for Google icon

// Placeholder for actual Firebase auth functions
const signInWithGoogle = async () => { console.log("Signing in with Google"); alert("Google Sign-In (Not Implemented)"); };
const signInWithApple = async () => { console.log("Signing in with Apple"); alert("Apple Sign-In (Not Implemented)"); };
const signInWithEmail = async (email: string, pass: string) => { console.log("Signing in with Email", email); alert("Email Sign-In (Not Implemented)"); };
const signUpWithEmail = async (email: string, pass: string) => { console.log("Signing up with Email", email); alert("Email Sign-Up (Not Implemented)"); };


export default function AuthPage() {
  const searchParams = useSearchParams();
  const [defaultTab, setDefaultTab] = useState("signin");

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setDefaultTab("signup");
    } else {
      setDefaultTab("signin");
    }
  }, [searchParams]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmail(email, password);
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    signUpWithEmail(email, password);
  };

  if (!searchParams) return null; // Ensure searchParams is available

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center py-12 bg-secondary/30">
        <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Access your ENURM Ace account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                    <Chrome className="mr-2 h-4 w-4" /> Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={signInWithApple}>
                    <Apple className="mr-2 h-4 w-4" /> Apple
                  </Button>
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input id="email-signin" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <Input id="password-signin" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Sign In</Button>
                </form>
              </CardContent>
              <CardFooter className="text-sm">
                <p>Don't have an account? <button onClick={() => setDefaultTab("signup")} className="underline text-accent">Sign up</button></p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create your ENURM Ace account to start practicing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                    <Chrome className="mr-2 h-4 w-4" /> Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={signInWithApple}>
                    <Apple className="mr-2 h-4 w-4" /> Apple
                  </Button>
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or create an account with email
                    </span>
                  </div>
                </div>
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-signup">Confirm Password</Label>
                    <Input id="confirm-password-signup" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Create Account</Button>
                </form>
              </CardContent>
              <CardFooter className="text-sm">
                 <p>Already have an account? <button onClick={() => setDefaultTab("signin")} className="underline text-accent">Sign in</button></p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
