export function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

export function formatMoney(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatCnpjCpf(value) {
    if (!value) return 'N/A';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length === 11)
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (cleaned.length === 14)
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return value;
}

// Utilitários para datas úteis
export function isWeekend(date) {
    const d = date.getDay();
    return d === 0 || d === 6;
}
export function addBusinessDays(date, days) {
    const result = new Date(date.getTime());
    let added = 0;
    while (added < days) {
        result.setDate(result.getDate() + 1);
        if (!isWeekend(result)) added++;
    }
    return result;
}
export function getBusinessDaysDifference(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate.getTime());
    const end = new Date(endDate.getTime());
    current.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    if (current > end) return -getBusinessDaysDifference(end, current);
    if (current.getTime() === end.getTime()) return 0;
    while (current < end) {
        if (!isWeekend(current)) count++;
        current.setDate(current.getDate() + 1);
    }
    return count;
}