import React, { useState, useEffect } from "react";
import { Trash2, Edit2 } from "lucide-react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
  GridValueFormatterParams,
  GridColumnHeaderParams,
} from "@mui/x-data-grid";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { FilterState, Transaction, TransactionFilterPayload } from "../../types";
import { TextField, Box, Typography } from "@mui/material";
import { useExpenses } from "../../hooks/useExpenses";

function CustomNoRowsOverlay() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Typography>No transactions found</Typography>
    </Box>
  );
}

const ExpenseTable: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(10);
  const { expenses, loading, totalExpenses, getFilteredTransactions, deleteExpense } = useExpenses();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit expense with id:", id);
  };

  const [filters, setFilters] = useState<FilterState>({
    title: "",
    description: "",
    categoryId: "",
    startDate: "",
    endDate: ""
  });

  const handleFilterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    let payload: TransactionFilterPayload   = {
      PageNumber: 1,
      PageSize: 10,
      Type: "Expense",
      StartDate: filters.startDate,
      EndDate: filters.endDate,
      SortbyColumn: null,
      SortbyOrder: null,	
      Filters: {
        ...filters,
        [name]: value
      } as FilterState
    };
    await getFilteredTransactions(payload);
  };

  const handleDateChange = async (value: Dayjs | null, isStartDate: boolean) => {
    const name = isStartDate ? "startDate" : "endDate";
    setFilters((prev) => ({ ...prev, [name]: value }));
    let payload: TransactionFilterPayload   = {
      PageNumber: 1,
      PageSize: 10,
      Type: "Expense",
      StartDate: filters.startDate,
      EndDate: filters.endDate,
      SortbyColumn: null,
      SortbyOrder: null,	
      Filters: {
        ...filters,
        [name]: value
      } as FilterState
    };
    await getFilteredTransactions(payload);
  };

  const columns: GridColDef[] = [
    { 
      field: "title", 
      headerName: "Title",
      flex: 1, 
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>{params.colDef.headerName}</Box>
          <TextField
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
          />
        </Box>
      ),
      renderCell: (params: any) => (
          <div className="font-medium text-gray-900 leading-tight">{params.row.title}</div>
      ),
    },
    { 
      field: "description", 
      headerName: "Description",
      flex: 1, 
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>{params.colDef.headerName}</Box>
          <TextField
            name="description"
            value={filters.description}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
          />
        </Box>
      ),
      renderCell: (params: any) => (
          <div className="font-medium text-gray-900 leading-tight">{params.row.description}</div>
      ),
    },
    {
      field: "categoryId",
      headerName: "Category",
      width: 140,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>{params.colDef.headerName}</Box>
          <TextField
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
          />
        </Box>
      ),
      renderCell: (params: any) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full `}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "transactionDate",
      headerName: "Date",
      width: 300,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ fontWeight: 'bold' }}>{params.colDef.headerName}</Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              
              label="Start Date"
              value={dayjs(filters.startDate)}
              onChange={(newValue) => {handleDateChange(newValue, true)}}
              slotProps={{ textField: { variant: 'standard', size: 'small', fullWidth: true, sx: { mb: 1 } } }}
            />
            <DatePicker 
              label="End Date"
              value={dayjs(filters.endDate)}
              onChange={(newValue) => handleDateChange(newValue, false)}
              slotProps={{ textField: { variant: 'standard', size: 'small', fullWidth: true } }}
            />
          </LocalizationProvider>
          </Box>
        </Box>
      ),
      valueGetter: (params: GridValueGetterParams) => new Date(params.value as string),
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value instanceof Date
          ? params.value.toLocaleDateString("en-GB")
          : new Date(params.value as string).toLocaleDateString("en-GB"),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 140,
      type: "number",
      headerAlign: "right",
      align: "right",
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>{params.colDef.headerName}</Box>
        </Box>
      ),
      renderCell: (params: any) => {
        const sign = params.row.type === "income" ? "+" : "-";
        const textColorClass =
          params.row.type === "income" ? "text-green-600" : "text-red-600";
        return (
          <span className={`font-medium ${textColorClass}`}>
            {typeof params.value === 'number'
              ? `${sign}${(params.value as number).toFixed(2)}`
              : `${sign}0.00`}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      align: 'right',
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>{params.colDef.headerName}</Box>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<any>) => (
        <div className="flex items-center justify-end space-x-1 h-full py-2 pr-2">
          <button
            onClick={() => handleEdit(params.id as string)}
            className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-md transition-colors"
            aria-label={`edit-${params.id}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(params.id as string)}
            className="text-red-600 hover:bg-red-100 p-1.5 rounded-md transition-colors"
            aria-label={`delete-${params.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <div style={{ height: '70vh', width: "100%" }}>
        <DataGrid
          rows={expenses ?? []}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.transactionId}
          rowCount={totalExpenses}
          pageSize={pageSize}
          onPageSizeChange={(newSize: number) => setPageSize(newSize)}
          rowsPerPageOptions={[5, 10, 25, 50]}
          pagination
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          disableColumnMenu
          disableSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          initialState={{
            sorting: { sortModel: [{ field: "transactionDate", sort: "desc" }] },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              color: '#6b7280',
              fontSize: '0.8rem',
              fontWeight: 300,
              minHeight: '100px !important',
              '.MuiDataGrid-columnHeaderTitleContainer': {
                paddingLeft: '5px',
                justifyContent: 'flex-start',
              },
            },
            '& .MuiDataGrid-columnHeader': {
              height: '100px !important',
                '&:focus-within': {
                    outline: 'none',
                },
                '&:focus': {
                    outline: 'none',
                },
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e5e7eb',
              paddingY: '',
              paddingX: '',
              '&:focus-within': {
                outline: 'none',
              },
              '&:focus': {
                outline: 'none',
              },
            },
            '& .MuiDataGrid-row': {
              minHeight: '64px !important',
              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
            },
            '& .MuiDataGrid-columnHeader--alignRight .MuiDataGrid-columnHeaderTitleContainer': {
                justifyContent: 'flex-end',
                paddingRight: '16px',
            },
            '& .MuiDataGrid-cell--textRight': {
                justifyContent: 'flex-end',
                paddingRight: '16px',
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseTable;