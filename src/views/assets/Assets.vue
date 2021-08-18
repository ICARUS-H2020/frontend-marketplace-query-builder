<template>
    <div class="my-assets">
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
                                v-model="params.text"
                                @keyup.enter="search = true"
                            />
                        </div>
                        <div class="text-center mr-3 my-1">
                            <b-form-radio-group
                                buttons
                                button-variant="outline-primary"
                                size="md"
                                v-model="params.ownership"
                                :options="radioOptions"
                                name="radioBtnOutline"
                                @change="search = true"
                            />
                        </div>
                        <div class="mr-3 my-1">
                            <b-dropdown :text="sortByText" variant="outline-primary">
                                <b-dropdown-item
                                    v-for="option in sortByOptions"
                                    :key="option.value"
                                    :value="option.value"
                                    :active="option.value === params.sort"
                                    @click="selectSortBy(option)"
                                >
                                    {{ option.text }}
                                </b-dropdown-item>
                            </b-dropdown>
                        </div>
                        <div class="mr-1 my-1">
                            <b-btn
                                variant="primary"
                                size="md"
                                @click="search = true"
                                v-b-tooltip="
                                    'Search for datasets according to the search terms or to the applied filters.'
                                "
                                v-if="!isLoading"
                            >
                                Search
                            </b-btn>
                            <loading-button variant="primary" :loading="isLoading" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12" v-if="sortedAssets.length === 0 && !isLoading && !hasError">
                <div class="alert alert-warning" role="alert">
                    <font-awesome-icon icon="info-circle" />
                    <span class="ml-2">No datasets found!</span>
                </div>
            </div>
            <div class="col-12" v-if="hasError">
                <div class="alert alert-danger" role="alert">
                    <font-awesome-icon icon="exclamation-circle" />
                    <span class="ml-2">Something went wrong! Please try again later.</span>
                </div>
            </div>
            <card-item-overview
                v-for="asset in sortedAssets.slice((page - 1) * size, (page - 1) * size + size)"
                :key="asset.id"
                :target-route="{ name: 'assets.dataset', params: { id: asset.id } }"
                :id="asset.id"
                :name="asset.name"
                :date="asset.created"
                :downloads="asset.downloads"
                :categories="asset.categories.map((category) => category.name)"
                :image-id="asset.coverphoto"
            >
                <template slot="before">
                    <template v-if="asset.organization.id === organization.id">
                        <ribbon classes="bg-warning text-white" v-if="asset.datasetStatus === 'LOCKED'">Locked</ribbon>
                        <ribbon classes="bg-primary text-white" v-if="asset.datasetStatus === 'UNCOMPLETED'">
                            Incomplete
                        </ribbon>
                        <ribbon classes="bg-danger text-white" v-if="asset.datasetStatus === 'FAILED'">Failed</ribbon>
                    </template>
                    <template v-else>
                        <ribbon classes="bg-success text-white" v-if="asset.status === 'Public'">Open Data</ribbon>
                        <ribbon classes="bg-alternate text-white" v-else>Purchased</ribbon>
                    </template>
                </template>
            </card-item-overview>
            <div
                v-if="!isLoading && !hasError && sortedAssets.length > size"
                class="d-flex align-items-center flex-row col-12 flex-wrap justify-content-md-between justify-content-lg-between justify-content-xl-between align-it-center"
                style="margin-bottom: 2rem;"
            >
                <div style="font-size: 1rem; color: #888; padding-left: 4px; padding-right: 4px;">
                    {{ showPaginationText }}
                </div>
                <div
                    :class="
                        sortedAssets.length <= size * 10
                            ? 'remove-chunks-icon-last rounded-pagination-corners'
                            : 'remove-chunks-icon'
                    "
                >
                    <pagination
                        class="d-flex align-items-center"
                        v-model="page"
                        :records="sortedAssets.length"
                        :per-page="size"
                        :options="{
                            texts: { count: ' ', first: '<<', last: '>>' },
                            chunksNavigation: 'fixed',
                            edgeNavigation: true,
                        }"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { mapState } from 'vuex';
