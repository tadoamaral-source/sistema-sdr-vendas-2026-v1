
import React from 'react';

interface ResultCellProps {
  value: number;
}

const ResultCell: React.FC<ResultCellProps> = ({ value }) => {
  const isNegative = value < 0;
  const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const textColor = isNegative ? 'text-red-500' : 'text-inherit';

  return (
    <span className={`font-semibold ${textColor}`}>
      {formattedValue}
    </span>
  );
};

export default ResultCell;
