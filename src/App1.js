import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReactDataSheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';
import { Wrapper, SomeWrapper, TableRow, TableCell } from "./ui";
import data from './api';

class App extends React.Component {
  constructor(props) {
    super(props);



  }

  componentWillMount() {
    console.log(data)
    this.generateGrid(4, 4)
  }

  generateGrid = (row, col) => {
    let grid = []
    for (let i = 0; i < row; i++) {
      let gridCol = []
      for (let j = 0; j < col; j++) {
        gridCol.push({ value: "" })
      }
      grid.push(gridCol)
    }
    grid[0][0] = "Price Chart";
    this.setState({ grid })
  }


  componentDidMount() {
    // console.log(data)

    let rowData = [...new Set(data.map(d => d.feature1))]
    let columnData = [...new Set(data.map(d => d.feature2))]


    // row data 
    let gridRowData = [];
    rowData.map((item) => {
      gridRowData.push({
        value: item
      })
    })


    // column data
    let gridColumnData = []


    let originData = [{ value: "Price Chart" }]


    columnData.map((item) => {
      gridColumnData.push([{
        value: item
      }])
    })



    // final object
    let a = originData.concat(gridRowData)
    let grid = [a];
    gridColumnData.map((item) => {
      grid.push(item)
    })

    // to get column and row data only
    this.setState({ grid })
    for (let i = 0; i <= rowData.length - 1; i++) {
      for (let j = 0; j <= columnData.length - 1; j++) {
        const gridVal = data.filter(obj => obj.feature1 == rowData[j] && obj.feature2 == columnData[i])
        grid[i + 1].push({
          value: gridVal[0].price
        })


        this.setState({ grid })
      }
    }

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
