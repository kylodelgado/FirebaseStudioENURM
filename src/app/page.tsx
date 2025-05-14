import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, BarChart3, Users } from 'lucide-react';
import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';

const features = [
  {
    icon: <CheckCircle className="h-8 w-8 text-accent" />,
    title: 'Real ENURM Questions',
    description: 'Practice with a vast library of questions mirroring actual exam content and difficulty.',
    dataAiHint: 'exam study'
  },
  {
    icon: <Zap className="h-8 w-8 text-accent" />,
    title: 'Track Your Progress',
    description: 'Monitor your performance, identify strengths and weaknesses, and see your improvement over time.',
    dataAiHint: 'analytics chart'
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: 'Study Anytime, Anywhere',
    description: 'Access your study materials and practice sessions on any device, fitting learning into your schedule.',
    dataAiHint: 'mobile learning'
  },
];

const testimonials = [
  {
    quote: "ENURM Ace was a game-changer for my exam preparation. The variety of questions and detailed feedback helped me score higher than I expected!",
    name: "Alex P.",
    title: "Successful ENURM Candidate",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: 'person portrait'
  },
  {
    quote: "The timed mode and exam simulations are incredibly realistic. I felt much more confident on exam day thanks to this platform.",
    name: "Maria S.",
    title: "Medical Student",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: 'student happy'
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Ace Your ENURM Exam with Confidence
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              The ultimate platform to practice, track your progress, and master the ENURM.
              Start your journey to success today!
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
              <Link href="/auth?mode=signup">Start Practicing for ENURM Today</Link>
            </Button>
            <div className="mt-12">
              <Image
                src="https://placehold.co/800x400.png"
                alt="Dashboard preview"
                width={800}
                height={400}
                className="rounded-lg shadow-xl mx-auto"
                data-ai-hint="medical exam dashboard"
              />
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Choose ENURM Ace?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Loved by Students Like You
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                        data-ai-hint={testimonial.dataAiHint}
                      />
      
                      <div>
                        <p className="text-lg font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                    <blockquote className="mt-4 text-muted-foreground italic">
                      "{testimonial.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your ENURM Preparation?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of students who are acing their exams with ENURM Ace.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
              <Link href="/auth?mode=signup">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
