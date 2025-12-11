import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Trash2, Edit2, ArrowDown, ArrowUp } from "lucide-react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
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
    <Box className="datagrid-norows-wrapper">
      <Typography className="datagrid-norows-text">
        No transactions found
      </Typography>
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
        <Box className="customedatagrid-header-wrapper">
          <Box className="customedatagrid-header-common">
            <Box className="customedatagrid-header-common-label">
              {params.colDef.headerName}
            </Box>

            <button
              onClick={() => handleSortModelChange(params.field)}
              className="customedatagrid-header-common-sort-btn"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === "asc" ? (
                <ArrowUp size={14} className="customedatagrid-header-common-sort-icon" />
              ) : (
                <ArrowDown size={14} className="customedatagrid-header-common-sort-icon" />
              )}
            </button>
          </Box>
          <TextField
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
            className="customedatagrid-title-filter"
          />
        </Box>
      ),
      renderCell: (params: any) => (
        <div className="customedatagrid-title-cell">
          {params.row.title}
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      sortable: false,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box className="customedatagrid-description-header">
          <Box className="customedatagrid-description-header-top">
            <Box className="customedatagrid-description-label">
              {params.colDef.headerName}
            </Box>
    
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="customedatagrid-description-sort-button"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === "asc"
                ? <ArrowUp size={14} className="customedatagrid-description-sort-icon" />
                : <ArrowDown size={14} className="customedatagrid-description-sort-icon" />
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
            className="customedatagrid-description-filter"
          />
        </Box>
      ),
      renderCell: (params: any) => (
        <div className="customedatagrid-description-cell">{params.row.description}</div>
      ),
    },    
    {
      field: "categoryName",
      headerName: "Category",
      width: 140,
      sortable: false,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box className="customedatagrid-category-header">
          <Box className="customedatagrid-category-header-top">
            <Box className="customedatagrid-category-label">
              {params.colDef.headerName}
            </Box>
    
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="customedatagrid-category-sort-button"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === "asc" ? (
                <ArrowUp size={14} className="customedatagrid-category-sort-icon" />
              ) : (
                <ArrowDown size={14} className="customedatagrid-category-sort-icon" />
              )}
            </button>
          </Box>
          <TextField
            name="categoryName"
            value={filters.categoryName}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
            className="customedatagrid-category-filter"
          />
        </Box>
      ),
      renderCell: (params: any) => (
        <span className="customedatagrid-category-cell">{params.value}</span>
      ),
    },    
    {
      field: "transactionDate",
      headerName: "Date",
      width: 300,
      sortable: false,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box className="customedatagrid-date-header">
    
          <Box className="customedatagrid-date-header-top">
            <Box className="customedatagrid-date-label">
              {params.colDef.headerName}
            </Box>
    
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="customedatagrid-date-sort-button"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === "asc" ? (
                <ArrowUp size={14} className="customedatagrid-date-sort-icon" />
              ) : (
                <ArrowDown size={14} className="customedatagrid-date-sort-icon" />
              )}
            </button>
          </Box>
    
          <Box className="customedatagrid-date-filter-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={filters.startDate ? dayjs(filters.startDate) : null}
                onChange={(newValue) => handleDateChange(newValue, true)}
                slotProps={{
                  textField: {
                    variant: "standard",
                    size: "small",
                    fullWidth: true,
                    className: "customedatagrid-date-filter",
                    InputLabelProps: {
                      className: "customedatagrid-date-filter-label",
                    }
                  }
                }}
              />
              <DatePicker
                label="End Date"
                value={filters.endDate ? dayjs(filters.endDate) : null}
                onChange={(newValue) => handleDateChange(newValue, false)}
                slotProps={{
                  textField: {
                    variant: "standard",
                    size: "small",
                    fullWidth: true,
                    className: "customedatagrid-date-filter",
                    InputLabelProps: {
                      className: "customedatagrid-date-filter-label",
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      ),
    
      valueGetter: (params) => new Date(params.value),
      valueFormatter: (params) =>
        params.value instanceof Date
          ? params.value.toLocaleDateString("en-GB")
          : new Date(params.value).toLocaleDateString("en-GB"),
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
        <Box className="customedatagrid-amount-header">
          <Box className="customedatagrid-amount-header-top">
            <Box className="customedatagrid-amount-label">
              {params.colDef.headerName}
            </Box>
            <button
              onClick={() => handleSortModelChange(params.field)}
              className="customedatagrid-amount-sort-button"
            >
              {sortModel.sortByColumn === params.field && sortModel.sortByOrder === 'asc'
                ? <ArrowUp size={14} className="customedatagrid-amount-sort-icon" />
                : <ArrowDown size={14} className="customedatagrid-amount-sort-icon" />}
            </button>
          </Box>
          <TextField
            name="amount"
            value={filters.amount}
            onChange={handleFilterChange}
            variant="standard"
            fullWidth
            size="small"
            className="customedatagrid-amount-filter"
          />
        </Box>
      ),
      renderCell: (params: any) => {
        const sign = params.row.type === "Income" ? "+" : "-";
        const textColorClass =
          params.row.type === "Income"
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400";
    
        return (
          <span className={`font-medium ${textColorClass} customedatagrid-amount-cell`}>
            <input type="hidden" name="type" value={params.row.type} />
            {typeof params.value === "number"
              ? `${sign}${params.value.toFixed(2)}`
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
      align: "right",
      renderHeader: (params: GridColumnHeaderParams) => (
        <Box className="customedatagrid-actions-header">
          <Box className="customedatagrid-actions-label">
            {params.colDef.headerName}
          </Box>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<any>) => (
        <div className="customedatagrid-actions-cell">
          <button
            onClick={() => handleEdit(params.id as string, params.row.type)}
            className="customedatagrid-actions-edit-btn"
            aria-label={`edit-${params.id}`}
          >
            <Edit2 className="customedatagrid-actions-icon" />
          </button>
          <button
            onClick={() => handleDelete(params.id as string)}
            className="customedatagrid-actions-delete-btn"
            aria-label={`delete-${params.id}`}
          >
            <Trash2 className="customedatagrid-actions-icon" />
          </button>
        </div>
      ),
    }    
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <div style={{ height: '70vh', width: "100%" }}>
        <DataGrid
          className="customDataGrid"
          rows={transactions ?? []}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.transactionId}
          rowCount={totalTransactions ?? 0}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(newPaginationModel) => handlePageChange(newPaginationModel)}
          pageSizeOptions={[10, 25, 50, 100]}
          pagination
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          sortModel={sortModel.sortByColumn ? [{ field: sortModel.sortByColumn, sort: sortModel.sortByOrder as 'asc' | 'desc' }] : []}
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        />
      </div>
    </div>
  );
});

export default TransactionTable;