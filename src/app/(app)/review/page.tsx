"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, CalendarDays, ListChecks, BarChart2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Answer {
  questionId: string;
  questionText: string;
  options: { id: string; text: string }[];
  userAnswerId: string;
  correctOptionId: string;
  explanation?: string;
}

interface Session {
  id: string;
  date: string; // Should be Date object in real app
  score: number;
  totalQuestions: number;
  mode: string;
  answers: Answer[];
}

const sampleSessions: Session[] = [
  {
    id: 'session1',
    date: '2024-07-20T10:30:00Z',
    score: 8,
    totalQuestions: 10,
    mode: 'Quick Practice',
    answers: [
      { questionId: 'q1', questionText: 'What is the capital of France?', options: [{id: 'o1', text:'Paris'}, {id:'o2', text:'London'}], userAnswerId: 'o1', correctOptionId: 'o1', explanation: 'Paris is the capital of France.' },
      { questionId: 'q2', questionText: 'What is 2 + 2?', options: [{id: 'o1', text:'3'}, {id:'o2', text:'4'}], userAnswerId: 'o1', correctOptionId: 'o2', explanation: '2 + 2 equals 4.' },
    ],
  },
  {
    id: 'session2',
    date: '2024-07-19T15:00:00Z',
    score: 15,
    totalQuestions: 20,
    mode: 'Exam Simulation',
    answers: [ /* More answers */ ],
  },
];

const mostMissedQuestions: Answer[] = [
    { questionId: 'q2', questionText: 'What is 2 + 2?', options: [{id: 'o1', text:'3'}, {id:'o2', text:'4'}], userAnswerId: 'o1', correctOptionId: 'o2', explanation: '2 + 2 equals 4.' },
    { questionId: 'q3', questionText: 'Which planet is known as the Red Planet?', options: [{id: 'o1', text:'Mars'}, {id:'o2', text:'Jupiter'}], userAnswerId: 'o2', correctOptionId: 'o1', explanation: 'Mars is known as the Red Planet due to iron oxide on its surface.' },
];


export default function ReviewModePage() {
  const [activeTab, setActiveTab] = useState("recent");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Your Performance</h1>
        <p className="text-muted-foreground">Analyze past sessions and learn from your mistakes.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
          <TabsTrigger value="missed">Most Missed</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary"/> Recent Study Sessions</CardTitle>
              <CardDescription>Review details of your past practice sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sampleSessions.length === 0 && <p>No recent sessions found.</p>}
              <Accordion type="single" collapsible className="w-full">
                {sampleSessions.map(session => (
                  <AccordionItem value={session.id} key={session.id}>
                    <AccordionTrigger>
                      <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center pr-4">
                        <div className="text-left">
                           <p className="font-semibold">{session.mode} - {formatDate(session.date)}</p>
                           <p className="text-sm text-muted-foreground">Score: {session.score}/{session.totalQuestions}</p>
                        </div>
                        <Progress value={(session.score / session.totalQuestions) * 100} className="w-full sm:w-1/3 mt-2 sm:mt-0 h-2" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/30 rounded-md">
                      <h4 className="font-semibold mb-2">Questions Review:</h4>
                      {session.answers.map(ans => (
                        <div key={ans.questionId} className="mb-3 p-3 border rounded-md">
                          <p className="font-medium">{ans.questionText}</p>
                          <p className="text-sm">Your answer: <span className={ans.userAnswerId === ans.correctOptionId ? 'text-green-600' : 'text-red-600'}>{ans.options.find(o => o.id === ans.userAnswerId)?.text || 'Not answered'}</span></p>
                          {ans.userAnswerId !== ans.correctOptionId && <p className="text-sm">Correct answer: <span className="text-green-600">{ans.options.find(o => o.id === ans.correctOptionId)?.text}</span></p>}
                          {ans.explanation && <p className="text-xs text-muted-foreground mt-1">Explanation: {ans.explanation}</p>}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="mt-2">Retake Similar Questions</Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/> Most Missed Questions</CardTitle>
              <CardDescription>Focus on questions you frequently get wrong to improve understanding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mostMissedQuestions.length === 0 && <p>No missed questions data available yet.</p>}
              {mostMissedQuestions.map(q => (
                <Card key={q.questionId} className="p-4">
                  <p className="font-semibold mb-1">{q.questionText}</p>
                  <p className="text-sm text-red-600">Your last answer: {q.options.find(o=>o.id === q.userAnswerId)?.text}</p>
                  <p className="text-sm text-green-600">Correct answer: {q.options.find(o=>o.id === q.correctOptionId)?.text}</p>
                  {q.explanation && <p className="text-xs text-muted-foreground mt-1">Explanation: {q.explanation}</p>}
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1">Review Topic</Button>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
