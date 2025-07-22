// src/utils.js

// ========== DEBOUNCE ==========
/**
 * Cria uma função debounce (evita execuções múltiplas em sequência).
 * @param {Function} func Função original.
 * @param {number} delay Delay em ms.
 * @returns {Function}
 */
export function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// ========== FORMATAÇÃO DE MOEDA/DATA ==========
/**
 * Formata valor como moeda BRL.
 * @param {number} value 
 * @returns {string}
 */
export function formatCurrency(value) {
    if (value == null || isNaN(value)) return 'R$ 0,00';
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Formata data para dd/mm/aaaa.
 * @param {string|Date} value 
 * @returns {string}
 */
export function formatDate(value) {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('pt-BR');
}

/**
 * Formata CNPJ ou CPF.
 * @param {string|number} value
 * @returns {string}
 */
export function formatCnpjCpf(value) {
    if (!value) return 'N/A';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length === 11)
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (cleaned.length === 14)
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return value;
}

// ========== DATAS ÚTEIS ==========
/**
 * Retorna true se a data for sábado ou domingo.
 * @param {Date} date 
 * @returns {boolean}
 */
export function isWeekend(date) {
    const d = (date instanceof Date) ? date : new Date(date);
    const day = d.getDay();
    return day === 0 || day === 6;
}

/**
 * Soma dias úteis a uma data.
 * @param {Date|string} startDate 
 * @param {number} days 
 * @returns {Date}
 */
export function addBusinessDays(startDate, days) {
    const date = new Date(startDate);
    let added = 0;
    while (added < days) {
        date.setDate(date.getDate() + 1);
        if (!isWeekend(date)) added++;
    }
    return date;
}

/**
 * Diferença em dias úteis entre duas datas.
 * @param {Date|string} startDate 
 * @param {Date|string} endDate 
 * @returns {number}
 */
export function getBusinessDaysDifference(startDate, endDate) {
    let count = 0;
    let current = new Date(startDate);
    const end = new Date(endDate);
    current.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    if (current > end) return -getBusinessDaysDifference(end, current);
    while (current < end) {
        if (!isWeekend(current)) count++;
        current.setDate(current.getDate() + 1);
    }
    return count;
}

// ========== FILTROS E BUSCA ==========
/**
 * Filtra produtos por termo e categorias.
 * @param {Array} products 
 * @param {string} searchTerm 
 * @param {Array} selectedCategories 
 * @returns {Array}
 */
export function filterProducts(products, searchTerm = '', selectedCategories = []) {
    const term = (searchTerm || '').toLowerCase();
    return products.filter(product => {
        const searchMatch =
            (product.codigo && product.codigo.toLowerCase().includes(term)) ||
            (product.descricao && product.descricao.toLowerCase().includes(term));
        let categoryMatch = true;
        if (selectedCategories && selectedCategories.length > 0) {
            categoryMatch = selectedCategories.some(cat => {
                switch (cat) {
                    case 'consumo':
                        return product.grupo_de_tags_tags?.includes('Estoque - Consumo');
                    case 'fabrica':
                        return product.grupo_de_tags_tags?.includes('Estoque - Fábrica');
                    case 'terceiros':
                        return product.grupo_de_tags_tags?.includes('Estoque - Terceiros');
                    case 'demanda':
                        return product.grupo_de_tags_tags?.includes('Sob Demanda - Fábrica');
                    case 'servicos':
                        return product.codigo?.startsWith('7');
                    case 'em_branco':
                        return !product.grupo_de_tags_tags || product.grupo_de_tags_tags.length === 0 || (product.grupo_de_tags_tags.length === 1 && product.grupo_de_tags_tags[0] === '');
                    default:
                        return false;
                }
            });
        }
        return searchMatch && categoryMatch;
    });
}

/**
 * Filtro genérico para arrays por termo usando campos.
 * @param {Array} arr 
 * @param {string} term 
 * @param {Array<string>} fields
 * @returns {Array}
 */
export function filterByTerm(arr, term, fields) {
    const q = (term || '').toLowerCase();
    return arr.filter(item => fields.some(f => String(item[f] || '').toLowerCase().includes(q)));
}

// ========== ORDENAÇÃO ==========
/**
 * Ordena array por campo (string ou número).
 * @param {Array} arr 
 * @param {string} field 
 * @param {'asc'|'desc'} direction 
 * @returns {Array}
 */
export function sortBy(arr, field, direction = 'asc') {
    return [...arr].sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (typeof valA === 'number' && typeof valB === 'number') {
            return direction === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
        const cmp = valA.localeCompare(valB, 'pt-BR', { numeric: true });
        return direction === 'asc' ? cmp : -cmp;
    });
}

// ========== PAGINAÇÃO ==========
/**
 * Retorna um slice paginado do array.
 * @param {Array} arr 
 * @param {number} page 
 * @param {number} perPage 
 * @returns {Array}
 */
export function paginate(arr, page, perPage) {
    const start = (page - 1) * perPage;
    return arr.slice(start, start + perPage);
}

