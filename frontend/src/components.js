// =====================
// COMPONENTS.JS
// =====================
// Todas as funções de renderização de UI, cards, tabelas, listas, modais, tooltips, status, contadores, etc.
// Você pode dividir esse arquivo em mais arquivos no futuro se ficar muito grande, mas aqui está o essencial para adaptar seu código antigo.

import {
    formatCurrency,
    formatDate,
    formatCnpjCpf,
    paginate,
    sortBy,
    filterProducts,
    filterByTerm,
    showTooltip,
    hideTooltip,
    processRawOrdersData,
    exportToPDF,
    addBusinessDays,
    getBusinessDaysDifference,
    uniqueId,
} from './utils.js';

// =====================
// HELPERS DE HTML
// =====================
export function createStatusCard(status, title, count, color, active = false) {
    return `<div data-status="${status}" class="status-card ${color} text-white p-3 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105${active ? ' active' : ''}">
        <h3 class="text-sm font-semibold">${title}</h3>
        <p class="text-2xl font-bold mt-2">${count}</p>
    </div>`;
}

export function createStatusPill(status) {
    const styles = { ok: 'bg-green-100 text-green-800', baixo: 'bg-yellow-100 text-yellow-800', excesso: 'bg-red-100 text-red-800', indefinido: 'bg-gray-100 text-gray-800' };
    const text = { ok: 'OK', baixo: 'Baixo', excesso: 'Excesso', indefinido: 'N/A' };
    return `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}">${text[status]}</span>`;
}

export function createRequisitionCard(id, title, count, color, active = false) {
    return `<div data-id="${id}" class="status-card ${color} text-white p-3 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105${active ? ' active' : ''}">
        <h3 class="text-sm font-semibold">${title}</h3>
        <p class="text-2xl font-bold mt-2">${count}</p>
    </div>`;
}

export function createNFeCard(id, title, count, color, active = false) {
    return `<div data-id="${id}" class="status-card ${color} text-white p-3 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105${active ? ' active' : ''}">
        <h3 class="text-sm font-semibold">${title}</h3>
        <p class="text-2xl font-bold mt-2">${count}</p>
    </div>`;
}

export function createDetailItem(label, value) {
    if (!value && typeof value !== 'boolean' && value !== 0) return '';
    return `<div class="bg-gray-50 p-3 rounded-lg"><p class="text-sm font-medium text-gray-500">${label}</p><p class="text-lg text-gray-800">${value}</p></div>`;
}

// =====================
// LISTAS E DETALHES DE PRODUTOS
// =====================
export function renderProductList(products, container, callback) {
    container.innerHTML = '';
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-center p-4 text-gray-500">Nenhum produto encontrado.</p>';
        return;
    }
    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors';
        item.dataset.productId = product.id;
        item.innerHTML = `<div class="text-xs text-gray-500">${product.codigo || 'Sem código'}</div>
        <div class="font-medium text-gray-800">${product.descricao || 'Sem descrição'}</div>`;
        item.onclick = () => callback(product.id, item);
        container.appendChild(item);
    });
}

export function renderProductDetails(product, container) {
    if (!product) {
        container.innerHTML = '<p class="text-gray-400">Selecione um produto</p>';
        return;
    }
    let html = `<h1 class="text-3xl font-bold text-gray-800 mb-2">${product.descricao}</h1>
        <p class="text-md text-gray-500 mb-6">Código: ${product.codigo}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">`;
    html += createDetailItem('Preço', formatCurrency(product.preco));
    html += createDetailItem('Estoque', product.estoque || '0');
    html += createDetailItem('Situação', product.situacao ? '<span class="text-green-600 font-semibold">Ativo</span>' : '<span class="text-red-600 font-semibold">Inativo</span>');
    html += createDetailItem('Marca', product.marca);
    html += createDetailItem('Localização', product.localizacao);
    html += '</div>';
    if (product.metricas && Object.values(product.metricas).some(v => v !== null)) {
        html += '<h2 class="text-xl font-semibold border-b pb-2 mb-4">Métricas</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">';
        html += createDetailItem('Largura', product.metricas.largura);
        html += createDetailItem('Altura', product.metricas.altura);
        html += createDetailItem('Profundidade', product.metricas.profundidade);
        html += createDetailItem('Peso Bruto', product.metricas.peso_bruto);
        html += createDetailItem('Peso Líquido', product.metricas.peso_liquido);
        html += '</div>';
    }
    if (product.url_imagens_externas && product.url_imagens_externas.length > 0 && product.url_imagens_externas[0]) {
        html += '<h2 class="text-xl font-semibold border-b pb-2 mb-4">Imagens</h2><div class="flex flex-wrap gap-4 mb-6">';
        product.url_imagens_externas.forEach(url => {
            html += `<img src="${url}" onerror="this.onerror=null;this.src='https://placehold.co/128x128/e0e0e0/555555?text=Sem+Imagem';" alt="Imagem do produto" class="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm">`;
        });
        html += '</div>';
    }
    if (product.descricao_complementar) {
        html += `<h2 class="text-xl font-semibold border-b pb-2 mb-4">Descrição Complementar</h2><div class="prose max-w-none bg-white p-4 rounded-lg border">${product.descricao_complementar}</div>`;
    }
    container.innerHTML = html;
}

