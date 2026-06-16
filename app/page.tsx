import PomodoroTimer from "./components/PomodoroTimer";
import WorldClockBar from "./components/WorldClockBar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-100 p-8 pt-16 font-sans dark:bg-zinc-900">
      <WorldClockBar />
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
        뽀모도로 타이머
      </h1>
      <PomodoroTimer />
    </div>
  );
}
