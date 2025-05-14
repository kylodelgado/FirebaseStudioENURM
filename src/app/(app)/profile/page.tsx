"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3, LogOut, Award, BarChart3, Save, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context'; 
import { Skeleton } from '@/components/ui/skeleton'; 
import { useToast } from '@/hooks/use-toast';
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth'; 
// For Firestore updates, you'd import { doc, setDoc, getDoc } from "firebase/firestore"; and db from "@/lib/firebase";

interface UserProfileData {
  name: string;
  email: string;
  avatar: string; // This will be a data URL for preview, or photoURL from Firebase
  age?: number | string; 
  school?: string;
  degree?: string;
}

// Placeholder stats and achievements - these would come from a database (e.g., Firestore)
const userStats = {
  sessionsCompleted: 12,
  totalQuestions: 250,
  correctAnswers: 210,
  averageScore: 84,
};

const achievementsSummary = [
  { name: 'First Steps', unlocked: true, description: "Complete your first practice session." },
  { name: 'Daily Dedication', unlocked: false, description: "Practice 7 days in a row." },
  { name: 'Perfect Score', unlocked: true, description: "Achieve 100% in an exam simulation." },
];


export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileData>({
    name: '',
    email: '',
    avatar: '',
    age: '',
    school: '',
    degree: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      // TODO: Fetch extended profile data (age, school, degree) from Firestore here if available
      setFormData({
        name: user.displayName || '',
        email: user.email || '',
        avatar: user.photoURL || `https://placehold.co/150x150.png?text=${getInitials(user.displayName || user.email)}`,
        // Load these from Firestore if they exist
        age: '', // Placeholder, fetch from Firestore
        school: '', // Placeholder, fetch from Firestore
        degree: '', // Placeholder, fetch from Firestore
      });
    }
  }, [user]);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    if (name.includes('@') && name.split(' ').length === 1) {
      return name.charAt(0).toUpperCase();
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? (value === '' ? '' : parseInt(value)) : value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setFormData(prev => ({ ...prev, avatar: event.target.result as string }));
          // Note: This sets a data URL for preview. Actual upload to Firebase Storage and updating
          // user.photoURL would happen on save.
        }
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Update Firebase Auth profile (displayName and photoURL)
      // For photoURL, you'd first upload formData.avatar (if it's a new file Data URL) to Firebase Storage,
      // get the download URL, then use that URL with firebaseUpdateProfile.
      // This part is simplified for now.
      let photoURLToUpdate = user.photoURL;
      if (formData.avatar && formData.avatar.startsWith('data:image')) {
         // This is a placeholder for actual image upload logic
        console.warn("Avatar is a data URL. Actual upload to Firebase Storage and URL retrieval needed.");
        toast({title: "Avatar Update Pending", description: "Avatar upload to storage not implemented. Current avatar won't change on Firebase unless it's an existing URL."})
        // For now, we won't update photoURL if it's a new data URL to avoid errors
        // photoURLToUpdate = await uploadImageToStorageAndGetURL(formData.avatar); // Hypothetical function
      } else if (formData.avatar) {
        photoURLToUpdate = formData.avatar; // Assumes it's already a valid URL
      }


      await firebaseUpdateProfile(user, { 
        displayName: formData.name,
        // photoURL: photoURLToUpdate, // Enable once image upload is handled
      });
      
      // TODO: Update extended profile data (age, school, degree) in Firestore
      // Example: const userDocRef = doc(db, "users", user.uid);
      // await setDoc(userDocRef, { age: formData.age, school: formData.school, degree: formData.degree }, { merge: true });

      toast({ title: "Profile Updated", description: "Your display name has been updated. Other fields require Firestore setup." });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
      console.error("Error updating profile: ", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
         setFormData({
            name: user.displayName || '',
            email: user.email || '',
            avatar: user.photoURL || `https://placehold.co/150x150.png?text=${getInitials(user.displayName || user.email)}`,
            age: '', // Reset to fetched or empty
            school: '', // Reset to fetched or empty
            degree: '', // Reset to fetched or empty
      });
    }
  }


  if (authLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="text-center space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
         <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="container mx-auto p-6 text-center">Redirecting to login...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
            <CardDescription>Manage your personal information and track your progress.</CardDescription>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving}><Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}</Button>
                <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}><X className="mr-2 h-4 w-4" /> Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>
            )}
            <Button variant="outline" onClick={signOut} disabled={isSaving}><LogOut className="mr-2 h-4 w-4" /> Log Out</Button>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={formData.avatar} alt={formData.name} data-ai-hint="person avatar" />
              <AvatarFallback className="text-4xl">{getInitials(formData.name)}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <Label htmlFor="avatar-upload" className="text-sm text-primary cursor-pointer hover:underline">Change Avatar</Label>
                <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                {/* <Input type="text" name="avatar" placeholder="Or enter image URL" value={formData.avatar.startsWith('data:image') ? '' : formData.avatar} onChange={handleInputChange} className="text-sm mt-2"/> */}
              </>
            )}
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{isEditing ? formData.name : user.displayName || 'User Name'}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {isEditing ? (
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} disabled />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="e.g., 25 (Firestore)" />
                </div>
                <div>
                  <Label htmlFor="school">School</Label>
                  <Input id="school" name="school" value={formData.school} onChange={handleInputChange} placeholder="e.g., University of Medical Sciences (Firestore)" />
                </div>
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Input id="degree" name="degree" value={formData.degree} onChange={handleInputChange} placeholder="e.g., MD Candidate (Firestore)" />
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4">
                <div><span className="font-medium text-muted-foreground">Age:</span> {formData.age || 'N/A (Edit to add)'}</div>
                <div><span className="font-medium text-muted-foreground">School:</span> {formData.school || 'N/A (Edit to add)'}</div>
                <div className="sm:col-span-2"><span className="font-medium text-muted-foreground">Degree:</span> {formData.degree || 'N/A (Edit to add)'}</div>
                <p className="sm:col-span-2 text-xs text-muted-foreground pt-2">Additional details like Age, School, and Degree are stored in Firestore (not yet fully implemented for saving).</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary" /> Performance Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span>Sessions Completed:</span> <span className="font-semibold">{userStats.sessionsCompleted}</span></div>
            <div className="flex justify-between"><span>Total Questions Answered:</span> <span className="font-semibold">{userStats.totalQuestions}</span></div>
            <div className="flex justify-between"><span>Correct Answers:</span> <span className="font-semibold text-green-600 dark:text-green-400">{userStats.correctAnswers}</span></div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Average Score:</span> <span className="font-semibold text-accent">{userStats.averageScore}%</span>
              </div>
              <Progress value={userStats.averageScore} aria-label={`${userStats.averageScore}% average score`} />
            </div>
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/statistics">View Full Statistics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Achievements Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievementsSummary.map(ach => (
              <div key={ach.name} className={`p-3 rounded-md ${ach.unlocked ? 'bg-green-100 dark:bg-green-900/50' : 'bg-muted/50'}`}>
                <h4 className={`font-medium ${ach.unlocked ? 'text-green-700 dark:text-green-300' : ''}`}>{ach.name} {ach.unlocked ? '✓' : '(Locked)'}</h4>
                <p className="text-xs text-muted-foreground">{ach.description}</p>
              </div>
            ))}
             <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/achievements">View All Achievements</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
