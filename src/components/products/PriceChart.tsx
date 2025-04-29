import React from 'react';
import { PriceHistory } from '../../types';
import './PriceChart.css';

interface PriceChartProps {
  priceHistory: PriceHistory[];
}

const PriceChart: React.FC<PriceChartProps> = ({ priceHistory }) => {
  // [BASIC] chart (no chart library (Chart.js?))

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="price-chart-container">
      <p className="price-chart-placeholder">
        Price chart will be displayed here.
        <br />
        {/* simple price history info */}
        <span className="price-history-note">
          The price has changed {priceHistory.length} times recently.
        </span>
      </p>
      
      <div className="price-history-table">
        <h3>Price History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((entry, index) => (
              <tr key={entry.history_id || index}>
                <td>{formatDate(entry.time_stamp)}</td>
                <td>{formatPrice(entry.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceChart;