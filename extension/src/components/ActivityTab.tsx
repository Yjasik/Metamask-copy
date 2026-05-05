import React from 'react';
import { useActivity } from '../hooks/useActivity';
import type { FormattedTransaction } from '../hooks/useActivity';

interface ActivityTabProps {
  address: string | null;
  chainId: number;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ address, chainId }) => {
  const { transactions, isLoading, error, refetch } = useActivity(address, chainId);

  if (isLoading) {
    return <div className="flex-1 p-4 text-center text-muted">Loading activity...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 p-4 text-center text-muted">
        <p>Failed to load: {error}</p>
        <button onClick={refetch} className="link-btn mt-2">Retry</button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return <div className="flex-1 p-4 text-center text-muted">You have no transactions yet</div>;
  }

  const groupedByDate = transactions.reduce((groups: Record<string, FormattedTransaction[]>, tx) => {
    const dateKey = tx.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(tx);
    return groups;
  }, {});

  return (
    <div className="flex flex-col flex-1 p-2 overflow-y-auto">
      {Object.entries(groupedByDate).map(([date, txs]) => (
        <div key={date} className="mb-4">
          <h3 className="text-sm font-medium text-muted px-3 mb-2">{date}</h3>
          {txs.map((tx) => (
            <div key={tx.hash} className="card mb-2">
              <div className="flex items-center justify-between">
                <div>
                  {/* Incoming/outgoing indicator */}
                  <div className={`w-8 h-8 rounded-full ${tx.isIncoming ? 'bg-green-100' : 'bg-orange-100'} flex items-center justify-center`}>
                    <span className={`text-lg ${tx.isIncoming ? 'text-success' : 'text-danger'}`}>
                      {tx.isIncoming ? '↓' : '↑'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 ml-3">
                  <div className="font-medium text-sm">
                    {tx.isIncoming ? 'Received' : 'Sent'}
                  </div>
                  <div className="text-xs text-muted truncate" style={{ maxWidth: '160px' }}>
                    {tx.isIncoming ? `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${tx.isIncoming ? 'text-success' : 'text-danger'}`}>
                    {tx.isIncoming ? '+' : '-'}{tx.value} ETH
                  </div>
                  <div className="text-xs text-muted">
                    {tx.status === 'success' ? 'Confirmed' : 'Failed'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ActivityTab;