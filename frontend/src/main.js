import { fetchProducts, fetchOrdersTerceiros, fetchNFe } from './api.js';
import { debounce } from './utils.js';
import { state } from './state.js';
import {
    renderProductList,
    renderProductDetails,
    showMessageModal,
    renderStockTable,
    renderOrdersList,
    renderNFeCards
} from './components.js';

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const productListContainer = document.getElementById('product-list-container');
    const productDetailsContainer = document.getElementById('product-details');
    const navPesquisar = document.getElementById('nav-pesquisar');
    const navEstoque = document.getElementById('nav-estoque');
    const navRequisicoes = document.getElementById('nav-requisicoes');
    const navConferenciaNFe = document.getElementById('nav-conferencia-nfe');
    const estoqueContainer = document.getElementById('page-gerenciar-estoque');
    const ordersContainer = document.getElementById('requisition-overview-cards');
    const nfeCardsContainer = document.getElementById('nfe-overview-cards');

    // Event Handlers
    function onProductClick(productId) {
        const product = state.products.find(p => p.id === productId);
        renderProductDetails(product, productDetailsContainer);
    }

    function showPage(pageId) {
        // Esconde todas as páginas
        document.querySelectorAll('main').forEach(el => el.classList.add('hidden'));
        if (pageId === 'pesquisar') document.getElementById('page-pesquisar-produto').classList.remove('hidden');
        if (pageId === 'estoque') document.getElementById('page-gerenciar-estoque').classList.remove('hidden');
        if (pageId === 'overview-requisitions') document.getElementById('page-overview-requisitions').classList.remove('hidden');
        if (pageId === 'conferencia-nfe') document.getElementById('page-conferencia-nfe').classList.remove('hidden');
    }

    navPesquisar.addEventListener('click', () => {
        showPage('pesquisar');
        renderProductList(state.products, productListContainer, onProductClick);
    });
    navEstoque.addEventListener('click', () => {
        showPage('estoque');
        renderStockTable(state.products, estoqueContainer);
    });
    navRequisicoes.addEventListener('click', () => {
        showPage('overview-requisitions');
        renderOrdersList(state.ordersTerceiros, ordersContainer);
    });
    navConferenciaNFe.addEventListener('click', () => {
        showPage('conferencia-nfe');
        renderNFeCards(state.nfe, nfeCardsContainer);
    });

    // Load data
    try {
        state.products = await fetchProducts();
        state.ordersTerceiros = await fetchOrdersTerceiros();
        state.nfe = await fetchNFe();

        // Página inicial
        showPage('pesquisar');
        renderProductList(state.products, productListContainer, onProductClick);

    } catch (error) {
        showMessageModal('Erro', 'Falha ao carregar dados iniciais: ' + error.message);
    }
});