<template>
    <div class="contract" v-if="asset">
        <page-title :title="asset.name" :icon="'lnr-bubble icon-gradient bg-sunny-morning'">
            <template slot="actions">
                <button
                    type="button"
                    class="btn btn-sm btn-hover-shine btn-icon btn-transition btn-info text-white"
                    @click="$bvModal.show('requestQuotationModal')"
                    :disabled="
                        (assetType == 'dataset' && contract.fields.length == 0) || $store.state.eth.wallet === null
                    "
                >
                    <font-awesome-icon icon="paper-plane" class="mr-1" />
                    Request Quotation
                </button>
            </template>
        </page-title>

        <div class="row">
            <div class="col-12">
                <b-alert
                    variant="danger"
                    :show="$store.state.eth.wallet === null && organization && organization.id !== 1"
                >
                    <font-awesome-icon icon="exclamation-triangle" class="mr-1" />
                    Your organization has no linked Ethereum wallet.
                    <template v-if="isOrgAdmin">
                        You can
                        <a href="javascript:void(0)" @click="$bvModal.show('importWallet')">import</a>
                        an existing wallet, or
                        <a href="javascript:void(0)" @click="$bvModal.show('createWallet')">create</a>
                        a new one.
                    </template>
                    <template v-else>
                        Ask your organization manager to login and create or import an existing one.
                    </template>
                </b-alert>
            </div>
        </div>
        <div class="row mb-4" v-if="assetType === 'dataset' && columns">
            <div class="col-12">
                <div class="card card-border">
                    <div class="card-header d-flex justify-content-between">
                        <div>Select Data</div>
                        <div class="clear-style pt-1">
                            <div class="badge badge-alternate">
                                <font-awesome-icon class="text-white" icon="broom" />
                            </div>
                            <span class="ml-1" style="line-height: 2;">Cleaned</span>
                            <div class="badge badge-primary ml-4">
                                <font-awesome-icon class="text-white" icon="user-secret" />
                            </div>
                            <span class="ml-1" style="line-height: 2;">Anonymized</span>
                            <div class="badge badge-success ml-4">
                                <font-awesome-icon class="text-white" icon="lock" />
                            </div>
                            <span class="ml-1" style="line-height: 2;">Encrypted</span>
                        </div>
                        <div>
                            <button type="button" class="btn btn-outline-primary btn-sm mr-2" @click="selectAll">
                                Select All
                            </button>
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="selectNone">
                                Select None
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive" style="height: 650px;">
                            <table class="mb-0 table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th width="5%"></th>
                                        <th width="25%">Concept Name</th>
                                        <th width="40%">Description</th>
                                        <th width="30%">Filter</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <column-row
                                        v-for="(column, idx) in columns"
                                        :key="idx"
                                        :column="column"
                                        v-model="contract.fields"
                                        :fields-info="asset.metadata.fieldsInfo"
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-4" v-else-if="assetType === 'application'">
            <div class="col-12">
                <div class="card card-border">
                    <div class="card-header d-flex justify-content-between">
                        <div>Description</div>
                    </div>
                    <div class="card-body p-0">
                        <h6 class="px-4 py-3 text-primary label" style="height: 90px;">
                            {{ asset.description }}
                        </h6>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card card-border">
                    <div class="card-header d-flex justify-content-between">
                        <div>Related Datasets</div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive" style="height: 500px;">
                            <table class="mb-0 table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th class="text-center" width="5%">#</th>
                                        <th width="80%">Name</th>
                                        <th class="text-center" width="15%">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(dataset, idx) in relatedDatasets" :key="dataset.id">
                                        <td class="text-center" width="5%">{{ idx + 1 }}</td>
                                        <td width="80%">
                                            <router-link
                                                :to="{
                                                    name: 'assets.dataset',
                                                    params: { id: dataset.id },
                                                }"
                                                target="_blank"
                                            >
                                                <h6 class="text-primary label">{{ dataset.name }}</h6>
                                            </router-link>
                                        </td>
                                        <td class="text-center" v-html="getType(dataset.open)" width="15%"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <b-modal
            id="requestQuotationModal"
            variant="primary"
            size="lg"
            header-bg-variant="primary"
            header-text-variant="light"
            title="Request Quotation"
        >
            <b-form-group label="Duration of use">
                <b-form-radio-group
                    id="duration"
                    v-model="contract.duration"
                    :options="availableDurations"
                    name="durationRadios"
                    @change="contract.updates_duration = null"
                />
            </b-form-group>

            <b-form-group label="Included updates" v-if="assetType === 'dataset'">
                <b-form-radio-group
                    id="updatesDuration"
                    v-model="contract.updates_duration"
                    :options="availableUpdatesDurations"
                    name="updatesDurationRadios"
                    v-validate="'required'"
                />
                <div class="invalid-feedback" v-if="errors.has('updatesDurationRadios')">
                    This field is required.
                </div>
            </b-form-group>

            <b-form-group label="Request Message">
                <b-form-textarea
                    id="requestMessage"
                    v-model="contract.comments"
                    placeholder="Add any additional information you want to send to the data provider (i.e. how you plan to use the data, additional terms, etc) that might affect price and data availability."
                    rows="8"
                    no-resize
                ></b-form-textarea>
            </b-form-group>
            <template slot="modal-footer">
                <button
                    type="button"
                    @click="$bvModal.hide('requestQuotationModal')"
                    class="btn btn-wide btn-secondary btn-sm btn-shadow float-right"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    @click="requestQuotation"
                    class="btn btn-wide btn-primary btn-sm btn-shadow text-white float-right"
                    v-if="!isSaving"
                >
                    Send Request
                </button>
                <button type="button" class="btn btn-primary btn-sm btn-shadow text-white float-right" v-else disabled>
                    <b-spinner small></b-spinner>
                    &nbsp;
                    <span>
                        Sending Request
                    </span>
                </button>
            </template>
        </b-modal>

        <create-wallet-modal />
        <import-wallet-modal />
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { assoc, clone, head, keys } from 'ramda';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFilter, faPaperPlane, faBroom, faUserSecret, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ColumnRow from '@/views/marketplace/ColumnRow.vue';
import { Contract, DataAsset, Application, Notifications, UsageAnalytics } from '@/api';
import { PageTitle } from '@/components';
import CreateWalletModal from '@/layouts/architect/components/modals/CreateWalletModal.vue';
import ImportWalletModal from '@/layouts/architect/components/modals/ImportWalletModal.vue';
import useAsset from '../assets/assets';

