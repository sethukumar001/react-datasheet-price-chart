import React from 'react';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import { Wrapper, SomeWrapper, TableRow, TableCell, ButtonStyle } from "./ui";
import data from './api';


class App extends React.Component {

  state = {
    grid: [],
    rowsCount: 4,
    colsCount: 4
  }


  componentWillMount() {
    // console.log(data)
    // this.generateGrid(data)
  }

  componentDidUpdate(){
   if(this.state.grid && this.state.grid.length !== 0){
     this.state.grid[0][0] = {value:"Price chart", readOnly: true }
   }
  }



  generateGrid = (data) => {
    if (data.length !== 0) {
      let grid = [];
      let rowData = [...new Set(data.map(d => d.feature1))].sort();
      let columnData = [...new Set(data.map(d => d.feature2))].sort();

      for (let i = 0; i < columnData.length; i++) {
        if (i == 0) {
          grid.push([{ value: "Price Chart", readOnly: true }, ...rowData.map((val) => { return { value: val } })])
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


  increaseCountRows = () => {
    if (this.state.rowsCount !== 3) {
      this.setState({ rowsCount: this.state.rowsCount + 1 })
    } else {
      alert("should not be lessthen 4")
    }
  }

  descreseCountRows = () => {

    if (this.state.rowsCount !== 4) {
      this.setState({ rowsCount: this.state.rowsCount - 1 })
    } else {
      alert("should not be lessthen 4")
    }

  }
  increaseCountCols = () => {
    if (this.state.colsCount !== 3) {
      this.setState({ colsCount: this.state.colsCount + 1 })
    } else {
      alert("should not be lessthen 4")
    }

  }

  descreseCountCols = () => {
    if (this.state.colsCount !== 4) {
      this.setState({ colsCount: this.state.colsCount - 1 })
    } else {
      alert("should not be lessthen 4")
    }
  }



  createPriceChart = () => {
    // console.log(this.state.rowsCount, this.state.colsCount)
    // if (this.state.rowsCount === this.state.colsCount) {
      let rows = this.state.rowsCount;
      let columns = this.state.colsCount;
      let grid = [];
      for (let i = 0; i <= rows - 1; i++) {
        let gridCol = []
        for (let j = 0; j <= columns - 1; j++) {
          gridCol.push({ value: "" })
        }
        grid.push(gridCol)
      }
      this.setState({ grid })
    // } else {
    //   alert("rows and columns should be equal")
    // }

  }



  render() {

    if (this.state.grid.length !== 0) {
      return (
        <Wrapper>
          <div className="App"><b> Price chart table</b></div>
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
          <ButtonStyle onClick={this.handleSubmit} >Submit</ButtonStyle>
        </Wrapper>
      );
    }
    else {
      return (
        <>
          <div className="App"><b>Please Add Price chart table</b></div>
          <div className="App">
            <div style={{ marginBottom: "10px" }}>
              Rows : <ButtonStyle
                onClick={this.increaseCountRows}
              >( + )</ButtonStyle>
              {this.state.rowsCount}
              <ButtonStyle
                onClick={this.descreseCountRows}
              >( - )</ButtonStyle>
            </div>
               Cols : <ButtonStyle
              onClick={this.increaseCountCols}
            >( + )</ButtonStyle>
            {this.state.colsCount}
            <ButtonStyle
              onClick={this.descreseCountCols}
            >( - )</ButtonStyle>
            <div className="App">
              <ButtonStyle
                onClick={this.createPriceChart}
              >Submit</ButtonStyle>
            </div>
          </div>
        </>

      )
    }
  }
}
export default App;
