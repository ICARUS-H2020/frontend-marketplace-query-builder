import { secured } from './axios';

const resource = '/result';

export default {
    get: (id) => secured.get(`${resource}/${id}`),
};
