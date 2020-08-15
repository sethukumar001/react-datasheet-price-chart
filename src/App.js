import React from 'react';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import { Wrapper, SomeWrapper, TableRow, TableCell } from "./ui";
import data from './api';
import { Button } from '@material-ui/core';


class App extends React.Component {

  state={
    grid:[],
    count:0
  }


  componentWillMount() {
    console.log(data)
    this.generateGrid(data)
  }



  generateGrid = (data) => {
    let grid = [];
    let rowData = [...new Set(data.map(d => d.feature1))].sort();
    let columnData = [...new Set(data.map(d => d.feature2))].sort();

    for (let i = 0; i < columnData.length; i++) {
      if (i == 0) {
        grid.push([{ value: "Price Chart" }, ...rowData.map((val) => { return { value: val } })])
      }
      let gridCol = []
      for (let j = 0; j < rowData.length; j++) {
        if (j == 0) {
          gridCol.push({ value: columnData[i] })
        }
        const gridVal = data.filter(obj => obj.feature1 == rowData[j] && obj.feature2 == columnData[i])
        gridCol.push({ value: gridVal.length > 0 ? gridVal[0].price : "null" })
      }
      grid.push(gridCol)
    }
    this.setState({ grid })
  }




  handleSubmit = () => {
    // get column data
    let newArray = this.state.grid;
    var column = [];
    function getCol(matrix, col) {
      for (var i = 0; i < matrix.length; i++) {
        column.push(matrix[i][col]);
      }
      return column;
    }
    getCol(newArray, 0)
    // get row data
    let row = newArray[0].filter((row, index) => {
      return row.value
    })
    const exp = () => {
      let priceChartRequest = []
      for (let i = 0; i <= row.length - 1; i++) {
        for (let j = 0; j <= row.length - 1; j++) {
          if (i > 0 && j > 0) {
            priceChartRequest.push({
              feature2: column[i].value,
              feature1: row[j].value,
              price: newArray[i][j].value
            })
          }
        }
      }
      console.log(priceChartRequest)
    }
    exp()
  }


  
  render() {
    if(this.state.grid.length !== 0){
    return (
      <Wrapper>
        <ReactDataSheet
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          onCellsChanged={changes => {
            const grid = this.state.grid.map(row => [...row])
            changes.forEach(({ cell, row, col, value }) => {
              const validated = cell.format === 'number' ? parseFloat(value) : value
              grid[row][col] = { ...grid[row][col], value: validated }
            })
            this.setState({ grid })
          }}
          sheetRenderer={SomeWrapper}
          cellRenderer={TableCell}
          rowRenderer={TableRow}
        />
        <button onClick={this.handleSubmit}>Submit</button>
      </Wrapper>
    );
  }
  else{
    return(
      <>
      <div className="App"><b>Please Add Price chart table</b></div>
      <div className="App">
        <div style={{marginBottom:"10px"}}>
     Rows : <Button style={{backgroundColor:"gray",color:"white",marginLeft:"10px",marginRight:"10px"}}>( + )</Button>
       {this.state.count}
            <Button style={{backgroundColor:"gray",color:"white",marginLeft:"10px"}}>( - )</Button>
        </div>
   Cols : <Button style={{backgroundColor:"gray",color:"white",marginLeft:"10px",marginRight:"10px"}}>( + )</Button>
       {this.state.count}
            <Button style={{backgroundColor:"gray",color:"white",marginLeft:"10px"}}>( - )</Button>
      </div>
      </>
    
    )
  }
}
}
export default App;
