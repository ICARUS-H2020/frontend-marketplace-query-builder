import { secured } from './axios';

const resource = '/data-model-suggestion';

export default {
    create: (payload) => secured.post(`${resource}`, payload),
    all: () => secured.get(`${resource}`), // Only usable by superadmin
    get: (id) => secured.get(`${resource}/${id}`), // Only usable by superadmin
    delete: (id) => secured.delete(`${resource}/${id}`), // Only usable by superadmin
    accept: (id) => secured.put(`${resource}/${id}/accept`), // Only usable by superadmin
    decline: (id) => secured.put(`${resource}/${id}/decline`), // Only usable by superadmin
};
