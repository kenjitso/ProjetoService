export const API_ENDPOINTS = {
    products: "https://script.google.com/macros/s/AKfycbwLWLCM0SuAnELFllVp0uPPzOaMozMx5yN-XKmf6QLSvpYgfxOtEVtLSLOqLOWE5umY/exec",
    ordersTerceiros: "https://script.google.com/macros/s/AKfycbwYWSPrgMdA5IGVYnH5EVJ3FLnU1THcI6SQa8opOHkjN_CZO-G2S7JJDuTqZQDd0Y2s/exec",
    nfe: "https://script.google.com/macros/s/AKfycbwetL7dn2Zmsr6ZPlE6x6B2JTahGOyhfENK6AoL-2HwEvffyTejBuHvIp7S_kgHI3_t/exec",
    webhook: "https://bling-proxy-api-255108547424.southamerica-east1.run.app",
    ordersUpdate: "https://bling-proxy-api-255108547424.southamerica-east1.run.app/update-order-status",
    nfeConferencia: "https://bling-proxy-api-255108547424.southamerica-east1.run.app/nfe/conferencia"
};

export async function fetchProducts() {
    const res = await fetch(API_ENDPOINTS.products, { mode: 'cors' });
    if (!res.ok) throw new Error('Erro ao buscar produtos');
    return (await res.json()).data;
}

export async function fetchOrdersTerceiros() {
    const res = await fetch(API_ENDPOINTS.ordersTerceiros, { mode: 'cors' });
    if (!res.ok) throw new Error('Erro ao buscar pedidos de terceiros');
    return (await res.json()).data;
}

export async function fetchNFe() {
    const res = await fetch(API_ENDPOINTS.nfe, { mode: 'cors' });
    if (!res.ok) throw new Error('Erro ao buscar NFe');
    return (await res.json()).data;
}

export async function postWebhook(payload) {
    const res = await fetch(API_ENDPOINTS.webhook, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await res.json();
}

export async function updateOrderStatus(payload) {
    const res = await fetch(API_ENDPOINTS.ordersUpdate, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await res.json();
}

export async function updateNFeConferido(payload) {
    const res = await fetch(API_ENDPOINTS.nfeConferencia, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await res.json();
}