import * as React from "react";
import styled from "styled-components";
import { useTable, usePagination } from "react-table";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell
};

// Be sure to pass our updateMyData and the skipPageReset option
function Table({ columns, data, updateMyData, skipPageReset }) {
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any, i: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName"
          },
          {
            Header: "Last Name",
            accessor: "lastName"
          }
        ]
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age"
          },
          {
            Header: "Visits",
            accessor: "visits"
          },
          {
            Header: "Status",
            accessor: "status"
          },
          {
            Header: "Profile Progress",
            accessor: "progress"
          }
        ]
      }
    ],
    []
  );

  const [data, setData] = React.useState(() => [
    {
      firstName: "afterthought",
      lastName: "noise",
      age: 21,
      visits: 81,
      progress: 6,
      status: "single"
    },
    {
      firstName: "stone",
      lastName: "rainstorm",
      age: 29,
      visits: 69,
      progress: 40,
      status: "complicated"
    },
    {
      firstName: "poison",
      lastName: "media",
      age: 1,
      visits: 37,
      progress: 93,
      status: "complicated"
    },
    {
      firstName: "substance",
      lastName: "touch",
      age: 17,
      visits: 67,
      progress: 46,
      status: "single"
    },
    {
      firstName: "outcome",
      lastName: "hole",
      age: 11,
      visits: 14,
      progress: 90,
      status: "complicated"
    },
    {
      firstName: "quartz",
      lastName: "fairies",
      age: 14,
      visits: 68,
      progress: 2,
      status: "relationship"
    },
    {
      firstName: "wound",
      lastName: "assistance",
      age: 0,
      visits: 20,
      progress: 82,
      status: "complicated"
    },
    {
      firstName: "entry",
      lastName: "stream",
      age: 14,
      visits: 67,
      progress: 72,
      status: "single"
    },
    {
      firstName: "umbrella",
      lastName: "monkey",
      age: 5,
      visits: 45,
      progress: 18,
      status: "complicated"
    },
    {
      firstName: "chicken",
      lastName: "sympathy",
      age: 1,
      visits: 37,
      progress: 18,
      status: "single"
    },
    {
      firstName: "cat",
      lastName: "rainstorm",
      age: 26,
      visits: 56,
      progress: 27,
      status: "complicated"
    },
    {
      firstName: "tax",
      lastName: "death",
      age: 0,
      visits: 10,
      progress: 98,
      status: "single"
    },
    {
      firstName: "dime",
      lastName: "basketball",
      age: 19,
      visits: 39,
      progress: 31,
      status: "complicated"
    },
    {
      firstName: "apparatus",
      lastName: "crate",
      age: 13,
      visits: 44,
      progress: 51,
      status: "complicated"
    },
    {
      firstName: "attack",
      lastName: "iron",
      age: 18,
      visits: 63,
      progress: 61,
      status: "complicated"
    },
    {
      firstName: "lift",
      lastName: "finger",
      age: 23,
      visits: 79,
      progress: 41,
      status: "relationship"
    },
    {
      firstName: "tub",
      lastName: "sky",
      age: 9,
      visits: 73,
      progress: 81,
      status: "relationship"
    },
    {
      firstName: "bedroom",
      lastName: "badge",
      age: 27,
      visits: 91,
      progress: 76,
      status: "relationship"
    },
    {
      firstName: "dog",
      lastName: "door",
      age: 17,
      visits: 49,
      progress: 92,
      status: "relationship"
    },
    {
      firstName: "cause",
      lastName: "boats",
      age: 15,
      visits: 14,
      progress: 38,
      status: "single"
    },
    {
      firstName: "memory",
      lastName: "nut",
      age: 4,
      visits: 95,
      progress: 48,
      status: "complicated"
    },
    {
      firstName: "turn",
      lastName: "poem",
      age: 1,
      visits: 72,
      progress: 83,
      status: "complicated"
    },
    {
      firstName: "harmony",
      lastName: "cherry",
      age: 23,
      visits: 50,
      progress: 26,
      status: "relationship"
    },
    {
      firstName: "awareness",
      lastName: "sleet",
      age: 9,
      visits: 18,
      progress: 91,
      status: "relationship"
    },
    {
      firstName: "tray",
      lastName: "yard",
      age: 17,
      visits: 65,
      progress: 19,
      status: "relationship"
    },
    {
      firstName: "goose",
      lastName: "rock",
      age: 26,
      visits: 86,
      progress: 38,
      status: "complicated"
    },
    {
      firstName: "things",
      lastName: "laborer",
      age: 0,
      visits: 42,
      progress: 56,
      status: "complicated"
    },
    {
      firstName: "amount",
      lastName: "bubble",
      age: 9,
      visits: 71,
      progress: 21,
      status: "relationship"
    },
    {
      firstName: "property",
      lastName: "waste",
      age: 27,
      visits: 33,
      progress: 44,
      status: "relationship"
    },
    {
      firstName: "crowd",
      lastName: "pencil",
      age: 13,
      visits: 48,
      progress: 81,
      status: "complicated"
    },
    {
      firstName: "amount",
      lastName: "dress",
      age: 14,
      visits: 50,
      progress: 5,
      status: "single"
    },
    {
      firstName: "soda",
      lastName: "association",
      age: 29,
      visits: 18,
      progress: 25,
      status: "complicated"
    },
    {
      firstName: "understanding",
      lastName: "vacation",
      age: 12,
      visits: 45,
      progress: 76,
      status: "complicated"
    },
    {
      firstName: "letters",
      lastName: "article",
      age: 11,
      visits: 29,
      progress: 64,
      status: "single"
    },
    {
      firstName: "twig",
      lastName: "jelly",
      age: 20,
      visits: 21,
      progress: 93,
      status: "complicated"
    },
    {
      firstName: "sugar",
      lastName: "reception",
      age: 27,
      visits: 96,
      progress: 97,
      status: "complicated"
    },
    {
      firstName: "version",
      lastName: "argument",
      age: 8,
      visits: 54,
      progress: 43,
      status: "single"
    },
    {
      firstName: "rod",
      lastName: "town",
      age: 28,
      visits: 4,
      progress: 18,
      status: "relationship"
    },
    {
      firstName: "farmer",
      lastName: "parent",
      age: 9,
      visits: 18,
      progress: 3,
      status: "single"
    },
    {
      firstName: "comparison",
      lastName: "hair",
      age: 22,
      visits: 20,
      progress: 25,
      status: "relationship"
    },
    {
      firstName: "steam",
      lastName: "square",
      age: 18,
      visits: 53,
      progress: 51,
      status: "complicated"
    },
    {
      firstName: "man",
      lastName: "business",
      age: 22,
      visits: 8,
      progress: 57,
      status: "complicated"
    },
    {
      firstName: "skate",
      lastName: "apple",
      age: 16,
      visits: 83,
      progress: 12,
      status: "relationship"
    },
    {
      firstName: "child",
      lastName: "crush",
      age: 24,
      visits: 96,
      progress: 2,
      status: "complicated"
    },
    {
      firstName: "stem",
      lastName: "meeting",
      age: 20,
      visits: 5,
      progress: 24,
      status: "relationship"
    },
    {
      firstName: "alarm",
      lastName: "feet",
      age: 22,
      visits: 3,
      progress: 79,
      status: "complicated"
    },
    {
      firstName: "shoe",
      lastName: "leg",
      age: 3,
      visits: 37,
      progress: 45,
      status: "single"
    },
    {
      firstName: "disgust",
      lastName: "grass",
      age: 23,
      visits: 82,
      progress: 99,
      status: "single"
    },
    {
      firstName: "month",
      lastName: "low",
      age: 17,
      visits: 33,
      progress: 96,
      status: "complicated"
    },
    {
      firstName: "sock",
      lastName: "yarn",
      age: 21,
      visits: 57,
      progress: 44,
      status: "relationship"
    }
  ]);
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex: any, columnId: any, value: any) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value
          };
        }
        return row;
      })
    );
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData);

  return (
    <Styles>
      <button onClick={resetData}>Reset Data</button>
      <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
    </Styles>
  );
}

export default App;
