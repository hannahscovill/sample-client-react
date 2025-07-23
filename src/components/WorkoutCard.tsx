import { useState, useEffect } from 'react';

interface Workout {
  id: number;
  workout: string;
  created_at: string;
  updated_at: string;
}

interface Score {
  id: number;
  score: string;
  workout_id: number;
  created_at: string;
  athlete_id: string;
}

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState('');
  
  const workoutLines = workout.workout.split('\n');
  const title = workoutLines[0];
  const description = workoutLines.slice(1).join('\n');

  const fetchScores = async () => {
    try {
      setLoadingScores(true);
      const response = await fetch(`http://127.0.0.1:3000/scores?workout_id=${workout.id}`);
      if (response.ok) {
        const data = await response.json();
        setScores(data);
      } else {
        console.error('Failed to fetch scores');
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [workout.id]);

  const handleSaveScore = async () => {
    if (!score.trim()) return;
    
    try {
      const response = await fetch('http://127.0.0.1:3000/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: {
            workout_id: workout.id,
            athlete_id: "hannah",
            score: score.trim()
          }
        })
      });

      if (response.ok) {
        setScore('');
        setShowModal(false);
        // Refresh scores after saving
        fetchScores();
      } else {
        console.error('Failed to save score');
        alert('Failed to save score. Please try again.');
      }
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Error saving score. Please try again.');
    }
  };

  return (
    <div className="workout-card">
      <h3>{title}</h3>
      <pre className="workout-description">{description}</pre>
      <div className="workout-meta">
        <small>Created: {new Date(workout.created_at).toLocaleDateString()}</small>
      </div>
      
      <div className="scores-section">
        <div className="scores-header">
          <h4>Scores</h4>
          <button 
            className="add-score-btn" 
            onClick={() => setShowModal(true)}
          >
            Add Score
          </button>
        </div>
        {loadingScores ? (
          <p className="loading">Loading scores...</p>
        ) : scores.length > 0 ? (
          <div className="scores-list">
            {scores.map((scoreItem) => (
              <div key={scoreItem.id} className="score-item">
                <span className="athlete-name">{scoreItem.athlete_id}</span>
                <span className="score-value">{scoreItem.score}</span>
                <span className="score-date">
                  {new Date(scoreItem.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-scores">No scores recorded yet</p>
        )}
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Record Score for {title}</h3>
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Enter your score"
              className="score-input"
            />
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleSaveScore} className="save-btn">
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}