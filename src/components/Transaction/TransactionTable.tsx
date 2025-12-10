import React, { forwardRef, useImperativeHandle, useState } from "react";
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
import { TextField, Box, Typography } from "@mui/material";
import { useTransactions } from "../../hooks/useTransactions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { exportCSVApi } from "../../dataAccess/transactionDAL";

function CustomNoRowsOverlay() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: 'var(--datagrid-text)'
    }}>
      <Typography sx={{ color: 'var(--datagrid-text)' }}>No transactions found</Typography>
    </Box>
  );
}

export interface TransactionTableHandle {
  exportCSV: () => Promise<void>;
}

const TransactionTable = forwardRef<TransactionTableHandle, {}>((props, ref) => {

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

  const exportCSV = async () => {
    const payload = {
      PageNumber: 1,
      PageSize: 9999999,
      Type: filters.type,
      StartDate: filters.startDate,
      EndDate: filters.endDate,
      SortbyColumn: sortModel.sortByColumn,
      SortbyOrder: sortModel.sortByOrder,
      Filters: { ...filters }
    };

    try {
      const res = await exportCSVApi(payload);

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Transactions.csv";
      link.click();

      window.URL.revokeObjectURL(url);

      toast.success("CSV Exported Successfully");

    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV");
    }
  };

  useImperativeHandle(ref, () => ({
    exportCSV
  }));

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

    let payload: TransactionFilterPayload = {
      PageNumber: page + 1,
      PageSize: pageSize,
      Type: "",
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

    let payload: TransactionFilterPayload = {
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
      Type: "",
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
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded absolute right-0"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ?
                <ArrowUp size={14} className="text-gray-700 dark:text-gray-300" /> :
                <ArrowDown size={14} className="text-gray-700 dark:text-gray-300" />
              }
            </button>
          </Box>
          <TextField
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
            sx={{
              '& .MuiInput-input': {
                color: 'var(--datagrid-text)',
              },
              '& .MuiInput-root:before': {
                borderBottomColor: 'var(--datagrid-border)',
              },
              '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                borderBottomColor: 'var(--datagrid-text-muted)',
              },
            }}
          />
        </Box>
      ),
      renderCell: (params: any) => (
        <div className="font-medium text-gray-900 dark:text-gray-100 leading-tight">{params.row.title}</div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      sortable: false,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box sx={{ width: '100%', my: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 'bold' }}>{params.colDef.headerName}</Box>
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded absolute right-0"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ?
                <ArrowUp size={14} className="text-gray-700 dark:text-gray-300" /> :
                <ArrowDown size={14} className="text-gray-700 dark:text-gray-300" />
              }
            </button>
          </Box>
          <TextField
            name="description"
            value={filters.description}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
            sx={{
              '& .MuiInput-input': {
                color: 'var(--datagrid-text)',
              },
              '& .MuiInput-root:before': {
                borderBottomColor: 'var(--datagrid-border)',
              },
              '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                borderBottomColor: 'var(--datagrid-text-muted)',
              },
            }}
          />
        </Box>
      ),
      renderCell: (params: any) => (
        <div className="font-medium text-gray-900 dark:text-gray-100 leading-tight">{params.row.description}</div>
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
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded absolute right-0"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ?
                <ArrowUp size={14} className="text-gray-700 dark:text-gray-300" /> :
                <ArrowDown size={14} className="text-gray-700 dark:text-gray-300" />
              }
            </button>
          </Box>
          <TextField
            name="categoryName"
            value={filters.categoryName}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
            sx={{
              '& .MuiInput-input': {
                color: 'var(--datagrid-text)',
              },
              '& .MuiInput-root:before': {
                borderBottomColor: 'var(--datagrid-border)',
              },
              '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                borderBottomColor: 'var(--datagrid-text-muted)',
              },
            }}
          />
        </Box>
      ),
      renderCell: (params: any) => (
        <span className="px-3 py-1 text-xs rounded-full text-gray-900 dark:text-gray-100">
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
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded absolute right-0"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ?
                <ArrowUp size={14} className="text-gray-700 dark:text-gray-300" /> :
                <ArrowDown size={14} className="text-gray-700 dark:text-gray-300" />
              }
            </button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={filters.startDate ? dayjs(filters.startDate) : null}
                onChange={(newValue) => { handleDateChange(newValue, true) }}
                slotProps={{
                  textField: {
                    variant: 'standard',
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      mb: 1,

                      /* FIX: Date text color */
                      "& .MuiInputBase-input": {
                        fontSize: "0.8rem",
                        color: "var(--datagrid-text) !important",
                      },

                      /* FIX: Underline color */
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "var(--datagrid-border) !important",
                      },
                      "& .MuiInput-underline:hover:before": {
                        borderBottomColor: "var(--datagrid-text-muted) !important",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "var(--datagrid-text-muted) !important",
                      },

                      /* FIX: Calendar icon color */
                      "& .MuiSvgIcon-root": {
                        color: "var(--datagrid-text-muted) !important",
                      },

                      /* FIX: Input wrapper color in dark mode */
                      "& .MuiInputBase-root": {
                        color: "var(--datagrid-text) !important",
                      },
                    },
                    InputLabelProps: {
                      sx: {
                        fontSize: '0.8rem',
                        color: 'var(--datagrid-text-muted)',
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

                      /* FIX: Date text color */
                      "& .MuiInputBase-input": {
                        fontSize: "0.8rem",
                        color: "var(--datagrid-text) !important",
                      },

                      /* FIX: Underline color */
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "var(--datagrid-border) !important",
                      },
                      "& .MuiInput-underline:hover:before": {
                        borderBottomColor: "var(--datagrid-text-muted) !important",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "var(--datagrid-text-muted) !important",
                      },

                      /* FIX: Calendar icon color */
                      "& .MuiSvgIcon-root": {
                        color: "var(--datagrid-text-muted) !important",
                      },

                      /* FIX: Input wrapper color in dark mode */
                      "& .MuiInputBase-root": {
                        color: "var(--datagrid-text) !important",
                      },
                    },
                    InputLabelProps: {
                      sx: {
                        fontSize: '0.8rem',
                        color: 'var(--datagrid-text-muted)',
                        "&.MuiInputLabel-shrink": { display: "none" }
                      },
                    }
                  },
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
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc' ?
                <ArrowUp size={14} className="text-gray-700 dark:text-gray-300" /> :
                <ArrowDown size={14} className="text-gray-700 dark:text-gray-300" />
              }
            </button>
          </Box>
          <TextField
            name="amount"
            value={filters.amount}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
            sx={{
              '& .MuiInput-input': {
                color: 'var(--datagrid-text)',
              },
              '& .MuiInput-root:before': {
                borderBottomColor: 'var(--datagrid-border)',
              },
              '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                borderBottomColor: 'var(--datagrid-text-muted)',
              },
            }}
          />
        </Box>
      ),
      renderCell: (params: any) => {
        const sign = params.row.type === "Income" ? "+" : "-";
        const textColorClass =
          params.row.type === "Income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
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
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-1.5 rounded-md transition-colors"
            aria-label={`edit-${params.id}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(params.id as string)}
            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 p-1.5 rounded-md transition-colors"
            aria-label={`delete-${params.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
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
            backgroundColor: 'var(--datagrid-bg)',
            color: 'var(--datagrid-text)',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--datagrid-header-bg)',
              borderBottom: '1px solid var(--datagrid-border)',
              color: 'var(--datagrid-text-muted)',
              fontSize: '0.8rem',
              fontWeight: 300,
              minHeight: '100px !important',
              '.MuiDataGrid-columnHeaderTitleContainer': {
                paddingLeft: '5px',
                justifyContent: 'flex-start',
              },
              '.MuiDataGrid-columnHeaderTitle': {
                color: 'var(--datagrid-text-muted)',
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
              borderBottom: '1px solid var(--datagrid-border)',
              color: 'var(--datagrid-text) !important',
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
              color: 'var(--datagrid-text)',
              '&:hover': {
                backgroundColor: 'var(--datagrid-hover)',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid var(--datagrid-border)',
              backgroundColor: 'var(--datagrid-header-bg)',
              color: 'var(--datagrid-text-muted)',
            },
            '& .MuiDataGrid-columnHeader--alignRight .MuiDataGrid-columnHeaderTitleContainer': {
              justifyContent: 'flex-end',
              paddingRight: '16px',
            },
            '& .MuiDataGrid-cell--textRight': {
              justifyContent: 'flex-end',
              paddingRight: '16px',
            },
            '& .MuiTablePagination-root': {
              color: 'var(--datagrid-text-muted)',
            },
            '& .MuiTablePagination-displayedRows': {
              color: 'var(--datagrid-text-muted)',
            },
            '& .MuiTablePagination-selectLabel': {
              color: 'var(--datagrid-text-muted)',
            },
            '& .MuiSelect-select': {
              color: 'var(--datagrid-text-muted)',
            },
            '& .MuiIconButton-root': {
              color: 'var(--datagrid-text-muted)',
            },
            '& .MuiDataGrid-selectedRowCount': {
              color: 'var(--datagrid-text-muted)',
            },
          }}
        />
      </div>
    </div>
  );
});

export default TransactionTable;