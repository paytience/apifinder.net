import React from 'react';
import { ApiEntry } from '../types';
import ApiCard from './ApiCard';

interface ApiListProps {
  apis: ApiEntry[];
}

const ApiList: React.FC<ApiListProps> = ({ apis }) => {
  if (apis.length === 0) {
    return (
      <div className="no-results">
        <p>No APIs found matching your search criteria.</p>
        <p>Try adjusting your search terms or category filter.</p>
      </div>
    );
  }

  return (
    <div className="api-list">
      {apis.map((api, index) => (
        <ApiCard key={`${api.API}-${index}`} api={api} />
      ))}
    </div>
  );
};

export default ApiList;
