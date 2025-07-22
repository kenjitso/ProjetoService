import { formatMoney, formatCnpjCpf, getBusinessDaysDifference, addBusinessDays } from './utils.js';
import { state } from './state.js';

/**
 * Renderiza a lista de produtos.
 */
export function renderProductList(products, container, onItemClick) {
    container.innerHTML = '';
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-center p-4 text-gray-500">Nenhum produto encontrado.</p>';
        return;
    }
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-item p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors';
        div.innerHTML = `
            <div class="text-xs text-gray-500">${product.codigo || 'Sem código'}</div>
            <div class="font-medium text-gray-800">${product.descricao || 'Sem descrição'}</div>
        `;
        div.onclick = () => onItemClick(product.id);
        container.appendChild(div);
    });
}

/**
 * Renderiza detalhes de um produto selecionado.
 */
export function renderProductDetails(product, container) {
    if (!product) {
        container.innerHTML = '<p class="text-gray-400">Selecione um produto</p>';
        return;
    }
    let html = `
        <h1 class="text-3xl font-bold text-gray-800 mb-2">${product.descricao}</h1>
        <p class="text-md text-gray-500 mb-6">Código: ${product.codigo}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-gray-500">Preço</p>
                <p class="text-lg text-gray-800">${formatMoney(product.preco || 0)}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-gray-500">Estoque</p>
                <p class="text-lg text-gray-800">${product.estoque ?? 0}</p>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

/**
 * Renderiza uma mensagem modal genérica.
 */
export function showMessageModal(title, message) {
    const modal = document.getElementById('message-modal');
    document.getElementById('message-modal-title').textContent = title;
    document.getElementById('message-modal-content').textContent = message;
    modal.classList.remove('hidden');
    document.getElementById('message-modal-ok-btn').onclick = () => modal.classList.add('hidden');
    document.getElementById('close-message-modal-btn').onclick = () => modal.classList.add('hidden');
}

/**
 * Renderiza uma tabela de estoque.
 */
export function renderStockTable(products, container) {
    let html = `
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3">Produto</th>
                <th class="px-6 py-3">Estoque</th>
                <th class="px-6 py-3">Mín/Máx</th>
            </tr>
        </thead>
        <tbody>`;
    products.forEach(p => {
        html += `
        <tr>
            <td class="px-6 py-4">${p.descricao}</td>
            <td class="px-6 py-4">${p.estoque ?? 0}</td>
            <td class="px-6 py-4">${p.estoque_minimo ?? '-'} / ${p.estoque_maximo ?? '-'}</td>
        </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

/**
 * Renderiza uma lista de requisições (exemplo simplificado).
 */
export function renderOrdersList(orders, container) {
    let html = `<ul class="divide-y divide-gray-200">`;
    orders.forEach(order => {
        html += `
        <li class="p-4 flex flex-col">
            <span><b>Requisição:</b> ${order.orderCode}</span>
            <span><b>Situação:</b> ${order.situacao}</span>
            <span><b>Data Pedido:</b> ${order.dataPedido}</span>
        </li>`;
    });
    html += `</ul>`;
    container.innerHTML = html;
}

/**
 * Renderiza cards de NFe (simplificado).
 */
export function renderNFeCards(nfes, container) {
    container.innerHTML = '';
    nfes.forEach(nfe => {
        const div = document.createElement('div');
        div.className = 'bg-white rounded shadow p-4 mb-2';
        div.innerHTML = `
            <div><b>Nota:</b> ${nfe.numero_da_nota}</div>
            <div><b>Cliente:</b> ${nfe.nome_do_cliente}</div>
            <div><b>Valor:</b> ${formatMoney(nfe.valor_da_nota)}</div>
        `;
        container.appendChild(div);
    });
}