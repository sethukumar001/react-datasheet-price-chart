import React from 'react';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import { Wrapper, SomeWrapper, TableRow, TableCell } from "./ui";
import data from './api';



class App extends React.Component {


  componentWillMount() {
    console.log(data)
    this.generateGrid(data)
  }



  generateGrid = (data) => {
    let grid = []
    let rowData = [...new Set(data.map(d => d.feature1))].sort();
    let columnData = [...new Set(data.map(d => d.feature2))].sort();
    // row data 
    let gridRowData = [];
    rowData.map((item) => {
      gridRowData.push({
        value: item
      })
    })
    // // column data
    let gridColumnData = []
    let originData = [{ value: "Price Chart" }]
    columnData.map((item) => {
      gridColumnData.push([{
        value: item
      }])
    })
    // // final object
    let a = originData.concat(gridRowData)
    grid = [a];
    gridColumnData.map((item) => {
      grid.push(item)
    })
    for (let i = 0; i < rowData.length; i++) {
      let gridCol = []
      for (let j = 0; j < columnData.length; j++) {
        const gridVal = data.filter(obj => obj.feature1 == rowData[j] && obj.feature2 == columnData[i])
        grid[i + 1].push({
          value: gridVal[0].price
        })
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

    // request format
    let priceChartRequest = []
    const exp = () => {
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
    }
    exp()
    console.log(priceChartRequest)

  }






  render() {
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
}
export default App;