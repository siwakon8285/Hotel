export function LoadingScreen({ progress = 0 }: { progress?: number }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-primary">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="font-heading text-3xl md:text-4xl tracking-widest uppercase">
          Aurora Grand
        </h1>
        
        <div className="w-48 h-1 bg-border overflow-hidden rounded-full">
          <div 
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        
        <p className="text-sm font-mono tracking-widest text-muted-foreground">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
