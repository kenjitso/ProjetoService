import { fetchProducts, fetchOrdersTerceiros, fetchNFe } from './api.js';
import { debounce } from './utils.js';
import { state } from './state.js';
import { renderProductList, showMessageModal } from './components.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Exemplo simples: buscar produtos e renderizar lista
        const productsData = await fetchProducts();
        state.products = productsData.data;
        const productListContainer = document.getElementById('product-list-container');
        renderProductList(state.products, productListContainer);

        // Aqui você pode adicionar os handlers para navegação, filtros, eventos etc.

    } catch (error) {
        showMessageModal('Erro', 'Falha ao carregar produtos.');
        console.error(error);
    }
});