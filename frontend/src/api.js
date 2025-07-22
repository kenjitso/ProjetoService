export const API_URLS = {
    PRODUCTS: "https://script.google.com/macros/s/AKfycbwLWLCM0SuAnELFllVp0uPPzOaMozMx5yN-XKmf6QLSvpYgfxOtEVtLSLOqLOWE5umY/exec",
    ORDERS_TERCEIROS: "https://script.google.com/macros/s/AKfycbwYWSPrgMdA5IGVYnH5EVJ3FLnU1THcI6SQa8opOHkjN_CZO-G2S7JJDuTqZQDd0Y2s/exec",
    NFE: "https://script.google.com/macros/s/AKfycbwetL7dn2Zmsr6ZPlE6x6B2JTahGOyhfENK6AoL-2HwEvffyTejBuHvIp7S_kgHI3_t/exec",
    WEBHOOK: "https://bling-proxy-api-255108547424.southamerica-east1.run.app",
    ORDERS_UPDATE: "https://bling-proxy-api-255108547424.southamerica-east1.run.app/update-order-status",
    NFE_CONFERENCIA: "https://bling-proxy-api-255108547424.southamerica-east1.run.app/nfe/conferencia"
};

export async function fetchProducts() {
    const response = await fetch(API_URLS.PRODUCTS, {mode: 'cors'});
    return response.json();
}

export async function fetchOrdersTerceiros() {
    const response = await fetch(API_URLS.ORDERS_TERCEIROS, {mode: 'cors'});
    return response.json();
}

export async function fetchNFe() {
    const response = await fetch(API_URLS.NFE, {mode: 'cors'});
    return response.json();
}

export async function postRequisition(payload) {
    const response = await fetch(API_URLS.WEBHOOK, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return response.json();
}

export async function updateOrderStatus(payload) {
    const response = await fetch(API_URLS.ORDERS_UPDATE, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return response.json();
}

export async function updateNFeConferido(payload) {
    const response = await fetch(API_URLS.NFE_CONFERENCIA, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return response.json();
}