const R = { assoc, clone, head, keys };
library.add(faFilter, faPaperPlane, faBroom, faUserSecret, faLock);

export default {
    name: 'RequestQuotation',
    components: { ColumnRow, FontAwesomeIcon, PageTitle, CreateWalletModal, ImportWalletModal },
    props: {
        assetId: {
            type: [Number, String],
            required: true,
        },
        assetType: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            asset: null,
            contract: {
                fields: [],
                duration: 1000000,
                updates_duration: 1000000,
                comments: '',
                filters: [],
            },
            availableDurations: [
                { text: '1 Month', value: 30 },
                { text: '3 Months', value: 90 },
                { text: '6 Months', value: 180 },
                { text: '1 Year', value: 365 },
                { text: '2 Years', value: 730 },
                { text: '3 Years', value: 1095 },
                { text: 'Forever', value: 1000000 },
            ],
            columns: [],
            relatedDatasets: [],
            isSaving: false,
        };
    },
    computed: {
        ...mapState(['model', 'organization']),
        ...mapGetters(['flatModel', 'isOrgAdmin']),
        availableUpdatesDurations() {
            return [
                { text: '1 Month', value: 30 },
                { text: '3 Months', value: 90, disabled: this.contract.duration < 90 },
                { text: '6 Months', value: 180, disabled: this.contract.duration < 180 },
                { text: '1 Year', value: 365, disabled: this.contract.duration < 365 },
                { text: '2 Years', value: 730, disabled: this.contract.duration < 730 },
                { text: '3 Years', value: 1095, disabled: this.contract.duration < 1095 },
                { text: 'Forever', value: 1000000, disabled: this.contract.duration < 1000000 },
            ];
        },
    },
    async created() {
        if (!this.assetId || (this.assetType !== 'dataset' && this.assetType !== 'application')) {
            this.$router.push({ name: 'home' });
            this.$toastr.e('You are not allowed to do this!');
        } else if (this.organization.id === 1) {
            this.$toastr.e('Your organization is not allowed to buy assets!');
            this.$router.go(-1);
        }

        const { getDataset, getVirtualDataset, getResult } = useAsset(this.checkDataset);

        try {
            if (this.assetType === 'dataset') {
                const { data } = await DataAsset.get(this.assetId);
                this.asset = data;
            } else {
                const { data } = await Application.get(this.assetId);
                this.asset = data;
                this.asset.metadata.relatedDatasets.forEach(async (relatedDataset) => {
                    if (relatedDataset.id && relatedDataset.type === 'dataset') {
                        await getDataset(relatedDataset.id);
                    } else if (relatedDataset.id && relatedDataset.type === 'virtual_dataset') {
                        await getVirtualDataset(relatedDataset.id);
                    } else if (relatedDataset.id && relatedDataset.type === 'result') {
                        await getResult(relatedDataset.id);
                    }
                });
            }

            if (this.asset.organization.id === this.organization.id) {
                this.$toastr.e('This asset is owned by your organization!');
                this.$router.go(-1);
            } else if (this.asset.status === null || this.asset.status === 'Confidential') {
                this.$toastr.e('This asset is confidential!');
                this.$router.go(-1);
            } else if (this.asset.status === 'Public') {
                this.$toastr.e('You cannot buy open data');
                this.$router.go(-1);
            }

            if (this.assetType === 'dataset') {
                const fields = R.keys(R.head(this.asset.sample));
                let field = null;
                fields.sort();
                fields.forEach((name) => {
                    if (name === 'undefined') return;
                    if (name.includes('_')) {
                        field = name.substring(0, name.indexOf('_'));
                    } else {
                        field = name;
                    }
                    const column = {
                        name,
                        definition: '',
                        type: null,
                        facet: null,
                        filter: null,
                    };
                    if (this.flatModel && this.flatModel[field]) {
                        column.definition = this.flatModel[field].definition;
                        column.type = this.flatModel[field].type;
                        column.facet = this.flatModel[field].facet;
                    }
                    this.columns.push(column);
                    this.contract.fields.push(name);
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                this.$toastr.e('Forbidden');
            } else {
                this.$toastr.e('An error has occured');
            }
            this.$router.push({ name: 'home' });
        }
    },
    methods: {
        checkDataset(dataset) {
            if (dataset) {
                let open = false;
                if (dataset.organization.id === 1 || dataset.status === 'Public') {
                    open = true;
                }
                if (!this.relatedDatasets.find((rd) => rd.id === dataset.id)) {
                    this.relatedDatasets.push({
                        id: dataset.id,
                        name: dataset?.name,
                        open,
                    });
                }
            }
        },
        selectAll() {
            this.contract.fields.splice(0, this.fields.length, ...R.keys(R.head(this.asset.sample)));
        },
        selectNone() {
            this.contract.fields.splice(0, this.contract.fields.length);
        },
        async requestQuotation(event) {
            event.preventDefault();
            this.isSaving = true;
            const success = await this.$validator.validateAll();
            if (success) {
                const contract = R.clone(this.contract);
                this.columns.forEach((c) => {
                    if (c.filter) {
                        if (c.type === 'datetime') {
                            contract.filters.push(`${c.name}:${c.filter.join('~')}`);
                        }
                    }
                });
                if (this.assetType === 'dataset') {
                    contract.asset_id = this.asset.id;
                } else {
                    contract.application_id = this.asset.id;
                }
                contract.fields = contract.fields.join(';');
                contract.filters = contract.filters.join(';');
                contract.data_owner_id = this.asset.organization.id;
                contract.data_consumer_id = this.$store.state.organization.id;

                const { data } = await Contract.requestQuotation(contract);
                await Notifications.publish({
                    eventType: 'REQUEST',
                    properties: {
                        targetId: data.id,
                        assetId: contract.asset_id,
                        targetType: 'buy-asset',
                        applicantId: contract.data_consumer_id,
                        ownerId: contract.data_owner_id,
                    },
                    timestamp: Math.floor(Date.now() / 1000),
                }).catch(() => {});

                await UsageAnalytics.publish({
                    event_type: 'ASSET_REQUESTED',
                    properties: {
                        asset_request_id: data.id,
                        asset_id: contract.asset_id,
                        asset_type: 'buy-asset',
                        org_applicant_id: contract.data_consumer_id,
                        org_owner_id: contract.data_owner_id,
                    },
                    timestamp: Math.floor(Date.now() / 1000),
                }).catch(() => {});

                this.isSaving = false;
                this.$toastr.s('Request sent');
                this.$router.push({ name: 'home' });
            }
            this.isSaving = false;
        },
        getType(open) {
            if (open) {
                return '<div class="badge badge-success">Open</div>';
            }
            return `<div class="badge badge-alternate">Organization's</div>`;
        },
    },
};
</script>

<style lang="scss">
.contract {
    .clear-style {
        text-transform: none;
        font-weight: normal;
    }
    .modal-dialog {
        margin-top: 80px !important;
    }
    .vue-treeselect--has-value .vue-treeselect__multi-value {
        margin-left: 5px;
    }
    .vue-treeselect__multi-value-item {
        background-color: #16aaff;
        color: #ffffff;
    }
    .vue-treeselect__multi-value-label {
        padding-left: 8px;
    }
    .vue-treeselect__value-remove {
        border-left: 0;
        color: darken(#16aaff, 30%);
    }
    .narrow-padding {
        padding: 0.27rem 0.55rem;
    }
    .mx-calendar-icon {
        height: 20px;
    }
}
</style>
