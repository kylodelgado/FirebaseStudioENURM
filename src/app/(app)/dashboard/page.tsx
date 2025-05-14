import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BookOpenText, Search, PlayCircle, Users, TrendingUp, Lightbulb } from 'lucide-react';
import Image from 'next/image';

const studyModes = [
  { title: 'Review Mode', description: 'Go over past sessions and missed questions.', icon: <BookOpenText className="h-6 w-6 text-accent" />, href: '/review', dataAiHint: 'book study' },
  { title: 'Quick Practice', description: 'Jump into a short practice session.', icon: <Zap className="h-6 w-6 text-accent" />, href: '/study-modes?mode=quick', dataAiHint: 'lightning fast' },
  { title: 'Search Questions', description: 'Find specific questions by topic or keyword.', icon: <Search className="h-6 w-6 text-accent" />, href: '/practice?mode=search', dataAiHint: 'magnifying glass' },
];

const quickTips = [
  { title: 'How to Use the Platform', content: 'Navigate through study modes, track your progress in statistics, and earn achievements!', icon: <Lightbulb className="h-5 w-5 text-primary" /> },
  { title: 'Track Achievements', content: 'Complete milestones and unlock achievements to mark your progress.', icon: <Award className="h-5 w-5 text-primary" /> },
  { title: 'Monitor Progress', content: 'Use the statistics page to see how your scores improve over time.', icon: <TrendingUp className="h-5 w-5 text-primary" /> },
];

export default function DashboardPage() {
  // Placeholder user data
  const user = { name: 'User Name' };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Ready to ace your ENURM exam? Let's get started.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Start Your Practice</CardTitle>
              <PlayCircle className="h-8 w-8 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Choose a study mode or jump straight into an exam simulation.
              </p>
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/study-modes">Explore Study Modes</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Study Mode Options</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {studyModes.map((mode) => (
                <Link href={mode.href} key={mode.title} className="block hover:no-underline">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                      {mode.icon}
                      <CardTitle className="text-lg font-medium">{mode.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                       <div className="mt-4">
                        <Image src={`https://placehold.co/300x150.png`} width={300} height={150} alt={mode.title} className="rounded-md" data-ai-hint={mode.dataAiHint} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
           <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickTips.map(tip => (
                <div key={tip.title} className="flex items-start gap-3">
                  {tip.icon}
                  <div>
                    <h4 className="font-medium">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Your Progress Snapshot</CardTitle>
               <CardDescription>A quick look at your overall performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Average Score:</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="flex justify-between">
                <span>Sessions Completed:</span>
                <span className="font-semibold">12</span>
              </div>
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/statistics">View Full Statistics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
