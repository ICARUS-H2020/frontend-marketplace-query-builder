import { flask, secured } from './axios';

const resource = '/datacheckin';
const context = '/context';

export default {
    all: () => secured.get(`${resource}/organization/all`),
    create: (payload) => secured.post(`${resource}`, payload),
    delete: (id) => secured.delete(`${resource}/${id}`),
    get: (id) => secured.get(`${resource}/${id}`),
    update: (id, payload) => secured.put(`${resource}/${id}`, payload),
    clone: (id, payload) => secured.post(`${resource}/${id}/clone`, payload),
    appendData: (id, payload) => secured.put(`${resource}/append/${id}`, payload),
    replaceData: (id, payload) => secured.put(`${resource}/replace/${id}`, payload),
    cancelUpdate: (id) => secured.put(`${resource}/cancel/${id}`, {}),
    restart: (id) => secured.get(`${resource}/${id}/server-side-restart`),

    anonymization: (id) => secured.get(`${context}/${id}/anonymization`),
    cleaning: (id) => secured.get(`${context}/${id}/cleaning`),
    encryption: (id) => secured.get(`${context}/${id}/encryption`),
    mapping: (id) => secured.get(`${context}/${id}/mapping`),
    metadata: (id) => secured.get(`${context}/${id}/metadata`),
    upload: (id) => secured.get(`${context}/${id}/upload`),

    updateAnonymization: (id, payload) => secured.put(`${context}/${id}/anonymization`, payload),
    updateCleaning: (id, payload) => secured.put(`${context}/${id}/cleaning`, payload),
    updateEncryption: (id, payload) => secured.put(`${context}/${id}/encryption`, payload),
    updateMetadata: (id, payload) => secured.put(`${context}/${id}/metadata`, payload),
    updateUpload: (id, payload) => secured.put(`${context}/${id}/upload`, payload),

    calculateMapping: (id) => flask.get(`/calculate-mapping?dcid=${id}`),
    saveModel: (payload) => flask.post('/save-model', payload),
    trainAndSaveModel: (payload) => flask.post('/train-and-save-model', payload),
};
