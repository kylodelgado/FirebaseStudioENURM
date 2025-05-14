"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookCopy, Clock, ClipboardList, Settings, Play } from 'lucide-react';
import Image from 'next/image';

const examYears = ["2023", "2022", "2021", "2020", "All Years"];

export default function StudyModesPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Study Mode</h1>
        <p className="text-muted-foreground">Tailor your practice sessions to fit your learning style and goals.</p>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Practice Mode Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <BookCopy className="h-8 w-8 text-accent" />
              <CardTitle className="text-2xl">Practice Mode</CardTitle>
            </div>
            <CardDescription>Customize your practice. Choose the number of questions, toggle shuffle, and select specific exams.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="numQuestionsPractice">Number of Questions</Label>
              <Input id="numQuestionsPractice" type="number" defaultValue="20" min="5" max="100" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="shufflePractice" className="flex flex-col space-y-1">
                <span>Shuffle Questions</span>
                <span className="font-normal leading-snug text-muted-foreground text-xs">Randomize the order of questions.</span>
              </Label>
              <Switch id="shufflePractice" defaultChecked />
            </div>
            <div>
              <Label htmlFor="examYearPractice">Select Exam Year(s)</Label>
              <Select defaultValue="All Years">
                <SelectTrigger id="examYearPractice">
                  <SelectValue placeholder="Select exam(s)" />
                </SelectTrigger>
                <SelectContent>
                  {examYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <Image src="https://placehold.co/400x200.png" alt="Practice Mode illustration" width={400} height={200} className="rounded-md mt-4 w-full object-cover" data-ai-hint="study books" />
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href="/practice?mode=practice"><Play className="mr-2 h-4 w-4"/> Start Practice</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Timed Mode Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-8 w-8 text-accent" />
              <CardTitle className="text-2xl">Timed Mode</CardTitle>
            </div>
            <CardDescription>Challenge yourself against the clock. You'll have one minute per question.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="numQuestionsTimed">Number of Questions</Label>
              <Input id="numQuestionsTimed" type="number" defaultValue="10" min="5" max="50" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="shuffleTimed" className="flex flex-col space-y-1">
                <span>Shuffle Questions</span>
                 <span className="font-normal leading-snug text-muted-foreground text-xs">Randomize the order of questions.</span>
              </Label>
              <Switch id="shuffleTimed" />
            </div>
             <Image src="https://placehold.co/400x200.png" alt="Timed Mode illustration" width={400} height={200} className="rounded-md mt-4 w-full object-cover" data-ai-hint="stopwatch timer" />
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href="/practice?mode=timed"><Play className="mr-2 h-4 w-4"/> Start Timed Practice</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Exam Simulation Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="h-8 w-8 text-accent" />
              <CardTitle className="text-2xl">Exam Simulation</CardTitle>
            </div>
            <CardDescription>Experience a full ENURM exam. 100 questions, 120 minutes. Test your endurance and knowledge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-md">
              <p className="font-semibold">Details:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>100 Questions</li>
                <li>120 Minutes</li>
                <li>Mimics real exam conditions</li>
              </ul>
            </div>
             <Image src="https://placehold.co/400x200.png" alt="Exam Simulation illustration" width={400} height={200} className="rounded-md mt-4 w-full object-cover" data-ai-hint="exam checklist" />
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/practice?mode=simulation"><Play className="mr-2 h-4 w-4"/> Start Exam Simulation</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
