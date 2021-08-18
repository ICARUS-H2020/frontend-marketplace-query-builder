import { secured } from './axios';

const resource = '/query';

export default {
    all: () => secured.get(`${resource}/all`),
    get: (id) => secured.get(`${resource}/${id}`),
    create: (payload) => secured.post(`${resource}`, payload),
    update: (id, payload) => secured.put(`${resource}/${id}`, payload),
    delete: (id) => secured.delete(`${resource}/${id}`),
};