import { descend, prop, propEq, sort, filter, reject, compose } from 'ramda';
import Fuse from 'fuse.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { DataAsset } from '@/api';
import { CardItemOverview, LoadingButton, Ribbon } from '@/components';
import Pagination from 'vue-pagination-2';

const R = { descend, prop, propEq, sort, filter, reject, compose };
library.add(faExclamationCircle, faInfoCircle);

export default {
    name: 'Assets',
    components: { FontAwesomeIcon, CardItemOverview, LoadingButton, Ribbon, Pagination },
    data: () => ({
        assets: [],
        radioOptions: [
            { text: 'All', value: 'all' },
            { text: 'Own', value: 'mine' },
            { text: 'Purchased', value: 'purchased' },
        ],
        sortByText: 'Sort By: Date Available',
        sortByOptions: [
            { text: 'Date Available', value: 'created' },
            { text: 'Date Modified', value: 'updated' },
        ],
        params: {
            text: '',
            ownership: 'all',
            sort: 'created',
        },
        isLoading: false,
        hasError: false,
        fuse: null,
        searchOptions: {
            shouldSort: false,
            threshold: 0.4,
            location: 0,
            distance: 1000,
            maxPatternLength: 32,
            minMatchCharLength: 3,
            keys: [{ name: 'name', weight: 0.8 }],
        },
        search: false,
        searchResult: null,
        page: 1,
        size: 12,
        results: 0,
    }),
    computed: {
        ...mapState(['organization']),
        searchedAssets() {
            if (this.search) {
                this.search = false;
                this.page = 1;
                if (this.params.text.trim() === '') {
                    this.searchResult = this.assets;
                } else {
                    this.searchResult = this.fuse.search(this.params.text.trim());
                }
            }
            if (this.searchResult) {
                return this.searchResult;
            }
            return this.assets;
        },
        sortedAssets() {
            let filteredAssets = this.searchedAssets;
            if (this.params.ownership === 'mine') {
                filteredAssets = R.filter(
                    R.compose(R.propEq('id', this.organization.id), R.prop('organization')),
                    filteredAssets,
                );
            }
            if (this.params.ownership === 'purchased') {
                filteredAssets = R.reject(
                    R.compose(R.propEq('id', this.organization.id), R.prop('organization')),
                    filteredAssets,
                );
            }
            if (this.params.sort === 'created') {
                return R.sort(R.descend(R.prop('created')), filteredAssets);
            }
            if (this.params.sort === 'updated') {
                return R.sort(R.descend(R.prop('updated')), filteredAssets);
            }
            return filteredAssets;
        },
        showPaginationText() {
            if (this.sortedAssets.length > this.size) {
                const from = this.page * this.size - (this.size - 1);
                let to = this.page * this.size;
                if (to > this.sortedAssets.length) {
                    to = this.sortedAssets.length;
                }

                return `Showing ${from} to ${to} of ${this.sortedAssets.length} records`;
            }
            if (this.sortedAssets.length > 1) {
                return `${this.sortedAssets.length} records`;
            }

            return 'One record';
        },
    },
    async created() {
        await this.getAssets();
    },
    methods: {
        selectSortBy(option) {
            this.sortByText = `Sort By: ${option.text}`;
            this.params.sort = option.value;
            this.search = true;
        },
        async getAssets() {
            this.hasError = false;
            this.isLoading = true;
            this.assets = [];
            try {
                const { data: paginatedAssets } = await DataAsset.boughtNonCompleted(this.page - 1, this.size);
                const { data } = await DataAsset.boughtNonCompleted(this.page - 1, paginatedAssets.totalElements);
                this.assets = data.content;
                this.results = data.totalElements;
                this.fuse = new Fuse(this.assets, this.searchOptions);
                this.isLoading = false;
            } catch {
                this.hasError = true;
                this.isLoading = false;
            }
        },
    },
};
</script>

<style lang="scss">
.my-assets {
    .assets-header {
        box-shadow: 0px 2px 10px 0px rgba(204, 204, 204, 1);
    }
}
</style>
