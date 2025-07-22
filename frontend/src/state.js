// src/state.js

// Estado dos produtos
export const state = {
    products: [],               // Lista de produtos carregados da API
    ordersTerceiros: [],        // Pedidos de terceiros
    ordersFabrica: [],          // (caso implemente no futuro)
    nfe: [],                    // Notas fiscais eletrônicas

    // Conjunto de IDs dos produtos selecionados para relatório ou outra ação
    selectedStockItems: new Set(),

    // Mapa de quantidades para cada produto selecionado no relatório
    reportQuantities: new Map(),

    // Estado da tela de estoque
    stockState: {
        statusFilter: 'todos',      // Filtro de status do estoque
        currentPage: 1,             // Página atual na tabela de estoque
        itemsPerPage: 15,           // Itens por página
        sortColumn: 'descricao',    // Coluna de ordenação
        sortDirection: 'asc'        // Direção da ordenação
    },

    // Estado da tabela de requisições
    ordersTableState: {
        searchTerm: '',                 // Termo de busca
        sortColumn: 'descricao',        // Coluna de ordenação
        sortDirection: 'asc',           // Direção da ordenação
        selectedType: 'terceiros',      // Tipo selecionado (terceiros/fabrica)
        statusFilters: new Set()        // Filtros de status aplicados
    },

    // Estado da tabela de NFe
    nfeTableState: {
        searchTerm: '',                 // Termo de busca
        sortColumn: 'numero_da_nota',   // Coluna de ordenação
        sortDirection: 'asc',           // Direção da ordenação
        currentStoreFilter: 'todos'     // Filtro de loja
    }
};