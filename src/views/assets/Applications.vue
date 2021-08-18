<template>
    <div class="my-applications">
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
                                    'Search for applications according to the search terms or to the applied filters.'
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
            <div class="col-12" v-if="sortedApplications.length === 0 && !isLoading && !hasError">
                <div class="alert alert-warning" role="alert">
                    <font-awesome-icon icon="info-circle" />
                    <span class="ml-2">No applications found!</span>
                </div>
            </div>
            <div class="col-12" v-if="hasError">
                <div class="alert alert-danger" role="alert">
                    <font-awesome-icon icon="exclamation-circle" />
                    <span class="ml-2">Something went wrong! Please try again later.</span>
                </div>
            </div>
            <card-item-overview
                v-for="app in sortedApplications.slice((page - 1) * size, (page - 1) * size + size)"
                :key="app.id"
                :target-route="{ name: 'assets.applications.detail', params: { id: app.id } }"
                :id="app.id"
                :name="app.name"
                :date="app.created"
                :downloads="app.downloads"
                :tags="app.tags"
                :image-id="app.coverphoto"
                v-slot:actions
            ></card-item-overview>
            <div
                v-if="!isLoading && !hasError && sortedApplications.length > size"
                class="d-flex align-items-center flex-row col-12 flex-wrap justify-content-md-between justify-content-lg-between justify-content-xl-between align-it-center"
                style="margin-bottom: 2rem;"
            >
                <div style="font-size: 1rem; color: #888; padding-left: 4px; padding-right: 4px;">
                    {{ showPaginationText }}
                </div>
                <div
                    :class="
                        sortedApplications.length <= size * 10
                            ? 'remove-chunks-icon-last rounded-pagination-corners'
                            : 'remove-chunks-icon'
                    "
                >
                    <pagination
                        class="d-flex align-items-center"
                        v-model="page"
                        :records="sortedApplications.length"
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
import { Application } from '@/api';
import { CardItemOverview, LoadingButton } from '@/components';
import Pagination from 'vue-pagination-2';

const R = { descend, prop, propEq, sort, filter, reject, compose };
library.add(faExclamationCircle, faInfoCircle);

export default {
    name: 'Applications',
    components: { FontAwesomeIcon, CardItemOverview, LoadingButton, Pagination },
    data: () => ({
        applications: [],
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
        searchedApplications() {
            if (this.search) {
                this.search = false;
                this.page = 1;
                if (this.params.text.trim() === '') {
                    this.searchResult = this.applications;
                } else {
                    this.searchResult = this.fuse.search(this.params.text.trim());
                }
            }
            if (this.searchResult) {
                return this.searchResult;
            }
            return this.applications;
        },
        sortedApplications() {
            let filteredApplications = this.searchedApplications;
            if (this.params.ownership === 'mine') {
                filteredApplications = R.filter(
                    R.compose(R.propEq('id', this.organization.id), R.prop('organization')),
                    filteredApplications,
                );
            }
            if (this.params.ownership === 'purchased') {
                filteredApplications = R.reject(
                    R.compose(R.propEq('id', this.organization.id), R.prop('organization')),
                    filteredApplications,
                );
            }
            if (this.params.sort === 'created') {
                return R.sort(R.descend(R.prop('created')), filteredApplications);
            }
            if (this.params.sort === 'updated') {
                return R.sort(R.descend(R.prop('updated')), filteredApplications);
            }
            return filteredApplications;
        },
        showPaginationText() {
            if (this.sortedApplications.length > this.size) {
                const from = this.page * this.size - (this.size - 1);
                let to = this.page * this.size;
                if (to > this.sortedApplications.length) {
                    to = this.sortedApplications.length;
                }

                return `Showing ${from} to ${to} of ${this.sortedApplications.length} records`;
            }
            if (this.sortedApplications.length > 1) {
                return `${this.sortedApplications.length} records`;
            }

            return 'One record';
        },
    },
    async created() {
        await this.getApplications();
    },
    methods: {
        selectSortBy(option) {
            this.sortByText = `Sort By: ${option.text}`;
            this.params.sort = option.value;
            this.search = true;
        },
        async getApplications() {
            this.isLoading = true;
            this.applications = [];
            try {
                const { data: paginatedApplications } = await Application.bought(this.page - 1, this.size);
                const { data } = await Application.bought(this.page - 1, paginatedApplications.totalElements);
                this.applications = data.content;
                this.results = data.totalElements;
                this.fuse = new Fuse(this.applications, this.searchOptions);
                this.isLoading = false;
                this.hasError = false;
            } catch {
                this.hasError = true;
                this.isLoading = false;
                this.$toastr.e('Please try again later.', 'Something went wrong!');
            }
        },
    },
};
</script>

<style lang="scss"></style>
