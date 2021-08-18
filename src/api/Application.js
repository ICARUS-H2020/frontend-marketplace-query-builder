import { secured } from './axios';

const resource = '/application';

export default {
    all: () => secured.get(`${resource}/all`),
    bought: (page, size) => secured.get(`${resource}/organization/all/bought?page=${page}&size=${size}`),
    create: (payload) => secured.post(`${resource}/`, payload),
    get: (id) => secured.get(`${resource}/${id}`),
    update: (id, payload) => secured.put(`${resource}/${id}`, payload),
    organizationAll: (id) => secured.get(`${resource}/organization/${id}/all`),
    mine: () => secured.get(`${resource}/user/all`),
    search: (params) => secured.get(`${resource}/search/`, { params }),
    getFilters: () => secured.get('/authorization/filters'),
    getAuthorization: (id) => secured.get(`/authorization/application/${id}`),
    updateAuthorization: (id, payload) => secured.put(`/authorization/application/${id}`, payload),
    updateImage: (id, payload) => secured.put(`${resource}/upload-coverphoto-image/${id}`, payload),
    getImage: (id) => secured.get(`${resource}/coverphoto-image/${id}`),
};
