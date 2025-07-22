import { formatMoney, formatCnpjCpf } from './utils.js';

// Exemplo: renderizar lista de produtos
export function renderProductList(products, container) {
    container.innerHTML = '';
    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors';
        item.innerHTML = `
            <div class="text-xs text-gray-500">${product.codigo || 'Sem código'}</div>
            <div class="font-medium text-gray-800">${product.descricao || 'Sem descrição'}</div>
        `;
        container.appendChild(item);
    });
}

// Exemplo: mostrar modal de mensagem
export function showMessageModal(title, message) {
    alert(`${title}\n\n${message}`);
}

// ...adicione aqui outras funções de renderização (componentes de tabela, modais, tooltips, etc)