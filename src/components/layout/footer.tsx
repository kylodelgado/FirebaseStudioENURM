export function Footer() {
  return (
    <footer className="py-8 border-t">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ENURM Ace. All rights reserved.
      </div>
    </footer>
  );
}
