<template>
    <div class="contracts">
        <div class="row">
            <div class="col-sm-12">
                <div class="action-bar-wrapper">
                    <div class="d-flex justify-content-center flex-wrap align-items-center">
                        <div class="position-relative form-group mb-0 mr-3 my-1" style="flex-grow: 1;">
                            <input
                                name="searchTerms"
                                placeholder="Enter search terms"
                                type="text"
                                class="form-control search-field"
                                v-model="query"
                            />
                        </div>
                        <div
                            class="d-flex justify-content-center align-items-center flex-wrap"
                            :class="{ 'mr-3': isLoading }"
                        >
                            <div class="d-flex mr-3 my-1">
                                <label
                                    for="contractStages"
                                    class="mr-2"
                                    :class="resize ? 'align-self-center' : 'align-self-end'"
                                >
                                    Stage:
                                </label>

                                <b-form-radio-group
                                    buttons
                                    button-variant="outline-primary"
                                    size="md"
                                    v-model="selectedRadio"
                                    :options="radioOptions"
                                    name="contractStages"
                                    :stacked="resize"
                                />
                            </div>
                            <div class="d-flex align-items-end my-1">
                                <label for="contractTypes" class="mr-2">Type:</label>
                                <b-form-radio-group
                                    buttons
                                    button-variant="outline-primary"
                                    size="md"
                                    v-model="selectedType"
                                    :options="typeOptions"
                                    name="contractTypes"
                                    class="add-type-margins"
                                />
                            </div>
                        </div>
                        <loading-button variant="primary" :loading="isLoading" />
                    </div>
                </div>
            </div>
        </div>

        <div class="alert alert-info" role="alert" v-if="!isLoading && filteredContracts.length == 0">
            <font-awesome-icon icon="info-circle" />
            <span class="ml-3">No contracts found!</span>
        </div>
        <div class="row" v-else-if="!isLoading">
            <div class="col-12">
                <div class="main-card card card-border mb-3">
                    <div class="table-responsive">
                        <table class="align-middle text-truncate mb-0 table table-hover fixed">
                            <thead>
                                <tr>
                                    <th class="text-center" width="5%">#</th>
                                    <th class="text-left" width="20%">Asset Name</th>
                                    <th class="text-center" width="10%">Asset Type</th>
                                    <th class="text-left" width="15%">Provider</th>
                                    <th class="text-left" width="15%">Consumer</th>
                                    <th class="text-center" width="10%">Last Update</th>
                                    <th class="text-center" width="10%">Stage</th>
                                    <th class="text-center" width="10%">Type</th>
                                    <th class="text-center" width="5%">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(contract, idx) in filteredContracts" :key="idx">
                                    <td class="text-center text-muted pl-4 pr-4" style="width: 80px;">{{ idx + 1 }}</td>
                                    <td>
                                        <router-link
                                            class="router-link-overflow"
                                            :to="{
                                                name: 'marketplace.contract',
                                                params: { requestId: contract.id, assetType: getAssetType(contract) },
                                            }"
                                            v-if="contract.stage === 'Request'"
                                        >
                                            <span v-if="contract.data_asset">{{ contract.data_asset.name }}</span>
                                            <span v-else-if="contract.application">
                                                {{ contract.application.name }}
                                            </span>
                                        </router-link>
                                        <router-link
                                            class="router-link-overflow"
                                            :to="{
                                                name: 'marketplace.contract',
                                                params: { contractId: contract.id, assetType: getAssetType(contract) },
                                            }"
                                            v-else
                                        >
                                            <span v-if="contract.data_asset">{{ contract.data_asset.name }}</span>
                                            <span v-else-if="contract.application">
                                                {{ contract.application.name }}
                                            </span>
                                        </router-link>
                                    </td>
                                    <td class="text-center text-capitalize overflow">{{ getAssetType(contract) }}</td>
                                    <td class="overflow">{{ contract.organization_owner.name }}</td>
                                    <td class="overflow">{{ contract.organization_consumer.name }}</td>
                                    <td class="text-center overflow">
                                        <time-ago :datetime="contract.updated || contract.created" long />
                                    </td>
                                    <td class="text-center" v-html="formatStage(contract.stage)" />
                                    <td class="text-center">{{ getType(contract) }}</td>
                                    <td class="text-center" v-html="formatPrice(contract)" />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import TimeAgo from 'vue2-timeago';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { compose, filter, propEq, pathEq, mergeAll, map, prop, sort, descend, either } from 'ramda';
import Fuse from 'fuse.js';
import { Contract } from '@/api';
import { LoadingButton } from '@/components';

const R = { compose, filter, propEq, pathEq, mergeAll, map, prop, sort, descend, either };
library.add(faInfoCircle);

