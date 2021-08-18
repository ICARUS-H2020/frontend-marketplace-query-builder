<template>
    <div class="marketplace">
        <div class="row">
            <div class="col-sm-12">
                <div class="card card-border mb-4">
                    <div class="card-header search-header pr-0">
                        <div class="position-relative form-group mb-0 mr-3" style="flex-grow: 1;">
                            <input
                                name="title"
                                placeholder="Enter search terms, use the wildcard operator ? to match any single character and * to match zero or more characters"
                                type="text"
                                class="form-control"
                                v-model="filters.title"
                            />
                        </div>

                        <div class="text-center mr-3 my-1">
                            <b-form-radio-group
                                buttons
                                button-variant="outline-primary"
                                size="md"
                                v-model="filters.items"
                                :options="itemsOptions"
                                @input="retrieveItems()"
                                name="radioBtnOutline"
                            />
                        </div>
                        <div class="sort-button mr-3 my-1">
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

                        <div class="d-flex no-wrap justify-content-center my-1 mr-3">
                            <div class="btn-group" role="group">
                                <b-button
                                    type="button"
                                    class="btn btn-warning btn-shadow text-white text-md"
                                    v-if="!isLoading"
                                    @click="searchItems()"
                                    v-b-tooltip="
                                        'Search for datasets according to the selected search criteria or to the applied filters.'
                                    "
                                >
                                    Search
                                </b-button>
                                <loading-button variant="warning" :loading="isLoading" />
                                <b-dropdown
                                    type="button"
                                    class="btn-warning btn-shadow rounded-right"
                                    variant="warning"
                                    v-if="!isLoading"
                                    right
                                >
                                    <loading-button variant="warning" :loading="isLoading" />
                                    <b-dropdown-item
                                        type="button"
                                        class="btn-icon btn-icon-only"
                                        variant="outline-link"
                                        v-b-tooltip="'View additional search parameters / filters'"
                                        :class="marketplaceFiltersAreShown ? 'collapsed' : null"
                                        :aria-expanded="marketplaceFiltersAreShown ? 'true' : 'false'"
                                        aria-controls="collapse-4"
                                        @click="toggleFilters()"
                                    >
                                        <div class="d-flex justify-content-between w-100 align-items-center">
                                            <div>Advanced Search</div>
                                            <font-awesome-icon
                                                icon="filter"
                                                :class="{
                                                    'text-secondary': !marketplaceFiltersAreShown,
                                                    'text-primary': marketplaceFiltersAreShown,
                                                }"
                                            />
                                        </div>
                                    </b-dropdown-item>
                                    <b-dropdown-item
                                        type="button"
                                        v-if="filters.items === 'Datasets'"
                                        class="btn-icon btn-icon-only"
                                        variant="outline-link"
                                        :class="marketplaceQueryBuilderIsShown ? 'collapsed' : null"
                                        :aria-expanded="marketplaceQueryBuilderIsShown ? 'true' : 'false'"
                                        aria-controls="collapse-4"
                                        v-b-tooltip="'Create a search query'"
                                        @click="toggleQueryBuilder()"
                                    >
                                        <div class="d-flex justify-content-between w-100 align-items-center">
                                            <div>Query Explorer</div>

                                            <font-awesome-icon
                                                icon="tools"
                                                :class="{
                                                    'text-secondary': !marketplaceQueryBuilderIsShown,
                                                    'text-primary': marketplaceQueryBuilderIsShown,
                                                }"
                                            />
                                        </div>
                                    </b-dropdown-item>
                                </b-dropdown>
                            </div>
                        </div>
                    </div>
                    <div class="py-3 px-4" style="border-bottom: 1px solid rgba(18, 39, 58, 0.125);">
                        <div class="row">
                            <div class="col-sm-12">
                                <h6 class="mt-1 mb-0" v-if="haveActiveFilters"><b>Active Filters</b></h6>
                                <h6 class="mt-1 mb-0" v-else-if="haveActiveQueryBuilderFilters"><b>Active Query</b></h6>
                                <h6 class="mt-1 mb-0" v-else><i>No additional filters or query applied</i></h6>
                            </div>
                        </div>
                        <div class="row" v-if="haveActiveFilters">
                            <div class="col-sm-12 active-filters">
                                <span class="pt-2 pr-4" v-if="activeFilters.tags">
                                    <u>Tags:</u>
                                    {{ activeFilters.tags }}
                                </span>
                                <span class="pt-2 pr-4" v-if="activeFilters.categories.length > 0">
                                    <u>Categories:</u>
                                    {{ R.map((category) => category.name, activeFilters.categories).join(', ') }}
                                </span>
                                <span class="pt-2 pr-4" v-if="activeFilters.standards">
                                    <u>Standards:</u>
                                    {{ activeFilters.standards }}
                                </span>
                                <span class="pt-2 pr-4" v-if="activeFilters.spatialCoverage.length > 0">
                                    <u>Spatial Coverage:</u>
                                    {{ activeFilters.spatialCoverage.join(', ') }}
                                </span>
                                <span class="pt-2 pr-4" v-if="activeFilters.temporalCoverage">
                                    <u>Temporal Coverage:</u>
                                    {{ activeFilters.temporalCoverage.join(' to ') }}
                                </span>

                                <span class="pt-2 pr-4" v-if="activeFilters.dataAssetProvider">
                                    <u>Data Asset Provider:</u>
                                    {{ activeFilters.dataAssetProvider }}
                                </span>
                                <span class="pt-2 pr-4" v-if="activeFilters.licenses.length > 0">
                                    <u>License:</u>
                                    {{ activeFilters.licenses.join(', ') }}
                                </span>
                                <span class="pt-2 pr-4" v-if="activeFilters.status && activeFilters.status !== 'All'">
                                    <u>Status:</u>
                                    {{ activeFilters.status }}
                                </span>
                                <span class="pt-2 pr-4" v-if="activeFilters.relatedDatasets">
                                    <u>Related Datsets:</u>
                                    {{ activeFilters.relatedDatasets }}
                                </span>
                            </div>
                        </div>
                        <div class="row" v-if="haveActiveQueryBuilderFilters">
                            <active-query-display :active-query="activeQuery" />
                        </div>
                    </div>
                    <b-collapse id="filtersCollapse" v-model="marketplaceFiltersAreShown" class="mt-2">
                        <div class="card-body">
                            <div class="row">
                                <div class="position-relative form-group col-sm-4">
                                    <label for="tags">
                                        Tags
                                        <tooltip
                                            v-b-tooltip="
                                                'The list of keywords and / or arbitrary textual tags that need to be included in the data asset.'
                                            "
                                        />
                                    </label>
                                    <input
                                        name="tags"
                                        placeholder="Enter tags"
                                        type="text"
                                        class="form-control"
                                        v-model="filters.tags"
                                    />
                                </div>
                                <div class="position-relative form-group col-sm-4">
                                    <label for="categories">
                                        Categories
                                        <tooltip
                                            v-b-tooltip="
                                                'The concepts of the ICARUS aviation data model that need to be associated with the data asset.'
                                            "
                                        />
                                    </label>
                                    <multiselect
                                        name="categories"
                                        v-model="filters.categories"
                                        track-by="id"
                                        label="name"
                                        :limit="2"
                                        :options="categoryOptions"
                                        :multiple="true"
                                        :close-on-select="false"
                                        placeholder="Select categories"
                                    />
                                </div>
                                <div v-if="filters.items === 'Datasets'" class="position-relative form-group col-sm-4">
                                    <label for="standards">
                                        Standards
                                        <tooltip
                                            v-b-tooltip="
                                                'The standards or any other specifications to which the data assets must conform.'
                                            "
                                        />
                                    </label>
                                    <input
                                        name="standards"
                                        placeholder="Enter standards"
                                        type="text"
                                        class="form-control"
                                        v-model="filters.standards"
                                    />
                                </div>
                                <div v-else class="position-relative form-group col-sm-4">
                                    <label for="dataAssetProvider">
                                        Data Asset Provider
                                        <tooltip v-b-tooltip="'The provider of the data asset.'" />
                                    </label>
                                    <input
                                        name="dataAssetProvider"
                                        placeholder="Enter Data Asset Provider"
                                        type="text"
                                        class="form-control"
                                        v-model="filters.dataAssetProvider"
                                    />
                                </div>
                            </div>
                            <div v-show="filters.items === 'Datasets'" class="row">
                                <div class="position-relative form-group col-sm-7">
                                    <label for="spatialCoverage">
                                        Spatial Coverage
                                        <tooltip
                                            v-b-tooltip="
                                                'The list of countries or locations to which the data assets must refer. Searching for a specific country brings the results for the specific country, but also for the continent. Searching for a specific continent brings the results for the specific continent, but also for its individual countries.'
                                            "
                                        />
                                    </label>
                                    <treeselect
                                        name="spatialCoverage"
                                        :options="countryOptions"
                                        :searchable="true"
                                        :multiple="true"
                                        :limit="5"
                                        :disable-branch-nodes="false"
                                        v-model="filters.spatialCoverage"
                                        placeholder="Select countries"
                                        v-validate="'required'"
                                    />
                                </div>
                                <div class="position-relative form-group col-sm-5">
                                    <label for="temporalCoverage">
                                        Temporal Coverage
                                        <tooltip
                                            v-b-tooltip="
                                                'The time period, date, or date range that the data asset must cover.'
                                            "
                                        />
                                    </label>
                                    <date-picker
                                        name="temporalCoverage"
                                        input-class="form-control"
                                        width="100%"
                                        v-model="filters.temporalCoverage"
                                        :type="'date'"
                                        :lang="'en'"
                                        :shortcuts="false"
                                        :value-type="'format'"
                                        range
                                        @clear="filters.temporalCoverage = null"
                                    >
                                        <template slot="header">
                                            <p class="px-2 pt-2 mb-0 text-center">
                                                <u>
                                                    Select start and end dates using the left and right calendars
                                                    respectively
                                                </u>
                                            </p>
                                        </template>
                                    </date-picker>
                                </div>
                            </div>
                            <div v-if="filters.items === 'Datasets'" class="row">
                                <div class="position-relative form-group col-sm-12">
                                    <label for="dataAssetProvider">
                                        Data Asset Provider
                                        <tooltip v-b-tooltip="'The provider of the data asset.'" />
                                    </label>
                                    <input
                                        name="dataAssetProvider"
                                        placeholder="Enter Data Asset Provider"
                                        type="text"
                                        class="form-control"
                                        v-model="filters.dataAssetProvider"
                                    />
                                </div>
                            </div>
                            <div v-if="filters.items === 'Datasets'" class="row">
                                <div class="position-relative form-group col-sm-9">
                                    <label for="license">
                                        License
                                        <tooltip
                                            v-b-tooltip="'The licenses that the data asset need to comply with.'"
                                        />
                                    </label>
                                    <treeselect
                                        name="license"
                                        :options="licenseOptions"
                                        :searchable="true"
                                        :multiple="true"
                                        :limit="2"
                                        :disable-branch-nodes="false"
                                        v-model="filters.licenses"
                                        placeholder="Select license"
                                    />
                                </div>

                                <div class="position-relative form-group col-sm-3">
                                    <label for="status">
                                        Status
                                        <tooltip v-b-tooltip="'The status of the data asset'" />
                                    </label>

                                    <b-form-radio-group
                                        class="d-flex flex-row"
                                        buttons
                                        button-variant="outline-primary"
                                        size="md"
                                        v-model="filters.status"
                                        :options="statusOptions"
                                        name="radioBtnOutline"
                                    />
                                </div>
                            </div>
                            <div v-else class="row">
                                <div class="position-relative form-group col-sm-12">
                                    <label for="license">
                                        Related Datasets
                                        <tooltip v-b-tooltip="'Related datasets to the Application'" />
                                    </label>
                                    <input
                                        name="relatedDatasets"
                                        placeholder="Enter Related Datasets"
                                        type="text"
                                        class="form-control"
                                        v-model="filters.relatedDatasets"
                                    />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 text-left">
                                    <button type="button" class="btn btn-light mr-2" @click="clearFilters()">
                                        Clear filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </b-collapse>
                    <b-collapse id="queryBuilderCollapse" v-model="marketplaceQueryBuilderIsShown" class="mt-2">
                        <query-builder
                            v-if="!marketplaceFiltersAreShown"
                            :parent-query="queryFilters.query"
                            :data-model="dataModel"
                            :edit-mode="editModeQuery"
                            @update-query="updateSearchQuery"
                            @created-query="createdQuery"
                            @clear-query="clearQuery()"
                        />
                    </b-collapse>
                </div>
            </div>
        </div>

        <div v-if="haveActiveQueryBuilderFilters && !isLoading && !hasError" class="row mb-4">
            <div class="col-12 d-flex justify-content-end">
                <b-form-radio-group
                    buttons
                    button-variant="outline-primary"
                    size="md"
                    v-model="queryFilters.queryResultsType"
                    :options="queryResultsOptions"
                    @input="filterQueryResults()"
                    name="radioBtnOutline"
                />
            </div>
        </div>

        <div
            v-if="
                queryFilters.queryResultsType === 'Combo Datasets' &&
                getMarketplaceItems.length &&
                haveActiveQueryBuilderFilters
            "
            class="row"
        >
            <div
                class="col-12"
                v-if="getMarketplaceItems.length === 0 && !isLoading && !hasError && !queryFilters.loading"
            >
                <div class="alert alert-warning" role="alert">
                    <font-awesome-icon icon="info-circle" />
                    <span class="ml-2">No results found!</span>
                </div>
            </div>
            <div class="col-12" v-if="hasError">
                <div class="alert alert-danger" role="alert">
                    <font-awesome-icon icon="exclamation-circle" />
                    <span class="ml-2">Something went wrong! Please try again later.</span>
                </div>
            </div>

            <combo-datasets-card
                v-for="combo in getMarketplaceItems"
                :key="combo.id"
                :id="combo.id"
                :combination="combo.combination"
                :active-contracts="activeContracts"
                :pending-contracts="pendingContracts"
                :favorite-items="favoriteItems"
                :organization="organization"
                :active-query="activeQuery"
                @open-combo-explanation-modal="openComboExplanationModal"
                @change-favorite-state="changeState"
            ></combo-datasets-card>
        </div>
        <div v-else class="row">
            <div
                class="col-12"
                v-if="getMarketplaceItems.length === 0 && !isLoading && !hasError && !queryFilters.loading"
            >
                <div class="alert alert-warning" role="alert">
                    <font-awesome-icon icon="info-circle" />
                    <span class="ml-2">No results found!</span>
                </div>
            </div>
            <div class="col-12" v-if="hasError">
                <div class="alert alert-danger" role="alert">
                    <font-awesome-icon icon="exclamation-circle" />
                    <span class="ml-2">Something went wrong! Please try again later.</span>
                </div>
            </div>
            <card-item-overview
                v-for="item in getMarketplaceItems"
                :key="item.id"
                :id="item.id"
                :target-route="{
                    name: filters.items === 'Applications' ? 'assets.applications.detail' : 'assets.dataset',
                    params: { id: item.id },
                }"
                :name="item.name"
                :date="item.created"
                :tags="item.tags"
                :downloads="item.downloads"
                :image-id="item.coverphoto"
            >
                <template slot="before">
                    <ribbon classes="bg-success text-white" v-if="item.status === 'Public'">Open Data</ribbon>
                    <ribbon v-if="filters.items === 'Applications'" classes="bg-primary text-white">App</ribbon>
                    <query-result-ribbon
                        v-if="haveActiveQueryBuilderFilters && queryFilters.queryResultsType === 'Single Datasets'"
                        :classes="item.match === 'exact' ? 'bg-primary text-white' : 'bg-alternate text-white'"
                    >
                        {{ item.match === 'exact' ? 'Exact Match' : 'Potential Match' }}
                    </query-result-ribbon>
                </template>

                <template slot="actions">
                    <font-awesome-icon
                        icon="star"
                        @click="
                            changeState(item.id);
                            $event.stopImmediatePropagation();
                        "
                        class="favorite-button"
                        :class="
                            favoriteItems.find(
                                (fav) =>
                                    fav.id === item.id &&
                                    ((filters.items === 'Datasets' && fav.item === 'dataset') ||
                                        (filters.items === 'Applications' && fav.item === 'application')),
                            )
                                ? 'full-star'
                                : 'empty-star'
                        "
                        v-b-tooltip.hover="
                            favoriteItems.find(
                                (fav) =>
                                    fav.id === item.id &&
                                    ((filters.items === 'Datasets' && fav.item === 'dataset') ||
                                        (filters.items === 'Applications' && fav.item === 'application')),
                            )
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                        "
                    />

                    <template v-if="item.status === 'Public'">
                        <b-button
                            class="btn-sm text-dark purchase-button"
                            variant="light"
                            v-if="activeContracts.indexOf(item.id) === -1"
                            @click="
                                filters.items === 'Applications' ? getOpenApplication(item.id) : getOpenData(item.id);
                                $event.stopImmediatePropagation();
                            "
                        >
                            <b>GET</b>
                        </b-button>
                    </template>
                    <template v-else-if="item.organization_id === organization.id">
                        <!-- TODO: Edit button -->
                    </template>
                    <template v-else>
                        <b-button
                            class="btn-hover-shine btn-sm btn-shadow btn-transition purchase-button"
                            variant="warning"
                            v-if="activeContracts.indexOf(item.id) === -1 && pendingContracts.indexOf(item.id) === -1"
                            @click="
                                $router.push({
                                    name: 'marketplace.quotation',
                                    params: {
                                        assetId: item.id,
                                        assetType: filters.items === 'Applications' ? 'application' : 'dataset',
                                    },
                                });
                                $event.stopImmediatePropagation();
                            "
                        >
                            <b>PURCHASE</b>
                        </b-button>

                        <b-button
                            class="btn-sm text-light purchase-button"
                            variant="alternate"
                            v-else-if="pendingContracts.indexOf(item.id) > -1"
                            @click="
                                $router.push({ name: 'assets.contracts' });
                                $event.stopImmediatePropagation();
                            "
                        >
                            <b>CONTRACT PENDING</b>
                        </b-button>
                    </template>
                </template>
            </card-item-overview>

            <div
                v-if="!isLoading && !hasError && totalNumOfResults > numOfResultsPerPage"
                class="d-flex align-items-center flex-row col-12 flex-wrap justify-content-md-between justify-content-lg-between justify-content-xl-between align-it-center"
                style="margin-bottom: 2rem;"
            >
                <div style="font-size: 1rem; color: #888; padding-left: 4px; padding-right: 4px;">
                    {{ showPaginationText }}
                </div>
                <div
                    :class="
                        totalNumOfResults <= numOfResultsPerPage * 10
                            ? 'remove-chunks-icon-last rounded-pagination-corners'
                            : 'remove-chunks-icon'
                    "
                >
                    <pagination
                        class="d-flex align-items-center"
                        v-model="filters.page"
                        :records="totalNumOfResults"
                        :per-page="numOfResultsPerPage"
                        :options="{
                            texts: { count: ' ', first: '<<', last: '>>' },
                            chunksNavigation: 'fixed',
                            edgeNavigation: true,
                        }"
                        @paginate="nextPageResults()"
                    />
                </div>
            </div>
        </div>
        <combo-explanation-modal id="comboExplanationModal" :active-query="activeQuery" :datasets="comboDatasetInfo" />
        <div v-if="queryFilters.loading" class="row justify-content-center">
            <div class="loading-indicator p-1">
                <Spinner name="wave" color="var(--primary)" no-fade-in />
            </div>
        </div>
    </div>
