import { BackendMode } from '../api/types';

interface Props {
  mode: BackendMode;
  onChange: (mode: BackendMode) => void;
}

export function ModeSelector({ mode, onChange }: Props) {
  return (
    <div className="mode-selector">
      <label htmlFor="mode">Modo de backend:</label>
      <div className="mode-buttons">
        <button
          className={`mode-button ${mode === 'rest' ? 'active' : ''}`}
          onClick={() => onChange('rest')}
        >
          🔄 REST (pull)
        </button>
        <button
          className={`mode-button ${mode === 'realtime' ? 'active' : ''}`}
          onClick={() => onChange('realtime')}
        >
          ⚡ Realtime (push)
        </button>
      </div>
    </div>
  );
}