export default {
    name: 'Contracts',
    components: { TimeAgo, LoadingButton, FontAwesomeIcon },
    data() {
        return {
            selectedRadio: 'all',
            radioOptions: [
                { text: 'Active', value: 'all' },
                { text: 'Request', value: 'Request' },
                { text: 'Draft', value: 'Draft' },
                { text: 'Under Negotiation', value: 'Under Negotiation' },
                { text: 'Accepted', value: 'Accepted' },
                { text: 'Paid', value: 'Paid' },
                { text: 'Rejected', value: 'Rejected' },
                { text: 'Expired', value: 'Expired' },
            ],
            selectedType: 'all',
            typeOptions: [
                { text: 'All', value: 'all' },
                { text: 'Acquired', value: 'buy' },
                { text: 'Sold', value: 'sell' },
            ],

            contracts: null,
            requests: null,

            searchOptions: {
                shouldSort: false,
                threshold: 0.4,
                location: 0,
                distance: 1000,
                maxPatternLength: 32,
                minMatchCharLength: 3,
                keys: [
                    { name: 'data_asset.name', weight: 0.8 },
                    { name: 'application.name', weight: 0.8 },
                    { name: 'organization_consumer.name', weight: 0.2 },
                ],
            },
            fuse: null,
            query: '',
            window: {
                width: 0,
            },
            isLoading: false,
        };
    },
    computed: {
        ...mapState(['organization']),
        searchResults() {
            if (this.query.trim() === '') {
                return this.contracts;
            }

            return this.fuse.search(this.query.trim());
        },
        filteredContracts() {
            const bought = R.pathEq(['organization_consumer', 'id'], this.$store.state.organization.id);
            const sold = R.pathEq(['organization_owner', 'id'], this.$store.state.organization.id);
            const inStage = R.propEq('stage', this.selectedRadio);
            const negotiating = R.propEq('stage', 'Negotiating');
            const revision = R.propEq('stage', 'Revision');

            if (this.searchResults) {
                if (this.selectedRadio === 'all' || this.selectedRadio === 'Under Negotiation') {
                    let filteredSearchResults = [];
                    if (this.selectedRadio === 'all') {
                        filteredSearchResults = this.searchResults.filter(
                            (result) => result.stage !== 'Rejected' && result.stage !== 'Expired',
                        );
                    } else {
                        filteredSearchResults = R.filter(R.either(negotiating, revision), this.searchResults);
                    }
                    if (this.selectedType === 'all') {
                        return filteredSearchResults;
                    }
                    if (this.selectedType === 'buy') {
                        return R.filter(bought, filteredSearchResults);
                    }

                    return R.filter(sold, filteredSearchResults);
                }

                if (this.selectedType === 'all') {
                    return R.filter(inStage, this.searchResults);
                }

                if (this.selectedType === 'buy') {
                    return R.filter(bought, R.filter(inStage, this.searchResults));
                }

                return R.filter(sold, R.filter(inStage, this.searchResults));
            }

            return [];
        },
        resize() {
            if (this.window.width < 500) {
                return true;
            }
            return false;
        },
    },
    async created() {
        this.isLoading = true;
        window.addEventListener('resize', this.handleResize);
        this.handleResize();

        if (this.organization.id === 1) {
            this.$router.push({ name: 'home' });
            this.$toastr.e('You have no contracts');
        }
        const { data: contracts } = await Contract.all();
        const { data: requests } = await Contract.requests();

        requests.forEach((obj) => {
            if (obj.request === null) {
                obj.stage = 'Request';
                obj.amount = null;
                obj.currency = null;
                obj.updated = obj.created;
                contracts.push(obj);
            }
        });

        this.contracts = R.sort(
            R.descend(R.prop('updated')),
            contracts.filter((obj) => obj.organization_owner.id !== 1),
        ); // Filter is to hide Open Data contracts because backend can't do it...
        this.contracts.forEach((contract) => {
            if (contract.stage === 'Draft' && contract.old_amount !== null && contract.old_terms !== null) {
                contract.stage = 'Revision';
            }
        });
        this.requests = requests;
        this.fuse = new Fuse(this.contracts, this.searchOptions);
        this.isLoading = false;
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        formatStage(stage) {
            switch (stage) {
                case 'Draft':
                    return '<div class="badge badge-secondary">Draft</div>';
                case 'Rejected':
                    return '<div class="badge badge-danger">Rejected</div>';
                case 'Accepted':
                    return '<div class="badge badge-info">Accepted</div>';
                case 'Paid':
                    return '<div class="badge badge-success">Paid</div>';
                case 'Negotiating':
                    return '<div class="badge badge-warning">Negotiating</div>';
                case 'Revision':
                    return '<div class="badge badge-primary">Revision</div>';
                case 'Request':
                    return '<div class="badge badge-alternate">Request</div>';
                default:
                    return `<div class="badge badge-light">${stage}</div>`;
            }
        },
        getType(contract) {
            if (contract.organization_owner.id === this.$store.state.organization.id) {
                if (contract.stage === 'Request') {
                    return 'To Sell';
                }
                return 'Sold';
            }

            if (contract.organization_consumer.id === this.$store.state.organization.id) {
                if (contract.stage === 'Request') {
                    return 'To Buy';
                }
                return 'Bought';
            }

            return 'Unknown';
        },
        formatPrice(contract) {
            if (contract.stage === 'Request') {
                return '&mdash;';
            }

            const currencies = { EUR: '&euro;', USD: '$', GBP: '&#163;' };

            if (contract.organization_owner.id === this.$store.state.organization.id) {
                return `<span class="text-success">${contract.amount} ${currencies[contract.currency]}</span>`;
            }

            if (contract.organization_consumer.id === this.$store.state.organization.id) {
                return `<span class="text-danger">-${contract.amount} ${currencies[contract.currency]}</span>`;
            }

            return '&mdash;';
        },
        handleResize() {
            this.window.width = window.innerWidth;
        },
        getAssetType(contract) {
            if (contract.data_asset) {
                return 'dataset';
            }
            if (contract.application) {
                return 'application';
            }
            return '';
        },
    },
};
</script>

<style lang="scss">
.contracts {
    .scroll-area-lg {
        height: 69vh;
    }

    td > a {
        display: block;
        text-decoration: none;
    }
    .input-group-text {
        background-color: var(--light);
    }
    .table th {
        border-top: 0;
    }
    table.fixed {
        table-layout: fixed;
    }
    table.fixed td.overflow {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 0;
    }
    .router-link-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
