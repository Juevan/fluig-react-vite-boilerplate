import React, { useState, useEffect } from 'react';
import { getDataset, createConstraint } from './utils/dataset';

interface AppProps {
  instanceId: string;
  configs?: Record<string, string>;
}

interface Colleague {
  colleagueId: string;
  colleagueName: string;
  login: string;
  mail: string;
}

const App: React.FC<AppProps> = () => {
  const [users, setUsers] = useState<Colleague[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDataset<Colleague>({
      datasetId: 'colleague',
      limit: 10,
      constraints: [createConstraint('active', 'true')]
    })
      .then(setUsers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="tw-p-4 tw-bg-transparent tw-text-inherit">
      {loading && (
        <div className="tw-flex tw-justify-center tw-py-4 tw-opacity-60">
          <div className="tw-w-6 tw-h-6 tw-border-2 tw-border-current tw-border-t-transparent tw-rounded-full tw-animate-spin" style={{ color: 'var(--fs-color-brand-01, #6366f1)' }} />
        </div>
      )}

      {error && <div className="tw-text-red-500 tw-text-sm">{error}</div>}

      {!loading && !error && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          {users.map((user, i) => (
            <div 
              key={user.colleagueId || user.login || i}
              className="tw-flex tw-items-center tw-p-3 tw-rounded-lg tw-transition-all hover:tw-bg-black/5 dark:hover:tw-bg-white/5"
              style={{ border: '1px solid rgba(125,125,125,0.1)' }}
            >
              <div 
                className="tw-w-8 tw-h-8 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-font-bold tw-text-white tw-text-xs tw-mr-3"
                style={{ backgroundColor: 'var(--fs-color-brand-01, #6366f1)' }}
              >
                {user.colleagueName.charAt(0).toUpperCase()}
              </div>
              <div className="tw-flex-1">
                <p className="tw-font-medium tw-text-sm">{user.colleagueName}</p>
                <p className="tw-text-xs tw-opacity-60">{user.mail || user.login}</p>
              </div>
            </div>
          ))}
          {!users.length && <p className="tw-opacity-50 tw-text-sm">Nenhum usuário encontrado.</p>}
        </div>
      )}
    </div>
  );
};

export default App;
