import { useState } from 'react'
import Pathvisulizer from './pathfindingvisulizer/pathfindingvisulizer';

import './App.css'

function App() {


  return (
    <>
     
     <h1 style={{ textAlign: 'center', color: '#1976d2', margin: '20px 0', fontSize: '2.5rem' }}>
  Pathfinding Visualizer - See Algorithms Come to Life
</h1>

      <Pathvisulizer/>
     
    </>
  )
}

export default App