// ========== TOOLTIP ==========
/**
 * Mostra tooltip customizado.
 * @param {HTMLElement} tooltipDiv 
 * @param {string} html 
 * @param {MouseEvent} event 
 */
export function showTooltip(tooltipDiv, html, event) {
    tooltipDiv.innerHTML = html;
    tooltipDiv.classList.remove('hidden');
    tooltipDiv.style.opacity = '0';
    // Posição
    const offsetX = 15, offsetY = 15;
    let top = event.pageY + offsetY;
    let left = event.pageX + offsetX;
    // Ajuste se sair da tela
    setTimeout(() => {
        if (left + tooltipDiv.offsetWidth > window.innerWidth)
            left = event.pageX - tooltipDiv.offsetWidth - offsetX;
        if (top + tooltipDiv.offsetHeight > window.innerHeight)
            top = event.pageY - tooltipDiv.offsetHeight - offsetY;
        tooltipDiv.style.top = `${top}px`;
        tooltipDiv.style.left = `${left}px`;
        tooltipDiv.style.opacity = '1';
    }, 10);
}

/**
 * Esconde tooltip customizado.
 * @param {HTMLElement} tooltipDiv 
 */
export function hideTooltip(tooltipDiv) {
    tooltipDiv.style.opacity = '0';
    setTimeout(() => tooltipDiv.classList.add('hidden'), 200);
}

// ========== PROCESSAMENTO DE DADOS ==========
/**
 * Processa dados brutos de pedidos (planilha) para estrutura amigável.
 * @param {Array<Array<any>>} rawData 
 * @returns {Array<Object>}
 */
export function processRawOrdersData(rawData) {
    if (!rawData || rawData.length < 2) return [];
    const headers = rawData[0].map(h => h && typeof h === 'string' ? h.toLowerCase().trim() : '');
    const itemRows = rawData.slice(1);
    const idx = name => headers.indexOf(name);
    const requisitionCol = idx('requisição');
    const situacaoCol = idx('situação');
    const dataPedidoCol = idx('data pedido');
    const codigoServiceCol = idx('codigo service');
    const codigoMksEquipCol = idx('codigo mks-equipamentos');
    const descricaoCol = idx('descrição');
    const quantidadePedidoCol = idx('quantidade pedido');
    const localizacaoCol = idx('localização');
    const diasCorridosCol = idx('dias corridos');
    const observacaoCol = idx('observação');
    const prazoEntregaCol = idx('prazo entrega');
    if (requisitionCol === -1 || situacaoCol === -1 || dataPedidoCol === -1) return [];
    const ordersMap = new Map();
    itemRows.forEach(row => {
        const orderCode = row[requisitionCol];
        if (!orderCode) return;
        const itemStatus = (row[situacaoCol] || '').toLowerCase();
        const itemDate = row[dataPedidoCol];
        const individualItem = {
            orderCode: orderCode,
            codigoService: row[codigoServiceCol] || '',
            codigoMksEquipamentos: row[codigoMksEquipCol] || '',
            descricao: row[descricaoCol] || '',
            localizacao: row[localizacaoCol] || '',
            quantidadePedido: row[quantidadePedidoCol] || 0,
            situacao: itemStatus,
            dataPedido: itemDate,
            diasCorridosRaw: row[diasCorridosCol] || '',
            observacao: row[observacaoCol] || '',
            prazoEntregaRaw: row[prazoEntregaCol] || '',
        };
        if (!ordersMap.has(orderCode)) {
            ordersMap.set(orderCode, {
                orderCode: orderCode,
                dataPedido: itemDate,
                totalItems: 0,
                totalAtendido: 0,
                totalPendente: 0,
                rawItems: [],
                itemHeaders: headers
            });
        }
        const order = ordersMap.get(orderCode);
        order.totalItems++;
        order.rawItems.push(individualItem);
        if (itemStatus === 'ok') order.totalAtendido++;
        else order.totalPendente++;
    });
    return Array.from(ordersMap.values()).map(order => {
        if (order.totalItems === 0) order.situacao = 'Sem Itens';
        else if (order.totalPendente === 0) order.situacao = 'Atendido';
        else if (order.totalAtendido > 0 && order.totalPendente > 0) order.situacao = 'Parcialmente Atendido';
        else order.situacao = 'Pendente';
        return order;
    });
}

// ========== EXPORTAÇÃO PDF ==========
/**
 * Gera PDF de um elemento usando html2pdf.
 * @param {HTMLElement} element 
 * @param {Object} options 
 */
export function exportToPDF(element, options = {}) {
    if (!window.html2pdf) {
        alert('Biblioteca html2pdf.js não carregada!');
        return;
    }
    const defaultOpt = {
        margin: 0.5,
        filename: 'relatorio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    window.html2pdf().set({ ...defaultOpt, ...options }).from(element).save();
}

// ========== OTHERS ==========
/**
 * Remove todos os filhos de um elemento.
 * @param {HTMLElement} el 
 */
export function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

/**
 * Gera um ID único (para keys, modais, etc).
 * @returns {string}
 */
export function uniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}