import { secured, flask } from './axios';

const contract = '/contract';
const quotation = '/buy-asset';

export default {
    all: () => secured.get(`${contract}/organization/all`),
    get: (id) => secured.get(`${contract}/${id}`),
    create: (payload) => secured.post(`${contract}`, payload),
    createApplicationContract: (payload) => secured.post(`${contract}/application`, payload),
    createVirtualContract: (id) => secured.post(`${contract}/open-data/${id}`),
    createAppVirtualContract: (id) => secured.post(`${contract}/open-app/${id}`),
    acceptContract: (id) => secured.put(`${contract}/${id}/accept-contract`, {}),
    acceptOffer: (id) => secured.put(`${contract}/${id}/accept-offer`, {}),
    rejectContract: (id) => secured.put(`${contract}/${id}/reject-contract`, {}),
    negotiateContract: (id, data) => secured.put(`${contract}/${id}/negotiate`, data),
    counterOffer: (id, data) => secured.put(`${contract}/${id}/counter`, data),
    rejectOffer: (id) => secured.put(`${contract}/${id}/reject-offer`, {}),
    contractPaid: (id) => secured.put(`${contract}/${id}/contract-paid`, {}),

    createTemplate: (payload) => secured.post(`${contract}-template`, payload),
    editTemplate: (id, payload) => secured.put(`${contract}-template/${id}`, payload),
    getTemplate: (id) => secured.get(`${contract}-template/${id}`),
    getAllTemplates: () => secured.get(`${contract}-template/all`),
    makeTemplateDefault: (id) => secured.put(`${contract}-template/${id}/make-default`),
    deleteTemplate: (id) => secured.delete(`${contract}-template/${id}`),

    requests: () => secured.get(`${quotation}/organization/all`),
    acceptRequest: (id) => secured.put(`${quotation}/${id}/accept`),
    rejectRequest: (id) => secured.put(`${quotation}/${id}/reject`),
    requestQuotation: (payload) => secured.post(`${quotation}`, payload),
    quotation: (id) => secured.get(`${quotation}/${id}`),

    activePending: () => secured.get(`${contract}/active-pending`),
    activePendingAppContracts: () => secured.get(`${contract}/active-pending/applications`),

    getPDF: (id) => flask.get(`${contract}/pdf?contract_id=${id}`),

    getRequestRows: (payload) => flask.post(`rfq-calc-rows`, payload),
};
