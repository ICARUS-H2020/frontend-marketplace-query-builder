import { recommendation } from './axios';

const resource = '/recommender';

export default {
    recommender: (payload) => recommendation.post(`${resource}`, payload),
};
