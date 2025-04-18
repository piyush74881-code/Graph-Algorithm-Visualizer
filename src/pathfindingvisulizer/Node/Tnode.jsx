import React from 'react';
import './node.css';

function Tnode({ row, col, isStart, isFinish, isWall, onClick }) {
  let extraClassName = '';
  if (isStart) extraClassName = 'node-start';
  else if (isFinish) extraClassName = 'node-finish';
  else if (isWall) extraClassName = 'node-wall';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onClick={onClick}
    ></div>
  );
}

export default Tnode;