</template>

<script>
import { forEachObjIndexed, forEach, prop, sortBy, map, clone } from 'ramda';
import { Marketplace, Category, Contract, Favorites, UsageAnalytics } from '@/api';
import { CardItemOverview, Tooltip, Ribbon, LoadingButton, QueryResultRibbon, ComboDatasetsCard } from '@/components';
import QueryBuilder from '@/views/query-builder/QueryBuilder.vue';
import ActiveQueryDisplay from './ActiveQueryDisplay.vue';
import ComboExplanationModal from '@/layouts/architect/components/modals/ComboExplanationModal.vue';
import Treeselect from '@riophae/vue-treeselect';
import Pagination from 'vue-pagination-2';
import Multiselect from 'vue-multiselect';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faFilter,
    faExclamationCircle,
    faInfoCircle,
    faStar,
    faTrash,
    faPaste,
    faEdit,
    faTools,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DatePicker from 'vue2-datepicker';
import options from '@/config/dataset.json';
import { mapGetters, mapState } from 'vuex';
import {
    TOGGLE_MARKETPLACE_FILTERS_VISIBLE,
    TOGGLE_MARKETPLACE_QUERY_BUILDER_VISIBLE,
    SET_MARKETPLACE_QUERY_BUILDER_OBJECT,
    SET_MARKETPLACE_FILTERS_OBJECT,
    SET_MARKETPLACE_ITEMS,
} from '@/store/mutation-types';

