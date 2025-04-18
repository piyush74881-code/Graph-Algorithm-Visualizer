import React, { useEffect, useState } from "react";
import Tnode from "./Node/Tnode";
import './pathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';

const START_NODE_ROW = 5;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 40;

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const createInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 18; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      const node = createNode(row, col);
      if (row === START_NODE_ROW && col === START_NODE_COL) node.isStart = true;
      if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) node.isFinish = true;
      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
};

function PathVisualizer() {
  const [grid, setGrid] = useState([]);
  const [mode, setMode] = useState("start");
  const [startPos, setStartPos] = useState({ row: START_NODE_ROW, col: START_NODE_COL });
  const [finishPos, setFinishPos] = useState({ row: FINISH_NODE_ROW, col: FINISH_NODE_COL });
  const [algorithm, setAlgorithm] = useState("dijkstra");

  useEffect(() => {
    setGrid(createInitialGrid());
  }, []);

  const handleNodeClick = (row, col) => {
    const newGrid = grid.map((r, rIdx) =>
      r.map((node, cIdx) => {
        const updatedNode = { ...node };
        if (rIdx === row && cIdx === col) {
          if (mode === "start") {
            setStartPos({ row, col });
            updatedNode.isStart = true;
          } else if (mode === "finish") {
            setFinishPos({ row, col });
            updatedNode.isFinish = true;
          } else if (mode === "wall") {
            updatedNode.isWall = !updatedNode.isWall;
          }
        } else {
          if (mode === "start" && node.isStart) updatedNode.isStart = false;
          if (mode === "finish" && node.isFinish) updatedNode.isFinish = false;
        }
        return updatedNode;
      })
    );

    setGrid(newGrid);
  };

  const visualizeAlgorithm = () => {
    const startNode = grid[startPos.row][startPos.col];
    const finishNode = grid[finishPos.row][finishPos.col];

    const visitedNodesInOrder =
      algorithm === "dijkstra" ? dijkstra(grid, startNode, finishNode)
        : algorithm === "bfs" ? bfs(grid, startNode, finishNode)
        : dfs(grid, startNode, finishNode);

    const shortestPathNodes = getNodesInShortestPathOrder(finishNode);

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(shortestPathNodes);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element && !node.isStart && !node.isFinish) {
          element.className = 'node node-visited';
        }
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      setTimeout(() => {
        const node = nodes[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element && !node.isStart && !node.isFinish) {
          element.className = 'node node-shortest-path';
        }
      }, 50 * i);
    }
  };

  const resetGrid = () => {
    // Remove all classes from DOM nodes
    for (let row = 0; row < 18; row++) {
      for (let col = 0; col < 50; col++) {
        const element = document.getElementById(`node-${row}-${col}`);
        if (element) {
          element.className = 'node'; // reset to default class
        }
      }
    }

    // Reset grid and state
    setGrid(createInitialGrid());
    setStartPos({ row: START_NODE_ROW, col: START_NODE_COL });
    setFinishPos({ row: FINISH_NODE_ROW, col: FINISH_NODE_COL });
    setMode("start");
    setAlgorithm("dijkstra");
  };

  return (
    <>
      <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    justifyContent: "center", // Centers the buttons horizontally
    flexWrap: "wrap",          // Wraps buttons to next line if screen is small
  }}
>
  <button onClick={() => setMode("start")}>Set Start</button>
  <button onClick={() => setMode("finish")}>Set Finish</button>
  <button onClick={() => setMode("wall")}>Toggle Wall</button>
  <button onClick={() => setAlgorithm("dijkstra")}>Dijkstra</button>
  <button onClick={() => setAlgorithm("bfs")}>BFS</button>
  <button onClick={() => setAlgorithm("dfs")}>DFS</button>
  <button onClick={visualizeAlgorithm} className="visualize-btn">
    Visualize {algorithm.toUpperCase()}
  </button>
  <button onClick={resetGrid} className="reset-btn">
    Reset
  </button>
</div>

      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid-row">
            {row.map((node, nodeIdx) => (
              <Tnode
                key={nodeIdx}
                row={node.row}
                col={node.col}
                isStart={node.isStart}
                isFinish={node.isFinish}
                isWall={node.isWall}
                onClick={() => handleNodeClick(node.row, node.col)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default PathVisualizer;
