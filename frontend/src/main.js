import { fetchProducts, fetchOrdersTerceiros, fetchNFe } from './api.js';
import { state } from './state.js';
import * as components from './components.js';

// --- Função auxiliar para mostrar/esconder páginas ---
function showPage(pageId) {
    document.querySelectorAll('main').forEach(el => el.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    // Atualiza nav-links ativos
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    if (pageId === 'page-pesquisar-produto') document.getElementById('nav-pesquisar').classList.add('active');
    if (pageId === 'page-gerenciar-estoque') document.getElementById('nav-estoque').classList.add('active');
    if (pageId === 'page-overview-requisitions') document.getElementById('nav-requisicoes').classList.add('active');
    if (pageId === 'page-conferencia-nfe') document.getElementById('nav-conferencia-nfe').classList.add('active');
}

document.addEventListener('DOMContentLoaded', async () => {
    // --- Carregar dados iniciais ---
    try {
        state.products = await fetchProducts();
        state.ordersTerceiros = await fetchOrdersTerceiros();
        state.nfe = await fetchNFe();
    } catch (err) {
        components.showMessageModal('Erro', 'Falha ao carregar os dados iniciais: ' + err.message);
        return;
    }

    // --- Inicializa tooltips (apenas uma vez) ---
    components.setupCustomTooltip();

    // --- Navegação principal ---
    document.getElementById('nav-pesquisar').onclick = (e) => {
        e.preventDefault();
        showPage('page-pesquisar-produto');
        components.renderProductList(
            state.products,
            document.getElementById('product-list-container'),
            (id, el) => {
                const prod = state.products.find(p => p.id === id);
                components.renderProductDetails(prod, document.getElementById('product-details'));
                document.querySelectorAll('.product-item').forEach(i => i.classList.remove('active'));
                el.classList.add('active');
            }
        );
        // Limpar detalhes ao entrar na tela
        document.getElementById('details-placeholder').classList.remove('hidden');
        document.getElementById('product-details').classList.add('hidden');
    };

    document.getElementById('nav-estoque').onclick = (e) => {
        e.preventDefault();
        showPage('page-gerenciar-estoque');
        components.renderStockPage(
            state.products,
            state.stockState,
            state.selectedStockItems,
            document.getElementById('page-gerenciar-estoque')
        );
    };

    document.getElementById('nav-requisicoes').onclick = (e) => {
        e.preventDefault();
        showPage('page-overview-requisitions');
        // Exemplo: pode renderizar cards de requisições, tabela, etc.
        // components.renderRequisitionOverviewPage(...);
    };

    document.getElementById('nav-conferencia-nfe').onclick = (e) => {
        e.preventDefault();
        showPage('page-conferencia-nfe');
        // Exemplo: pode renderizar cards de NFe, etc.
        // components.renderNFeOverviewPage(...);
    };

    // --- Buscas e filtros globais ---
    document.getElementById('global-search-input').oninput = (e) => {
        // Exemplo: filtrar produtos e atualizar lista
        const term = e.target.value.toLowerCase();
        const filtered = state.products.filter(p =>
            (p.codigo && p.codigo.toLowerCase().includes(term)) ||
            (p.descricao && p.descricao.toLowerCase().includes(term))
        );
        if (!document.getElementById('page-pesquisar-produto').classList.contains('hidden')) {
            components.renderProductList(filtered, document.getElementById('product-list-container'), (id, el) => {
                const prod = filtered.find(p => p.id === id);
                components.renderProductDetails(prod, document.getElementById('product-details'));
                document.querySelectorAll('.product-item').forEach(i => i.classList.remove('active'));
                el.classList.add('active');
            });
        }
        // Adapte para estoque, etc.
    };

    // --- Exemplo: botão gerar relatório ---
    document.getElementById('generate-report-button').onclick = () => {
        if (state.selectedStockItems.size === 0) {
            components.showMessageModal('Atenção', 'Selecione itens para gerar relatório.');
            return;
        }
        // Chame sua função de relatório aqui (exemplo):
        // components.renderReport(state.selectedStockItems, ...);
    };

    // --- Modais genéricos: fechar ao clicar no fundo ---
    document.querySelectorAll('.fixed.inset-0').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

    // --- Tooltips para produtos (exemplo, adapte para sua tabela/lista) ---
    document.body.addEventListener('mouseenter', function (e) {
        if (e.target.classList.contains('product-description-cell')) {
            components.showProductTooltip(
                e,
                e.target.dataset.fullDescription,
                e.target.dataset.imageUrl
            );
        }
    }, true);
    document.body.addEventListener('mouseleave', function (e) {
        if (e.target.classList.contains('product-description-cell')) {
            components.hideProductTooltip();
        }
    }, true);

    // --- Inicialização padrão: mostrar tela de pesquisa ---
    document.getElementById('nav-pesquisar').click();
});