// =====================
// TABELAS E RELATÓRIOS (renderização genérica, adapte para cada tabela específica)
// =====================
export function renderTable(headers, rows, container, options = {}) {
    // headers: array de {label, key}
    let html = `<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr>`;
    headers.forEach(header => {
        html += `<th class="px-6 py-3">${header.label}</th>`;
    });
    html += `</tr></thead><tbody class="bg-white divide-y divide-gray-200">`;
    rows.forEach(row => {
        html += "<tr>";
        headers.forEach(header => {
            let value = row[header.key];
            if (header.format === 'currency') value = formatCurrency(value);
            else if (header.format === 'date') value = formatDate(value);
            else if (header.format === 'cnpjcpf') value = formatCnpjCpf(value);
            html += `<td class="px-6 py-4">${value ?? ""}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

// =====================
// MODAIS (abrir, fechar, preencher, atualizar)
// =====================
export function showMessageModal(title, message) {
    const modal = document.getElementById('message-modal');
    document.getElementById('message-modal-title').textContent = title;
    document.getElementById('message-modal-content').textContent = message;
    modal.classList.remove('hidden');
    document.getElementById('message-modal-ok-btn').onclick = () => modal.classList.add('hidden');
    document.getElementById('close-message-modal-btn').onclick = () => modal.classList.add('hidden');
}

export function showConfirmationModal(title, message, onConfirm, onCancel) {
    const modal = document.getElementById('confirmation-modal');
    document.getElementById('confirmation-modal-title').textContent = title;
    document.getElementById('confirmation-modal-content').textContent = message;
    modal.classList.remove('hidden');
    const yes = document.getElementById('confirm-yes-btn');
    const no = document.getElementById('confirm-no-btn');
    yes.onclick = () => { modal.classList.add('hidden'); onConfirm && onConfirm(); };
    no.onclick = () => { modal.classList.add('hidden'); onCancel && onCancel(); };
}

export function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}
export function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}
// Exemplo: showModal('order-details-modal');

// =====================
// TOOLTIP CUSTOMIZADO
// =====================
export function setupCustomTooltip() {
    let tooltip = document.getElementById('custom-product-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'custom-product-tooltip';
        tooltip.className = 'fixed hidden bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-50 max-w-sm';
        tooltip.style.pointerEvents = 'auto';
        tooltip.style.transition = 'opacity 0.2s ease-in-out';
        tooltip.style.opacity = '0';
        document.body.appendChild(tooltip);
    }
    return tooltip;
}
export function showProductTooltip(event, fullDescription, imageUrl) {
    // Usa o utilitário showTooltip para posicionamento e animação
    const tooltip = setupCustomTooltip();
    let tooltipContent = `<p class="text-sm text-gray-800 mb-2">${fullDescription}</p>`;
    if (imageUrl && imageUrl !== 'N/A') {
        tooltipContent += `<img src="${imageUrl}" onerror="this.onerror=null;this.src='https://placehold.co/128x128/e0e0e0/555555?text=Sem+Imagem';" alt="Imagem do Produto" class="w-32 h-32 object-cover rounded-md mx-auto mt-2">`;
    } else {
        tooltipContent += `<img src="https://placehold.co/128x128/e0e0e0/555555?text=Sem+Imagem" alt="Sem Imagem" class="w-32 h-32 object-cover rounded-md mx-auto mt-2">`;
    }
    showTooltip(tooltip, tooltipContent, event);
}
export function hideProductTooltip() {
    const tooltip = document.getElementById('custom-product-tooltip');
    if (tooltip) hideTooltip(tooltip);
}

// =====================
// CONTADORES, BADGES, ICONES
// =====================
export function updateSelectedCountDisplay(count) {
    const display = document.getElementById('selected-items-count');
    if (display) display.textContent = `Itens selecionados: ${count}`;
}
export function setGenerateReportButtonState(enabled) {
    const btn = document.getElementById('generate-report-button');
    if (btn) btn.disabled = !enabled;
}
export function updateFilterButtonLabel(count) {
    const lbl = document.getElementById('global-filter-button-label');
    if (lbl) lbl.textContent = `Filtro (${count})`;
}

// =====================
// EXEMPLOS DE USO DE COMPONENTES NAS TELAS
// =====================
// Use essas funções nos seus listeners do main.js conforme o contexto/tela desejado.
// Por exemplo, para renderizar o estoque:
// renderStockPage(produtos, stockState, selectedStockItems, document.getElementById('page-gerenciar-estoque'));
// Para mostrar um modal de mensagem:
// showMessageModal('Título', 'Mensagem do modal');
// Para mostrar tooltip:
// cell.addEventListener('mouseenter', (e) => showProductTooltip(e, descricao, imageUrl));
// cell.addEventListener('mouseleave', hideProductTooltip);
