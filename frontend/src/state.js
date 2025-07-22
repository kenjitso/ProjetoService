export const state = {
    products: [],
    ordersTerceiros: [],
    nfe: [],
    selectedStockItems: new Set(),
    reportQuantities: new Map(),
    stockState: {
        statusFilter: 'todos',
        currentPage: 1,
        itemsPerPage: 15,
        sortColumn: 'descricao',
        sortDirection: 'asc'
    },
    ordersTableState: {
        searchTerm: '',
        sortColumn: 'descricao',
        sortDirection: 'asc',
        selectedType: 'terceiros',
        statusFilters: new Set()
    },
    nfeTableState: {
        searchTerm: '',
        sortColumn: 'numero_da_nota',
        sortDirection: 'asc',
        currentStoreFilter: 'todos'
    }
};