"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Edit3, LogOut, Award, BarChart3, Save, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Placeholder data
const userProfile = {
  name: 'User Name',
  email: 'user@example.com',
  age: 25,
  school: 'University of Medical Sciences',
  degree: 'MD Candidate',
  avatar: 'https://placehold.co/150x150.png',
};

const userStats = {
  sessionsCompleted: 12,
  totalQuestions: 250,
  correctAnswers: 210,
  averageScore: 84, // (210/250 * 100)
};

const achievementsSummary = [
  { name: 'First Steps', unlocked: true, description: "Complete your first practice session." },
  { name: 'Daily Dedication', unlocked: false, description: "Practice 7 days in a row." },
  { name: 'Perfect Score', unlocked: true, description: "Achieve 100% in an exam simulation." },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
  };

  const handleSave = () => {
    console.log("Saving profile:", formData); // Placeholder for Firebase update
    setIsEditing(false);
    // Update userProfile (or refetch from Firebase)
    Object.assign(userProfile, formData);
  };
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();


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
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
                <Button variant="outline" onClick={() => { setIsEditing(false); setFormData(userProfile); }}><X className="mr-2 h-4 w-4" /> Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>
            )}
            <Button variant="outline" onClick={() => alert("Logout (Not Implemented)")}><LogOut className="mr-2 h-4 w-4" /> Log Out</Button>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={formData.avatar} alt={formData.name} data-ai-hint="person avatar" />
              <AvatarFallback className="text-4xl">{getInitials(formData.name)}</AvatarFallback>
            </Avatar>
            {isEditing && <Input type="file" accept="image/*" className="text-sm" onChange={(e) => {
              if(e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target && typeof event.target.result === 'string') {
                    setFormData(prev => ({ ...prev, avatar: event.target.result as string }));
                  }
                }
                reader.readAsDataURL(e.target.files[0]);
              }
            }} />}
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{formData.name}</h2>
              <p className="text-muted-foreground">{formData.email}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {isEditing ? (
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled/>
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="school">School</Label>
                  <Input id="school" name="school" value={formData.school} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Input id="degree" name="degree" value={formData.degree} onChange={handleInputChange} />
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium text-muted-foreground">Age:</span> {userProfile.age}</div>
                <div><span className="font-medium text-muted-foreground">School:</span> {userProfile.school}</div>
                <div className="sm:col-span-2"><span className="font-medium text-muted-foreground">Degree:</span> {userProfile.degree}</div>
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
