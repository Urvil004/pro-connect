import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-sm transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6 dark:bg-gray-800 transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn(
        "text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div 
      className={cn(
        "p-6 pt-0 dark:bg-gray-800 transition-colors duration-300", 
        className
      )} 
      {...props} 
    />
  );
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center p-6 pt-0 dark:bg-gray-800 transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}
