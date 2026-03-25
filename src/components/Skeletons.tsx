export function TopicSkeleton() {
  return (
    <div className="flex items-center justify-between p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        <div className="h-4 w-24 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
      </div>
      <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          <div className="flex flex-col gap-3">
             <TopicSkeleton />
             <TopicSkeleton />
          </div>
        </div>
      ))}
    </div>
  );
}
