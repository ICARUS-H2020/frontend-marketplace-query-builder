import { flask } from './axios';

export default {
    search: (payload) => flask.post('/solr/search', payload),
};
