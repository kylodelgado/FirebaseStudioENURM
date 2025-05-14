"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Flag, Lightbulb } from 'lucide-react';

// Placeholder data structure for a question
interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
  year?: string;
}

const sampleQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the primary function of the mitochondria in a eukaryotic cell?',
    options: [
      { id: 'opt1', text: 'Protein synthesis' },
      { id: 'opt2', text: 'Energy production (ATP synthesis)' },
      { id: 'opt3', text: 'Lipid storage' },
      { id: 'opt4', text: 'Waste breakdown' },
    ],
    correctOptionId: 'opt2',
    explanation: 'Mitochondria are known as the powerhouses of the cell because they generate most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.',
    year: '2022'
  },
  {
    id: 'q2',
    text: 'Which of the following is a common symptom of Type 2 Diabetes?',
    options: [
      { id: 'opt1', text: 'Rapid weight gain' },
      { id: 'opt2', text: 'Increased thirst and frequent urination' },
      { id: 'opt3', text: 'Chronic cough' },
      { id: 'opt4', text: 'Hair loss' },
    ],
    correctOptionId: 'opt2',
    explanation: 'Increased thirst (polydipsia) and frequent urination (polyuria) are classic symptoms of Type 2 Diabetes due to high blood sugar levels.',
    year: '2023'
  },
  // Add more sample questions
];

export default function PracticePage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'practice'; // e.g., practice, timed, simulation
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // For timed mode, 1 min per question
  const [isSessionOver, setIsSessionOver] = useState(false);

  useEffect(() => {
    // Fetch questions based on mode, number, etc.
    // For now, use sampleQuestions
    // In a real app, this would involve API calls to Firebase/AWS
    setQuestions(sampleQuestions.slice(0,10)); // Simulate fetching 10 questions
    setTimeLeft(mode === 'timed' ? sampleQuestions.length * 60 : 0); // Example: 60s/question for timed
  }, [mode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'timed' && timeLeft > 0 && !isSessionOver && questions.length > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (mode === 'timed' && timeLeft === 0 && !isSessionOver && questions.length > 0) {
      // Time's up for the current question or session
      handleNextQuestion(true); // Force next or end session
    }
    return () => clearTimeout(timer);
  }, [timeLeft, mode, isSessionOver, questions]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    setShowFeedback(true);
    if (selectedAnswer === currentQuestion.correctOptionId) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = (forceNext = false) => {
    if (!forceNext && !showFeedback && selectedAnswer !== null) { // If an answer is selected but not submitted, submit it first.
       handleAnswerSubmit();
       return;
    }

    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      if (mode === 'timed') setTimeLeft(60); // Reset timer for next question in some timed modes
    } else {
      setIsSessionOver(true);
    }
  };

  if (questions.length === 0 && !isSessionOver) {
    return <div className="container mx-auto p-6 text-center">Loading questions...</div>;
  }
  
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + (showFeedback ? 1 : 0)) / questions.length) * 100 : 0;


  if (isSessionOver) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Session Complete!</CardTitle>
            <CardDescription>Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-4">Your score: <span className="font-bold text-accent">{score}</span> / {questions.length}</p>
            <Progress value={(score / questions.length) * 100} className="w-full mb-6" />
            <Button asChild>
              <a href="/dashboard">Back to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!currentQuestion) {
     return <div className="container mx-auto p-6 text-center">No more questions or error loading question.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl md:text-2xl">Practice Session: {mode.charAt(0).toUpperCase() + mode.slice(1)}</CardTitle>
            {mode === 'timed' && <span className="text-lg font-semibold text-destructive">Time Left: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>}
          </div>
          <CardDescription>Question {currentQuestionIndex + 1} of {questions.length} {currentQuestion.year && `(From ${currentQuestion.year} Exam)`}</CardDescription>
          <Progress value={progressPercentage} className="w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-semibold leading-relaxed">{currentQuestion.text}</p>
          
          <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} disabled={showFeedback}>
            {currentQuestion.options.map(option => {
              let itemClass = "hover:bg-muted/50";
              if (showFeedback) {
                if (option.id === currentQuestion.correctOptionId) {
                  itemClass = "bg-green-100 dark:bg-green-800 border-green-500";
                } else if (option.id === selectedAnswer && option.id !== currentQuestion.correctOptionId) {
                  itemClass = "bg-red-100 dark:bg-red-800 border-red-500";
                }
              }
              return (
                <Label 
                  key={option.id} 
                  htmlFor={option.id}
                  className={`flex items-center space-x-3 p-4 border rounded-md cursor-pointer transition-colors ${itemClass}`}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <span>{option.text}</span>
                   {showFeedback && option.id === currentQuestion.correctOptionId && <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />}
                   {showFeedback && option.id === selectedAnswer && option.id !== currentQuestion.correctOptionId && <XCircle className="h-5 w-5 text-red-600 ml-auto" />}
                </Label>
              );
            })}
          </RadioGroup>

          {showFeedback && currentQuestion.explanation && (
            <Card className="bg-secondary/50 p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-md flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-yellow-500"/> Explanation</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-muted-foreground">
                {currentQuestion.explanation}
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button variant="outline"><Flag className="mr-2 h-4 w-4" /> Flag Question</Button>
          <div className="flex gap-2">
            {showFeedback ? (
              <Button onClick={() => handleNextQuestion()} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
                {currentQuestionIndex === questions.length - 1 ? 'Finish Session' : 'Next Question'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                Submit Answer
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
