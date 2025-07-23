interface Workout {
  id: number;
  workout: string;
  created_at: string;
  updated_at: string;
}

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const workoutLines = workout.workout.split('\n');
  const title = workoutLines[0];
  const description = workoutLines.slice(1).join('\n');

  return (
    <div className="workout-card">
      <h3>{title}</h3>
      <pre className="workout-description">{description}</pre>
      <div className="workout-meta">
        <small>Created: {new Date(workout.created_at).toLocaleDateString()}</small>
      </div>
    </div>
  );
}