export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">Next.js Boilerplate</h1>
            <p className="text-sm text-muted-foreground">Welcome back</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
