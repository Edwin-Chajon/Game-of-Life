import React, {  useState, useEffect } from "react";
import './App.css';
import { useAnimeFrame } from "./components/animeFrame";
import moment from "moment";
import produce from 'immer'
import { useRef } from "react";
import { number } from "prop-types";

function App (props) {


//make a grid
  const rows = 30;
  const columns = 50;

  const [grid, setGrid] = useState(Array.from({length: rows}).map(() => Array.from({length: columns}).fill(0)))
  

  // neighborhood around a single cell or pixel and how to get to them. eight neighbors
  const operations = [
    [1,1],
    [0,1],
    [1,0],
    [-1,-1],
    [-1,0],
    [0,-1],
    [-1,1],
    [1,-1],
  ]
  

  const [counter, setCounter] = useState(0)

  const [active, setActive] = useState(false)
//set the refference
  const activeRef = useRef(active)
  activeRef.current = active




  const startRunning =() => {
    if (!activeRef.current) {
      return;
    }

    let counting = 1
    let inner = 0

    setGrid(g => {
      return produce(g, gridCopy => {

        if (g === g){
          counting++
        }inner++
        for (let i = 0; i < rows; i++) {
          for (let k = 0; k < columns; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < rows && newK >= 0 && newK < columns) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }

        if(counting === 2 && inner === 1){
          console.log('end of loop');
        } let index = 0
        if(counting === 3 && inner === 2){
          setCounter(counter + 1)   
          index++   
          console.log(`generation ${index}`);
        }


      });
    });


    setTimeout(startRunning, 200);
    console.log(counting, inner)
  };



  function clearGrid() {
    window.location.reload(false);
  }

//Visualize everything
  return ( 
    <>

    <a class="coolButton"
    onClick={()=>{
      setActive(!active); 
      if(!active){
        activeRef.current = true
        startRunning()
      }
    }}>{active ? 'Stop' : 'Start'}</a>



    <a class="coolButton"
        onClick={() => {
          const newrows = [];
          for (let i = 0; i < rows; i++) {
            newrows.push(Array.from(Array(columns), () => Math.random() > 0.7 ? 1 : 0));
          }
          setGrid(newrows);
        }}
      >
        random
      </a>
        






    <a class="coolButton"
     onClick={clearGrid}>Clear</a>

    <h2>Generation: {counter}</h2>

  <div className="allHolding">
    <div style = {{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 20px)`
    }}>

      {grid.map((rows, rowIndex) => 
        rows.map((col, columnIndex) =>
          <div 
            key={`${rowIndex}-${columnIndex}`}
            onClick = {() => { 
              if(activeRef.current = !active){
              const newGrid = produce(grid, gridCopy => {
                gridCopy[rowIndex][columnIndex] = grid[rowIndex][columnIndex] ? 0 : 1;
              });
              setGrid(newGrid)
            }else{activeRef.current = active}}}
            style = {{
            width:20, height:20, backgroundColor: grid[rowIndex][columnIndex] ? '#fc047c' : 'white',
            border: 'solid 1px #643fa4'
            }}
          />
        )
      )}
    </div>
  </div>
  </>);
}

export default App;