library.add(faFilter, faExclamationCircle, faInfoCircle, faStar, faTrash, faPaste, faEdit, faTools);
const R = { forEachObjIndexed, forEach, prop, sortBy, map, clone };

export default {
    name: 'Marketplace',
    components: {
        CardItemOverview,
        Multiselect,
        Treeselect,
        DatePicker,
        FontAwesomeIcon,
        Tooltip,
        Ribbon,
        LoadingButton,
        QueryBuilder,
        Pagination,
        QueryResultRibbon,
        ComboDatasetsCard,
        ComboExplanationModal,
        ActiveQueryDisplay,
    },
    data: () => ({
        statusOptions: ['All', 'Private', 'Public'],
        itemsOptions: [
            { text: 'Datasets', value: 'Datasets', disabled: false },
            { text: 'Applications', value: 'Applications', disabled: false },
        ],
        queryResultsOptions: ['Single Datasets', 'Combo Datasets'],
        categoryOptions: [],
        countryOptions: options.countryOptions,
        licenseOptions: options.licenseOptions,
        sortByText: 'Sort By: Relevance',
        sortByOptions: [
            { text: 'Relevance', value: 'relevance' },
            { text: 'Date Available', value: 'date_created' },
            { text: 'Date Modified', value: 'date_updated' },
        ],
        params: {
            text: '',
            items: 'Datasets',
            sort: 'relevance',
        },
        filters: {
            title: null,
            tags: null,
            categories: [],
            standards: null,
            temporalCoverage: null,
            spatialCoverage: [],
            dataAssetProvider: null,
            licenses: [],
            relatedDatasets: null,
            status: 'All',
            items: 'Datasets',
            sortBy: 'relevance',
            page: 1,
        },
        activeFilters: {
            title: null,
            tags: null,
            categories: [],
            standards: null,
            temporalCoverage: null,
            spatialCoverage: [],
            dataAssetProvider: null,
            licenses: [],
            relatedDatasets: null,
            status: 'All',
            items: 'Datasets',
            sortBy: 'relevance',
            page: 1,
        },
        queryFilters: {
            title: null,
            query: [],
            items: 'Datasets',
            sortBy: 'relevance',
            queryResultsType: 'Single Datasets',
            page: 1,
            loading: false,
        },
        activeQuery: [],
        activeContracts: [],
        pendingContracts: [],
        isLoading: false,
        hasError: false,
        favoriteItems: [],
        R,
        activeSearch: null,
        editModeQuery: null,
        totalNumOfResults: null,
        comboDatasetInfo: [],
        numOfResultsPerPage: 12,
    }),
    computed: {
        ...mapGetters([
            'dataModel',
            'getMarketplaceFiltersObject',
            'getMarketplaceItems',
            'getMarketplaceQueryBuilderObject',
        ]),
        ...mapState(['marketplaceFiltersVisible', 'organization', 'marketplaceQueryBuilderVisible']),
        marketplaceFiltersAreShown: {
            get() {
                return this.marketplaceFiltersVisible;
            },
            set(value) {
                this.$store.commit(TOGGLE_MARKETPLACE_FILTERS_VISIBLE, value);
            },
        },
        marketplaceQueryBuilderIsShown: {
            get() {
                return this.marketplaceQueryBuilderVisible;
            },
            set(value) {
                this.$store.commit(TOGGLE_MARKETPLACE_QUERY_BUILDER_VISIBLE, value);
            },
        },
        haveActiveFilters() {
            if (
                this.activeFilters.categories.length > 0 ||
                (this.activeFilters.dataAssetProvider !== null && this.activeFilters.dataAssetProvider.length > 0) ||
                this.activeFilters.licenses.length > 0 ||
                this.activeFilters.spatialCoverage.length > 0 ||
                (this.activeFilters.standards !== null && this.activeFilters.standards.length > 0) ||
                (this.activeFilters.tags !== null && this.activeFilters.tags.length > 0) ||
                (this.activeFilters.relatedDatasets !== null && this.activeFilters.relatedDatasets.length > 0) ||
                this.activeFilters.temporalCoverage ||
                (this.activeFilters.status && this.activeFilters.status !== 'All')
            ) {
                return true;
            }
            return false;
        },
        haveActiveQueryBuilderFilters() {
            if (this.activeQuery.length) {
                return true;
            }
            return false;
        },
        showPaginationText() {
            if (this.totalNumOfResults > this.numOfResultsPerPage) {
                const from = this.filters.page * this.numOfResultsPerPage - (this.numOfResultsPerPage - 1);
                let to = this.filters.page * this.numOfResultsPerPage;
                if (to > this.totalNumOfResults) {
                    to = this.totalNumOfResults;
                }

                return `Showing ${from} to ${to} of ${this.totalNumOfResults} records`;
            }
            if (this.totalNumOfResults > 1) {
                return `${this.totalNumOfResults} records`;
            }

            return 'One record';
        },
    },
    async created() {
        this.isLoading = true;
        this.$store.commit(SET_MARKETPLACE_ITEMS, []);

        this.$store.commit(TOGGLE_MARKETPLACE_QUERY_BUILDER_VISIBLE, !!this.$route.params.openQueryBuilder);

        await Favorites.all()
            .then((res) => {
                res.data.forEach((id) => this.favoriteItems.push({ id, item: 'dataset' }));
                Favorites.allApps()
                    .then((resApps) => {
                        resApps.data.forEach((appId) => this.favoriteItems.push({ id: appId, item: 'application' }));
                    })
                    .catch(() => {
                        this.$toastr.e('An error occured', 'Error');
                    });
            })
            .catch(() => {
                this.$toastr.e('An error occured', 'Error');
            });

        if (this.organization.id === 1) {
            this.$router.push({ name: 'home' });
            this.$toastr.e('Your organization is not allowed to buy datasets!');
        }
        const [{ data: activePendingContracts }, { data: categories }] = await Promise.all([
            Contract.activePending(),
            Category.all(),
        ]);
        let allActivePendingContracts = activePendingContracts;
        if (this.organization && this.organization.id !== 1) {
            const { data: contracts } = await Contract.activePendingAppContracts();
            allActivePendingContracts = allActivePendingContracts.concat(contracts);
        }
        this.categoryOptions = categories;
        this.countryOptions.forEach((global) => {
            global.children = R.sortBy(R.prop('label'), global.children);
            global.children.forEach((continent) => {
                continent.children = R.sortBy(R.prop('label'), continent.children);
            });
        });
        R.forEach((contract) => {
            if (contract.status === 'active') {
                this.activeContracts.push(contract.id);
            } else {
                this.pendingContracts.push(contract.id);
            }
        }, allActivePendingContracts);

        if (this.$route.params.parameters) {
            this.editModeQuery = this.$route.params.id;
            this.queryFilters.query = this.$route.params.parameters;
            this.clearFilters();
            this.applyQueryBuilder();
        } else if (this.getMarketplaceItems.length === 0) {
            R.forEachObjIndexed((value, key) => {
                this.filters[key] = value;
            }, this.getMarketplaceFiltersObject);
            this.applyFilters();
        }
    },
    methods: {
        onCancel() {
            console.log('User cancelled the loader.');
        },
        selectSortBy(option) {
            this.sortByText = `Sort By: ${option.text}`;
            this.filters.sortBy = option.value;
        },
        async applyFilters() {
            this.hasError = false;
            this.isLoading = true;

            this.$store.commit(SET_MARKETPLACE_ITEMS, []);
            if (this.marketplaceFiltersVisible) {
                this.$store.commit(TOGGLE_MARKETPLACE_FILTERS_VISIBLE, !this.marketplaceFiltersVisible);
            }
            this.$store.commit(SET_MARKETPLACE_FILTERS_OBJECT, this.filters);

            // clear query filters when either entering the advanced filters collapsable or searching with default filters
            try {
                const { data: items } = await Marketplace.search(this.filters);

                this.totalNumOfResults = items.totalNumOfResults;
                this.activeFilters = R.clone(this.filters);

                this.$store.commit(SET_MARKETPLACE_ITEMS, items.results);
            } catch {
                this.hasError = true;
            } finally {
                this.isLoading = false;
                this.itemsOptions.forEach((i) => {
                    i.disabled = false;
                });
            }
        },
        async applyQueryBuilder() {
            // only for datasets
            this.queryFilters.title = this.filters.title;
            this.queryFilters.sortBy = this.filters.sortBy;

            this.hasError = false;
            this.isLoading = !this.queryFilters.loading;

            this.$store.commit(SET_MARKETPLACE_ITEMS, []);
            if (this.marketplaceQueryBuilderVisible) {
                this.$store.commit(TOGGLE_MARKETPLACE_QUERY_BUILDER_VISIBLE, !this.marketplaceQueryBuilderVisible);
            }
            this.$store.commit(SET_MARKETPLACE_QUERY_BUILDER_OBJECT, this.queryFilters);
            try {
                const { data: items } = await Marketplace.search(this.queryFilters);
                this.totalNumOfResults = items.totalNumOfResults;
                this.$store.commit(SET_MARKETPLACE_ITEMS, items.results);
                this.activeQuery = R.clone(this.queryFilters.query);
            } catch {
                this.hasError = true;
            } finally {
                this.isLoading = false;
                this.queryFilters.loading = false;
                this.itemsOptions.forEach((i) => {
                    i.disabled = false;
                });
            }
        },
        async getOpenData(id) {
            try {
                await Contract.createVirtualContract(id);
                this.$router.push({ name: 'assets.dataset', params: { id } });
            } catch (error) {
                this.$toastr.e('Error getting dataset');
            }
        },
        async getOpenApplication(id) {
            try {
                await Contract.createAppVirtualContract(id);
                this.$router.push({ name: 'assets.applications.detail', params: { id } });
            } catch (error) {
                this.$toastr.e('Error getting application');
            }
        },
        clearFilters() {
            const defaultFilters = {
                title: null,
                tags: null,
                categories: [],
                standards: null,
                temporalCoverage: null,
                spatialCoverage: [],
                dataAssetProvider: null,
                relatedDatasets: null,
                licenses: [],
                items: this.filters.items === 'Datasets' ? 'Datasets' : 'Applications',
                status: 'All',
                sortBy: 'relevance',
                page: 1,
            };
            this.filters = defaultFilters;
            this.$store.commit(SET_MARKETPLACE_FILTERS_OBJECT, this.filters);

            if (this.haveActiveFilters) {
                this.activeFilters = R.clone(this.filters);
                this.applyFilters();
            }
        },
        clearQuery() {
            this.queryFilters = {
                title: null,
                query: [],
                items: 'Datasets',
                sortBy: 'relevance',
                queryResultsType: 'Single Datasets',
                page: 1,
                loading: false,
            };
            this.$store.commit(SET_MARKETPLACE_QUERY_BUILDER_OBJECT, this.queryFilters);
            if (this.haveActiveQueryBuilderFilters) {
                this.activeQuery = [];
                this.applyFilters();
            }
        },
        toggleFilters() {
            this.clearQuery();
            if (this.editModeQuery) {
                this.editModeQuery = null;
            }
            if (this.marketplaceQueryBuilderVisible) {
                this.$store.commit(TOGGLE_MARKETPLACE_QUERY_BUILDER_VISIBLE, !this.marketplaceQueryBuilderVisible);
            }
            this.$store.commit(TOGGLE_MARKETPLACE_FILTERS_VISIBLE, !this.marketplaceFiltersVisible);
        },
        toggleQueryBuilder() {
            this.clearFilters();
            if (this.marketplaceFiltersVisible) {
                this.$store.commit(TOGGLE_MARKETPLACE_FILTERS_VISIBLE, !this.marketplaceFiltersVisible);
            }
            this.$store.commit(TOGGLE_MARKETPLACE_QUERY_BUILDER_VISIBLE, !this.marketplaceQueryBuilderVisible);
        },
        publishAnalytics(id, event) {
            UsageAnalytics.publish({
                event_type: event, // 'ASSET_UNSTARRED' or 'ASSET_STARRED'
                properties: {
                    asset_id: id,
                    asset_type: 'data_asset',
                    user_id: this.$store.state.user.id,
                    org_id: this.$store.state.organization.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});
        },
        changeState(id) {
            if (this.filters.items === 'Datasets') {
                if (this.favoriteItems.find((d) => d.id === id && d.item === 'dataset')) {
                    Favorites.unlike(id)
                        .then(() => {
                            this.favoriteItems = this.favoriteItems.filter((d) => d.id !== id && d.item !== 'dataset');
                            this.publishAnalytics(id, 'ASSET_UNSTARRED');
                        })
                        .catch(() => {
                            this.$toastr.e('The dataset could not be removed from Favorites due to an error.', 'Error');
                        });
                } else {
                    Favorites.like(id)
                        .then(() => {
                            this.favoriteItems.push({ id, item: 'dataset' });
                            this.publishAnalytics(id, 'ASSET_STARRED');
                        })
                        .catch(() => {
                            this.$toastr.e('The dataset could not be added to Favorites due to an error.', 'Error');
                        });
                }
            } else if (this.favoriteItems.find((a) => a.id === id && a.item === 'application')) {
                Favorites.unlikeApp(id)
                    .then(() => {
                        this.favoriteItems = this.favoriteItems.filter((d) => d.id !== id && d.item !== 'application');
                        this.publishAnalytics(id, 'ASSET_UNSTARRED');
                    })
                    .catch(() => {
                        this.$toastr.e('The application could not be removed from Favorites due to an error.', 'Error');
                    });
            } else {
                Favorites.likeApp(id)
                    .then(() => {
                        this.favoriteItems.push({ id, item: 'application' });
                        this.publishAnalytics(id, 'ASSET_STARRED');
                    })
                    .catch(() => {
                        this.$toastr.e('The application could not be added to Favorites due to an error.', 'Error');
                    });
            }
        },
        updateSearchQuery(searchQuery) {
            this.query = searchQuery;
            this.queryFilters.query = searchQuery;
        },
        createdQuery(query, queryId) {
            this.editModeQuery = queryId;
            this.queryFilters.query = query;
        },
        nextPageResults() {
            if (this.filters.items === 'Datasets') {
                if (this.haveActiveQueryBuilderFilters) {
                    this.applyQueryBuilder();
                } else {
                    this.applyFilters();
                }
            } else {
                this.applyFilters();
            }
        },
        retrieveItems() {
            // when datasets change to applications and vice-versa
            this.toggleQueryBuilder();
            this.toggleFilters();
            this.applyFilters();
        },
        searchItems() {
            if (this.filters.items === 'Datasets') {
                this.itemsOptions[1].disabled = true; // disable Applications button
                if (this.queryFilters.query.length) {
                    this.applyQueryBuilder();
                } else {
                    this.activeQuery = [];
                    this.applyFilters();
                }
            } else {
                this.itemsOptions[0].disabled = true; // disable Datasets button
                this.applyFilters();
            }
        },
        filterQueryResults() {
            this.queryFilters.page = 1;
            this.totalNumOfResults = 0;
            this.queryFilters.loading = true;
            this.applyQueryBuilder();
        },
        openComboExplanationModal(datasets) {
            this.comboDatasetInfo = datasets;
            this.$bvModal.show('comboExplanationModal');
        },
    },
};
</script>

<style lang="scss">
.marketplace {
    .search-header {
        justify-content: space-between;
        text-transform: none !important;
    }

    input {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
            sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        &::placeholder {
            font-size: 1rem;
            color: #848a90;
        }
    }

    .vue-treeselect--multi .vue-treeselect__input-container,
    .multiselect,
    .multiselect__input,
    .multiselect__single {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
            sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        font-size: 1rem;
    }

    .active-filters {
        display: flex;
        flex-wrap: wrap;
    }
    .paste-button {
        margin: 1px;
        padding: 0.25rem 0.6rem;
    }

    .dropdown-menu {
        min-width: 12rem;
    }
    .btn-warning {
        color: #ffffff !important;
    }
}
</style>
