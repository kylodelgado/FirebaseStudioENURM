"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress }
from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Lock, Unlock, Star, Zap, TrendingUp, CheckSquare } from 'lucide-react';
import Image from 'next/image';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: React.ElementType;
  imageHint: string;
}

const achievementsList: Achievement[] = [
  { id: 'firstSteps', name: 'First Steps', description: 'Complete your first practice session.', unlocked: true, icon: Star, imageHint: 'trophy first' },
  { id: 'dailyDedication', name: 'Daily Dedication', description: 'Practice 7 days in a row.', unlocked: false, icon: Zap, imageHint: 'calendar streak' },
  { id: 'perfectScore', name: 'Perfect Score', description: 'Achieve 100% in an exam simulation.', unlocked: false, icon: CheckSquare, imageHint: 'target bullseye' },
  { id: 'consistentProgress', name: 'Consistent Progress', description: 'Complete 10 practice sessions.', unlocked: true, icon: TrendingUp, imageHint: 'graph upward' },
  { id: 'masterReviewer', name: 'Master Reviewer', description: 'Review 5 past sessions.', unlocked: false, icon: Award, imageHint: 'magnifying glass book' },
  { id: 'centuryMark', name: 'Century Mark', description: 'Answer 100 questions correctly.', unlocked: true, icon: Star, imageHint: 'number 100' },
];

export default function AchievementsPage() {
  const unlockedCount = achievementsList.filter(ach => ach.unlocked).length;
  const totalAchievements = achievementsList.length;
  const progressPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Award className="mr-3 h-8 w-8 text-accent" /> Achievements
          </h1>
          <p className="text-muted-foreground">Track your milestones and celebrate your progress.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Your Progress</CardTitle>
            <CardDescription>
              You've unlocked {unlockedCount} out of {totalAchievements} achievements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} aria-label={`${progressPercentage}% achievements unlocked`} className="w-full h-3" />
            <p className="text-sm text-muted-foreground mt-2 text-center">{Math.round(progressPercentage)}% Unlocked</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievementsList.map(ach => (
            <Card key={ach.id} className={`shadow-md hover:shadow-lg transition-shadow ${ach.unlocked ? 'border-accent' : 'opacity-70'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{ach.name}</CardTitle>
                {ach.unlocked ? <Unlock className="h-5 w-5 text-accent" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
              </CardHeader>
              <CardContent className="text-center">
                <div className="my-4 flex justify-center">
                  <ach.icon className={`h-16 w-16 ${ach.unlocked ? 'text-accent' : 'text-muted-foreground'}`} />
                </div>
                 <Image 
                    src={`https://placehold.co/300x150.png`} 
                    alt={ach.name} 
                    width={300} 
                    height={150} 
                    className="rounded-md mb-4 w-full object-cover aspect-[2/1]"
                    data-ai-hint={ach.imageHint}
                  />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground cursor-help h-10 overflow-hidden">{ach.description}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{ach.description}</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
