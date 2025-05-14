"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';
import { Chrome, Apple } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase'; 
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';


export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); 

  const [defaultTab, setDefaultTab] = useState("signin");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const mode = searchParams.get('mode');
    setDefaultTab(mode === 'signup' ? "signup" : "signin");
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast({ title: "Signed in successfully!", description: `Welcome ${result.user.displayName || result.user.email}` });
      // AuthProvider will handle redirect via onAuthStateChanged
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({ title: "Google Sign-In Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleSignIn = async () => {
    toast({ title: "Not Implemented", description: "Apple Sign-In is not yet configured.", variant: "default" });
  };

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Signed in successfully!", description: `Welcome back ${userCredential.user.email}` });
    } catch (error: any) {
      console.error("Error signing in with email: ", error);
      toast({ title: "Email Sign-In Failed", description: error.message || "Incorrect email or password.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Sign Up Error", description: "Passwords do not match!", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: "Account created successfully!", description: `Welcome ${userCredential.user.email}. You can now sign in.` });
      setDefaultTab("signin"); 
      setEmail(''); 
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error("Error signing up with email: ", error);
      toast({ title: "Email Sign-Up Failed", description: error.message || "Could not create account.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-secondary/30">
        <Card className="w-full max-w-md p-8">
          <CardHeader className="items-center">
             <Skeleton className="h-10 w-10 rounded-full mb-4" />
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
            <p className="text-muted-foreground mt-2">Loading session or redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!searchParams) return null;


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
                  <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                    <Chrome className="mr-2 h-4 w-4" /> Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleAppleSignIn} disabled={isSubmitting || true /* Apple sign in not implemented */}>
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
                    <Input id="email-signin" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <Input id="password-signin" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-sm">
                <p>Don't have an account? <button onClick={() => setDefaultTab("signup")} className="underline text-accent" disabled={isSubmitting}>Sign up</button></p>
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
                  <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                    <Chrome className="mr-2 h-4 w-4" /> Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleAppleSignIn} disabled={isSubmitting || true /* Apple sign in not implemented */}>
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
                    <Input id="email-signup" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-signup">Confirm Password</Label>
                    <Input id="confirm-password-signup" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-sm">
                 <p>Already have an account? <button onClick={() => setDefaultTab("signin")} className="underline text-accent" disabled={isSubmitting}>Sign in</button></p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
