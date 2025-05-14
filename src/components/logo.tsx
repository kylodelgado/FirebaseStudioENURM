import Link from 'next/link';
import { BookMarked } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-2xl font-bold text-primary ${className}`}>
      <BookMarked className="h-8 w-8 text-accent" />
      <span>ENURM Ace</span>
    </Link>
  );
}
