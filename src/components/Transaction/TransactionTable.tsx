import React, { useState } from "react";
import { Trash2, Edit2, ArrowDown, ArrowUp } from "lucide-react";
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
import { FilterState, SortState, TransactionFilterPayload } from "../../types";
import { TextField, Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useTransactions } from "../../hooks/useTransactions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CustomNoRowsOverlay() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Typography>No transactions found</Typography>
    </Box>
  );
}

const TransactionTable: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { transactions, loading, getFilteredTransactions, deleteTransaction, totalTransactions } = useTransactions();
  const navigate = useNavigate();
  
  const [sortModel, setSortModel] = useState<SortState>({
    sortByColumn: "transactionDate",
    sortByOrder: "desc"
  } as SortState);

  const [filters, setFilters] = useState<FilterState>({
    title: "",
    description: "",
    categoryName: "",
    startDate: "",
    endDate: "",
    amount: undefined,
    type: ""
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const result = await deleteTransaction(parseInt(id));

      if (result === true) {
        toast.success("Transaction deleted successfully!");
      }
    }
  };

  const handleEdit = (id: string, type: string) => {
    navigate(`Update/${id}`, { state: { type: type } });
  };

  const handleFilterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let amountValue: number | undefined;

    if (name === "amount") {
      amountValue = value === "" ? undefined : parseInt(value);
      setFilters((prev) => ({ ...prev, [name]: amountValue }));
    }
    else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }

    let payload: TransactionFilterPayload   = {
      PageNumber: page + 1,
      PageSize: pageSize,
      Type: "Expense",
      StartDate: filters.startDate,
      EndDate: filters.endDate,
      SortbyColumn: sortModel.sortByColumn,
      SortbyOrder: sortModel.sortByOrder,
      Filters: {
        ...filters,
        [name]: value,
        amount: amountValue ? amountValue : filters.amount
      } as FilterState
    };
    await getFilteredTransactions(payload);
    setPage(0);
  };

  const handleDateChange = async (value: Dayjs | null, isStartDate: boolean) => {
    const name = isStartDate ? "startDate" : "endDate";
    const newFilters = { ...filters, [name]: value ? value.format('YYYY-MM-DD') : "" };
    setFilters(newFilters);

    let payload: TransactionFilterPayload   = {
      PageNumber: page + 1,
      PageSize: pageSize,
      Type: "Expense",
      StartDate: newFilters.startDate,
      EndDate: newFilters.endDate,
      SortbyColumn: sortModel.sortByColumn,
      SortbyOrder: sortModel.sortByOrder,
      Filters: {
        ...newFilters
      } as FilterState
    };
    await getFilteredTransactions(payload);
    setPage(0);
  };

  const handleSortModelChange = async (field: string) => {
    const isCurrentSortField = sortModel.sortByColumn === field;
    const newSortOrder = isCurrentSortField && sortModel.sortByOrder === 'asc' ? 'desc' : 'asc';

    const newSortState = {
      sortByColumn: field,
      sortByOrder: newSortOrder
    } as SortState;

    setSortModel(newSortState);

    const payload: TransactionFilterPayload = {
      PageNumber: page + 1,
      PageSize: pageSize,
      Type: "Expense",
      StartDate: filters.startDate,
      EndDate: filters.endDate,
      SortbyColumn: newSortState.sortByColumn,
      SortbyOrder: newSortState.sortByOrder,
      Filters: { ...filters } as FilterState
    };
    await getFilteredTransactions(payload);
    setPage(0);
  };

  const handlePageChange = async (newPaginationModel: { page: number; pageSize: number }) => {
    if (newPaginationModel.page !== page) {
        setPage(newPaginationModel.page);
    }
    if (newPaginationModel.pageSize !== pageSize) {
      setPageSize(newPaginationModel.pageSize);
      setPage(0);
    }

    const payload: TransactionFilterPayload = {
      PageNumber: newPaginationModel.page + 1,
      PageSize: newPaginationModel.pageSize,
      Type: "Expense",
      StartDate: filters.startDate,
      EndDate: filters.endDate,
      SortbyColumn: sortModel.sortByColumn,
      SortbyOrder: sortModel.sortByOrder,
      Filters: { ...filters } as FilterState
    };
    await getFilteredTransactions(payload);
  };

  const columns: GridColDef[] = [
    { 
      field: "title", 
      headerName: "Title",
      flex: 1, 
      sortable: false,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 'bold' }}>{params.colDef.headerName}</Box>
            <button onClick={() => handleSortModelChange(params.field)} className="p-1 hover:bg-slate-200 rounded absolute right-0">
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </button>
          </Box>
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
      sortable: false, // Disable default header click sorting
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 'bold' }}>{params.colDef.headerName}</Box>
            <button onClick={() => handleSortModelChange(params.field)} className="p-1 hover:bg-slate-200 rounded absolute right-0">
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </button>
          </Box>
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
      field: "categoryName",
      headerName: "Category",
      width: 140,
      sortable: false,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 'bold' }}>{params.colDef.headerName}</Box>
            <button onClick={() => handleSortModelChange(params.field)} className="p-1 hover:bg-slate-200 rounded absolute right-0">
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </button>
          </Box>
          <TextField
            name="categoryName"
            value={filters.categoryName}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
          />
        </Box>
      ),
      renderCell: (params: any) => (
        <span
          className={`px-3 py-1 text-xs rounded-full `}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "transactionDate",
      headerName: "Date",
      width: 300,
      sortable: false,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 'bold', lineHeight: '30px' }}>{params.colDef.headerName}</Box>
            <button onClick={() => handleSortModelChange(params.field)} className="p-1 hover:bg-slate-200 rounded absolute right-0">
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={filters.startDate ? dayjs(filters.startDate) : null}
              onChange={(newValue) => {handleDateChange(newValue, true)}}
              slotProps={{
                textField: {
                  variant: 'standard',
                  size: 'small',
                  fullWidth: true,
                  sx: { 
                    mb: 1,
                    '& .MuiInput-input': {
                      fontSize: '0.8rem'
                    }
                  },
                  InputLabelProps: {
                    sx: {
                      fontSize: '0.8rem',
                      "&.MuiInputLabel-shrink": { display: "none" }
                    },
                  }
                },
              }}
            />
            <DatePicker 
              label="End Date"
              value={filters.endDate ? dayjs(filters.endDate) : null}
              onChange={(newValue) => handleDateChange(newValue, false)}
              slotProps={{ 
                textField: { 
                  variant: 'standard', 
                  size: 'small', 
                  fullWidth: true, 
                  sx: { 
                    mb: 1,
                    '& .MuiInput-input': {
                      fontSize: '0.8rem'
                    }
                  }, 
                  InputLabelProps: {
                    sx: {
                      fontSize: '0.8rem',
                      "&.MuiInputLabel-shrink": { display: "none" }
                    },
                  } } 
              }}
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
      width: 200,
      type: "number",
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 'bold' }}>{params.colDef.headerName}</Box>
            <button onClick={() => handleSortModelChange(params.field)} className="p-1 hover:bg-slate-200 rounded">
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </button>
          </Box>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '22px' }}>
            <ToggleButtonGroup
              color="primary"
              value={filters.type}
              exclusive
              onChange={(event: React.MouseEvent<HTMLElement>, value: any) => {
                setFilters((prev) => ({ ...prev, type: value }));
                handleFilterChange(event as any);
               }}
              aria-label="Platform"
            >
              <ToggleButton value="Expense" style={{ fontSize: 'unset', fontWeight: '500', padding: '2px' }}>Expenses</ToggleButton>
              <ToggleButton value="Income">Incomes</ToggleButton>
            </ToggleButtonGroup>
          </Box> */}
          <TextField
            name="amount"
            value={filters.amount}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
          />
        </Box>
      ),
      renderCell: (params: any) => {
        const sign = params.row.type === "Income" ? "+" : "-";
        const textColorClass =
          params.row.type === "Income" ? "text-green-600" : "text-red-600";
        return (
          <span className={`font-medium ${textColorClass}`}>
            <input type="hidden" value={params.row.type} name="type"></input>
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
      width: 85,
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
            onClick={() => handleEdit(params.id as string, params.row.type)}
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
          rows={transactions ?? []}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.transactionId}
          rowCount={totalTransactions ?? 0}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(newPaginationModel) => {
            handlePageChange(newPaginationModel);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          pagination
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          sortModel={sortModel.sortByColumn ? [{ field: sortModel.sortByColumn, sort: sortModel.sortByOrder as 'asc' | 'desc' }] : []}
          disableColumnMenu
          disableSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
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

export default TransactionTable;