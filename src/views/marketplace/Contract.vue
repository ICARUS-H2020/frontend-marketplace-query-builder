<template>
    <div class="contract">
        <page-title
            :title="description"
            :icon="'lnr-pencil icon-gradient bg-sunny-morning'"
            v-if="asset"
            :badge-text="badgeText"
            :badge-class="badgeClass"
            label
        >
            <div slot="actions" v-if="showActions && isOrgAdmin">
                <template v-if="isRequest">
                    <button
                        type="button"
                        class="btn btn-sm btn-hover-shine btn-icon btn-info mr-3"
                        @click="showUnlock(sendContract)"
                        :disabled="isDisabled"
                    >
                        <font-awesome-icon icon="paper-plane" class="btn-icon-wrapper" />
                        Send Contract
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm btn-hover-shine btn-icon btn-danger"
                        @click="declineRequest"
                    >
                        <font-awesome-icon icon="times" class="btn-icon-wrapper" />
                        Decline Request
                    </button>
                </template>
                <template v-if="isContract">
                    <template v-if="negotiating">
                        <button
                            type="button"
                            class="btn btn-sm btn-hover-shine btn-icon btn-info mr-3"
                            @click="showUnlock(negotiateContract)"
                            :disabled="isDisabled"
                        >
                            <font-awesome-icon icon="paper-plane" class="btn-icon-wrapper" />
                            Send Updated Contract
                        </button>
                    </template>

                    <template v-else>
                        <button
                            v-if="contract.stage === 'Negotiating'"
                            type="button"
                            class="btn btn-sm btn-hover-shine btn-icon btn-success mr-3"
                            @click="showUnlock(acceptOffer)"
                        >
                            <font-awesome-icon icon="check" class="btn-icon-wrapper" />
                            Accept Contract
                        </button>
                        <button
                            v-else
                            type="button"
                            class="btn btn-sm btn-hover-shine btn-icon btn-success mr-3"
                            @click="showUnlock(acceptContract)"
                        >
                            <font-awesome-icon icon="check" class="btn-icon-wrapper" />
                            Accept Contract
                        </button>
                        <button
                            type="button"
                            class="btn btn-sm btn-hover-shine btn-icon btn-warning text-white mr-3"
                            v-if="allowNegotiation"
                            @click="negotiating = true"
                        >
                            <font-awesome-icon icon="comments" class="btn-icon-wrapper" />
                            Negotiate
                        </button>
                    </template>
                    <button
                        v-if="contract.stage === 'Negotiating'"
                        type="button"
                        class="btn btn-sm btn-hover-shine btn-icon btn-danger"
                        @click="showUnlock(rejectOffer)"
                    >
                        <font-awesome-icon icon="times" class="btn-icon-wrapper" />
                        Reject Contract
                    </button>
                    <button
                        v-else
                        type="button"
                        class="btn btn-sm btn-hover-shine btn-icon btn-danger"
                        @click="showUnlock(rejectContract)"
                    >
                        <font-awesome-icon icon="times" class="btn-icon-wrapper" />
                        Reject Contract
                    </button>
                </template>
            </div>
        </page-title>

        <div class="row" v-if="ready">
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
        <div class="row mb-4" v-if="ready">
            <div :class="{ 'col-12': isOwnRequest, 'col-4': !isOwnRequest }">
                <div class="card card-border w-100">
                    <div class="card-header">Request Information</div>
                    <div class="card-body">
                        <div class="form-group">
                            <h6 class="label" v-if="quotation">
                                <span v-if="assetType === 'dataset'">Dataset:</span>
                                <span v-else-if="assetType === 'application'">Application:</span>
                                <span class="text-primary float-right">
                                    <router-link
                                        :to="{
                                            name:
                                                assetType === 'dataset'
                                                    ? 'assets.dataset'
                                                    : assetType === 'application'
                                                    ? 'assets.applications.detail'
                                                    : null,
                                            params: { id: asset.id },
                                        }"
                                        target="_blank"
                                    >
                                        {{ asset.name }}
                                    </router-link>
                                </span>
                            </h6>
                        </div>
                        <hr v-if="assetType === 'application'" />
                        <div class="form-group" v-if="assetType === 'application'">
                            <h6 class="label" v-if="quotation">
                                Description:
                            </h6>
                            <h6 class="text-primary label">
                                <p>{{ asset.description }}</p>
                            </h6>
                        </div>
                        <hr />
                        <div class="form-group">
                            <h6 class="label" v-if="quotation">
                                Organization:
                                <span class="text-primary float-right">
                                    <router-link
                                        :to="{
                                            name: 'organization',
                                            params: { id: quotation.organization_consumer.id },
                                        }"
                                        target="_blank"
                                    >
                                        {{ quotation.organization_consumer.name }}
                                    </router-link>
                                </span>
                            </h6>
                        </div>
                        <hr />
                        <div class="form-group">
                            <h6 class="label" v-if="quotation">
                                Usage Duration:
                                <span
                                    class="text-primary float-right"
                                    v-if="quotation.duration > 0 && quotation.duration <= 1100"
                                >
                                    {{ quotation.duration }} days
                                </span>
                                <span class="text-primary float-right" v-else>Forever</span>
                            </h6>
                        </div>
                        <div v-if="assetType === 'dataset'">
                            <hr />
                            <div class="form-group">
                                <h6 class="label" v-if="quotation">
                                    Updates Duration:
                                    <span
                                        class="text-primary float-right"
                                        v-if="quotation.updates_duration > 0 && quotation.updates_duration <= 1100"
                                    >
                                        {{ quotation.updates_duration }} days
                                    </span>
                                    <span class="text-primary float-right" v-else>Forever</span>
                                </h6>
                            </div>
                            <hr />
                            <div class="form-group">
                                <h6 class="label">Fields:</h6>
                                <div class="text-center">
                                    <div
                                        class="mb-1 mr-1 badge badge-primary"
                                        v-for="(field, idx) in contractFields"
                                        :key="idx"
                                    >
                                        {{ field }}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div class="form-group">
                                <h6 class="label">Filters:</h6>
                                <ul v-if="contractFilters.length > 0">
                                    <li v-for="(filter, idx) in contractFilters" :key="idx">
                                        <strong>{{ filter.split(':')[0] }}</strong>
                                        <br />
                                        <template v-if="filter.split(':')[1].includes('~')">
                                            From
                                            <div class="badge badge-alternate">
                                                {{ filter.split(':')[1].split('~')[0] }}
                                            </div>
                                            to
                                            <div class="badge badge-alternate">
                                                {{ filter.split(':')[1].split('~')[1] }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div
                                                class="mr-1 mb-1 badge badge-info"
                                                v-for="o in filter.split(':')[1].split(',')"
                                                :key="o"
                                            >
                                                {{ o }}
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <em class="text-muted">None</em>
                            </div>
                        </div>
                        <div v-else-if="assetType === 'application' && relatedDatasets.length > 0">
                            <hr />
                            <div class="form-group">
                                <h6 class="label">
                                    Related Datasets:
                                    <div class="text-primary">
                                        <div class="my-3 mr-1" v-for="(dataset, idx) in relatedDatasets" :key="idx">
                                            <router-link
                                                :to="{
                                                    name: 'assets.dataset',
                                                    params: { id: dataset.id },
                                                }"
                                                target="_blank"
                                            >
                                                {{ dataset.name }}
                                            </router-link>
                                            <span class="float-right" v-html="getType(dataset.open)" />
                                        </div>
                                    </div>
                                </h6>
                            </div>
                        </div>
                        <hr v-if="quotation && quotation.comments" />
                        <div class="form-group" v-if="quotation && quotation.comments">
                            <h6 class="label">Request Message:</h6>
                            <p class="text-primary" style="font-weight: 500;">{{ quotation.comments }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-8" v-if="!isOwnRequest">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="card card-border">
                            <div class="card-header">
                                Payment Details
                                <tooltip
                                    v-b-tooltip.hover="
                                        'The net price and associated VAT that is applied on the data asset and agreed among the data asset provider and consumer.'
                                    "
                                />
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-1 pt-2">
                                        <strong>Price:</strong>
                                    </div>
                                    <div class="col-3">
                                        <div class="input-group">
                                            <input
                                                placeholder="0"
                                                step="1"
                                                type="number"
                                                class="form-control text-center"
                                                v-model="price"
                                                :disabled="readOnly && !negotiating"
                                            />
                                            <div class="input-group-append">
                                                <b-dropdown :text="selectedCurrency" variant="light">
                                                    <b-dropdown-item
                                                        v-for="(option, idx) in currencies"
                                                        :key="idx"
                                                        :value="option"
                                                        :active="option === selectedCurrency"
                                                        @click="selectCurrency(option)"
                                                        :disabled="readOnly"
                                                    >
                                                        {{ option }}
                                                    </b-dropdown-item>
                                                </b-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-1 pt-2">
                                        <strong>VAT:</strong>
                                    </div>
                                    <div class="col-2">
                                        <div class="input-group">
                                            <input
                                                placeholder="0"
                                                step="1"
                                                type="number"
                                                class="form-control text-center"
                                                v-model="tax"
                                                :disabled="readOnly"
                                            />
                                            <div class="input-group-append">
                                                <span class="input-group-text">&nbsp;%&nbsp;</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="col-3 text-center text-danger"
                                        v-if="
                                            amountDiff &&
                                            contract.old_amount !== null &&
                                            (contract.stage === 'Negotiating' || contract.stage === 'Revision')
                                        "
                                    >
                                        <i>
                                            <div>Price {{ amountDiff }}.</div>
                                            Previous price was:
                                        </i>
                                        <strong class="ml-1">{{ contract.old_amount }}</strong>
                                    </div>
                                    <div class="col-2 pt-1" v-if="showPaymentActions && isOrgAdmin">
                                        <button
                                            type="button"
                                            class="btn btn-success btn-hover-shine btn-icon float-right"
                                            @click="showUnlock(markAsPaid)"
                                        >
                                            <font-awesome-icon icon="coins" class="btn-icon-wrapper" />
                                            Mark as Paid
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 mb-3">
                        <div class="card card-border">
                            <div class="card-header">
                                <div class="w-100 d-flex justify-content-between align-middle">
                                    <span class="align-middle pt-1 text-clear">
                                        Contract Terms
                                        <tooltip
                                            v-b-tooltip.hover="
                                                'The contract terms that concern the data asset acquisition between the data asset provider and consumer.'
                                            "
                                        />
                                    </span>
                                    <span class="pr-2 text-right align-middle" v-if="!readOnly">
                                        <b-dropdown
                                            class="contract-templates"
                                            variant="light"
                                            size="sm"
                                            :disabled="contractTemplates.length === 0"
                                            :text="selectedContractTemplate"
                                            right
                                        >
                                            <b-dropdown-item
                                                v-for="(contractTemplate, idx) in contractTemplates"
                                                :key="idx"
                                                :value="contractTemplate.name"
                                                :active="contractTemplate.name === selectedContractTemplate"
                                                @click="selectContractTemplate(contractTemplate)"
                                            >
                                                {{ contractTemplate.name }}
                                            </b-dropdown-item>
                                        </b-dropdown>
                                    </span>
                                    <span class="pr-2 align-middle" v-else>
                                        <b-button
                                            class="btn-icon mb-0 mt-0"
                                            id="downloadPDF"
                                            variant="info"
                                            size="sm"
                                            @click="downloadPDF"
                                        >
                                            <font-awesome-icon class="btn-icon-wrapper" icon="download" />
                                            Download as PDF
                                        </b-button>
                                    </span>
                                </div>
                            </div>
                            <div class="card-body">
                                <template v-if="readOnly && !negotiating">
                                    <vue-perfect-scrollbar
                                        class="scroll-area-lg"
                                        :settings="{ maxScrollbarLength: 50 }"
                                        v-once
                                    >
                                        <div
                                            v-html="terms"
                                            v-if="contract.stage !== 'Negotiating' && contract.stage !== 'Revision'"
                                        />
                                        <div v-html="termsDiff || terms" v-else />
                                    </vue-perfect-scrollbar>
                                </template>
                                <vue-editor v-model="terms" :editor-toolbar="toolbar" id="terms" v-else />
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="card card-border">
                            <div class="card-header">
                                <div class="w-100 d-flex justify-content-between align-middle">
                                    <span class="align-middle pt-1 text-clear">
                                        Platform Terms
                                        <tooltip
                                            v-b-tooltip.hover="
                                                'The terms that are enforced by the ICARUS platform in the specific data asset contract.'
                                            "
                                        />
                                    </span>
                                </div>
                            </div>
                            <div class="card-body">
                                <vue-perfect-scrollbar :settings="{ maxScrollbarLength: 50 }" v-once>
                                    In its current release, the ICARUS Platform does not impose any additional terms in
                                    comparison to the
                                    <a href="javascript:void(0)" @click="$bvModal.show('termsModal')">
                                        platform terms of use
                                    </a>
                                    .
                                </vue-perfect-scrollbar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <unlock-wallet-modal :id="'unlockWallet'" :callback="callback" />
        <progress-modal :message="message" />
        <create-wallet-modal />
        <import-wallet-modal />
        <terms-modal :hide-footer="true" />
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ethers } from 'ethers';
import { keccak256 } from 'js-sha3';
import { VueEditor } from 'vue2-editor';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import htmlDiff from 'htmldiff-js';
import { PageTitle, Tooltip } from '@/components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faCoins, faPaperPlane, faTimes, faDownload, faComments } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import toolbar from '@/config/toolbar';
import { Contract, DataAsset, Notifications, Organization, UsageAnalytics, Application } from '@/api';
import * as abi from '@/config/contracts-abi';
import UnlockWalletModal from '@/layouts/architect/components/modals/UnlockWalletModal.vue';
import ProgressModal from '@/layouts/architect/components/modals/ProgressModal.vue';
import CreateWalletModal from '@/layouts/architect/components/modals/CreateWalletModal.vue';
import ImportWalletModal from '@/layouts/architect/components/modals/ImportWalletModal.vue';
import TermsModal from '@/layouts/architect/components/modals/TermsModal.vue';
import { platformTerms } from '@/config/terms-of-use.json';
import useAsset from '../assets/assets';

library.add(faCheck, faCoins, faPaperPlane, faTimes, faDownload, faComments);

export default {
    name: 'Contract',
    components: {
        FontAwesomeIcon,
        PageTitle,
        VueEditor,
        VuePerfectScrollbar,
        UnlockWalletModal,
        ProgressModal,
        CreateWalletModal,
        ImportWalletModal,
        Tooltip,
        TermsModal,
    },
    props: {
        requestId: {
            type: Number,
            default: -1,
        },
        contractId: {
            type: Number,
            default: -1,
        },
        assetType: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            negotiating: false,
            amountDiff: null,
            termsDiff: null,

            contract: null,
            quotation: null,
            organization: null,
            asset: null,
            relatedDatasets: [],
            readOnly: false,

            terms: '',
            price: 0,
            tax: 0,
            currencies: ['EUR', 'USD', 'GBP'],
            selectedCurrency: 'EUR',
            description: 'Contract Request',
            toolbar,
            showPaymentActions: false,
            showActions: true,
            contractTemplates: [],
            selectedContractTemplate: 'Select Contract Template',
            ready: false,
            callback: () => ({}),
            message: '',
            platformTerms,
        };
    },
    computed: {
        ...mapState('eth', ['contractAddress'], ['organization']),
        ...mapGetters(['isOrgAdmin']),
        badgeText() {
            return this.contract ? this.contract.stage : '';
        },
        isOwnRequest() {
            return (
                this.isRequest &&
                this.quotation &&
                this.$store.state.organization.id === this.quotation.organization_consumer.id
            );
        },
        badgeClass() {
            if (this.contract) {
                switch (this.contract.stage) {
                    case 'Draft':
                        return 'badge-light';
                    case 'Rejected':
                        return 'badge-danger';
                    case 'Accepted':
                        return 'badge-info';
                    case 'Paid':
                        return 'badge-success';
                    case 'Negotiating':
                        return 'badge-warning';
                    case 'Revision':
                        return 'badge-primary';
                    default:
                        return 'badge-light';
                }
            }

            return '';
        },
        isContract() {
            return ~this.contractId;
        },
        isRequest() {
            return ~this.requestId;
        },
        isDisabled() {
            return (
                this.$store.state.eth.wallet === null ||
                !this.price ||
                this.terms.replace(/<[^>]*>?/gm, '').trim() === ''
            );
        },
        contractFields() {
            if (this.quotation && this.quotation.fields && this.quotation.fields.trim() !== '') {
                return this.quotation.fields.split(';');
            }

            return [];
        },
        contractFilters() {
            if (this.quotation && this.quotation.filters && this.quotation.filters.trim() !== '') {
                return this.quotation.filters.split(';');
            }

            return [];
        },
        allowNegotiation() {
            if (this.contract) {
                return (
                    (this.$store.state.organization.id === this.contract.organization_consumer.id &&
                        (this.contract.stage === 'Draft' || this.contract.stage === 'Revision')) ||
                    (this.$store.state.organization.id === this.contract.organization_owner.id &&
                        this.contract.stage === 'Negotiating')
                );
            }

            return false;
        },
    },
    async created() {
        const { getDataset, getVirtualDataset, getResult } = useAsset(this.checkDataset);

        if (~this.contractId) {
            const { data: contract } = await Contract.get(this.contractId);
            const { data: organization } = await Organization.get(contract.organization_consumer.id);
            let asset = null;
            if (this.assetType === 'dataset') {
                const { data: dataset } = await DataAsset.get(contract.data_asset.id);
                asset = dataset;
            } else if (this.assetType === 'application') {
                const { data: application } = await Application.get(contract.application.id);
                asset = application;
                if (
                    application.metadata &&
                    application.metadata.relatedDatasets &&
                    application.metadata.relatedDatasets.length > 0
                ) {
                    application.metadata.relatedDatasets.forEach(async (relatedDataset) => {
                        if (relatedDataset.id && relatedDataset.type === 'dataset') {
                            await getDataset(relatedDataset.id);
                        } else if (relatedDataset.id && relatedDataset.type === 'virtual_dataset') {
                            await getVirtualDataset(relatedDataset.id);
                        } else if (relatedDataset.id && relatedDataset.type === 'result') {
                            await getResult(relatedDataset.id);
                        }
                    });
                }
            }

            if (contract.amount !== null && contract.old_amount !== null) {
                if (contract.amount > contract.old_amount) {
                    this.amountDiff = 'increased';
                } else if (contract.amount < contract.old_amount) {
                    this.amountDiff = 'decreased';
                }
            }
            if (contract.terms && contract.old_terms) {
                if (contract.old_terms[0] === '"' && contract.old_terms[contract.old_terms.length - 1] === '"') {
                    contract.old_terms = contract.old_terms.substring(1, contract.old_terms.length - 1);
                }
                this.termsDiff = htmlDiff.execute(contract.old_terms, contract.terms);
            }

            if (contract.stage === 'Draft' && contract.old_amount !== null && contract.old_terms !== null) {
                contract.stage = 'Revision';
            }

            // Only allow if user organization is the consumer && stage = Draft or provider and stage = Accepted
            if (
                this.$store.state.organization.id === contract.organization_consumer.id ||
                this.$store.state.organization.id === contract.organization_owner.id
            ) {
                this.contract = contract;
                this.asset = asset;
                this.organization = organization;

                this.price = contract.amount;
                this.tax = contract.tax;
                this.selectedCurrency = contract.currency;
                this.terms = contract.terms;
                this.quotation = {
                    fields: contract.fields,
                    filters: contract.filters,
                    duration: contract.duration,
                    updates_duration: contract.updates_duration,
                    organization_consumer: contract.organization_consumer,
                };

                this.description = 'Contract Overview';
                switch (contract.stage) {
                    case 'Draft':
                    case 'Revision':
                        this.showActions = this.$store.state.organization.id === this.contract.organization_consumer.id;
                        this.showPaymentActions = false;
                        this.readOnly = true;
                        break;
                    case 'Accepted':
                        this.showActions = false;
                        this.showPaymentActions =
                            this.$store.state.organization.id === this.contract.organization_owner.id;
                        this.readOnly = true;
                        break;
                    case 'Paid':
                        this.readOnly = true;
                        this.showPaymentActions = false;
                        this.showActions = false;
                        break;
                    case 'Negotiating':
                        this.readOnly = true;
                        this.showPaymentActions = false;
                        this.showActions = this.$store.state.organization.id === this.contract.organization_owner.id;
                        break;
                    case 'Rejected':
                        this.showActions = false;
                        this.showPaymentActions = false;
                        this.readOnly = true;
                        break;
                    default:
                        this.readOnly = true;
                        this.showPaymentActions = false;
                        this.showActions = false;
                    // Do Nothing
                }
            } else {
                this.$router.push({ name: 'assets.contracts' });
                this.$toastr.e('Forbidden!');
            }
        } else if (~this.requestId) {
            const { data: quotation } = await Contract.quotation(this.requestId);
            const { data: organization } = await Organization.get(quotation.organization_consumer.id);
            let contractTemplates = [];
            if (this.isOrgAdmin) {
                const { data: templates } = await Contract.getAllTemplates();
                contractTemplates = templates;
            }

            // Only allow if user organization is the provider or consumer
            if (
                this.$store.state.organization.id !== quotation.organization_owner.id &&
                this.$store.state.organization.id !== quotation.organization_consumer.id
            ) {
                this.$router.push({ name: 'assets.contracts' });
                this.$toastr.e('Forbidden!');
            }

            this.readOnly = this.$store.state.organization.id === quotation.organization_consumer.id;
            this.showActions = this.$store.state.organization.id === quotation.organization_owner.id;
            this.showPaymentActions = false;

            this.organization = organization;
            if (quotation.request === true) {
                // Check that request is not already accepted
                this.$router.push({ name: 'assets.contracts' });
                this.$toastr.e('Contract already sent!');
            } else if (quotation.request === false) {
                // Check that request is not already rejected
                this.$router.push({ name: 'assets.contracts' });
                this.$toastr.e('Request already rejected!');
            } else {
                let asset = null;
                if (this.assetType === 'dataset') {
                    const { data: dataset } = await DataAsset.get(quotation.data_asset.id);
                    asset = dataset;
                } else if (this.assetType === 'application') {
                    const { data: application } = await Application.get(quotation.application.id);
                    asset = application;
                    if (
                        application.metadata &&
                        application.metadata.relatedDatasets &&
                        application.metadata.relatedDatasets.length > 0
                    ) {
                        application.metadata.relatedDatasets.forEach(async (relatedDataset) => {
                            if (relatedDataset.id && relatedDataset.type === 'dataset') {
                                await getDataset(relatedDataset.id);
                            } else if (relatedDataset.id && relatedDataset.type === 'virtual_dataset') {
                                await getVirtualDataset(relatedDataset.id);
                            } else if (relatedDataset.id && relatedDataset.type === 'result') {
                                await getResult(relatedDataset.id);
                            }
                        });
                    }
                }

                if (asset.metadata && asset.metadata.calculationScheme === 'Fixed per Data Asset') {
                    this.price = asset.metadata.amount;
                    this.selectedCurrency = asset.metadata.currency;
                } else if (asset.metadata && asset.metadata.calculationScheme === 'Fixed per Row') {
                    if (quotation.filters && quotation.filters !== '') {
                        const payload = {
                            collectionId: asset.id,
                            filters: [],
                        };
                        const requestFilters = quotation.filters.split(';');
                        requestFilters.forEach((filter) => {
                            const filterSplit = filter.split(':');
                            if (filterSplit.length === 2) {
                                const fromTo = filterSplit[1].split('~');
                                if (fromTo.length === 2) {
                                    payload.filters.push({
                                        field: filterSplit[0],
                                        filter: {
                                            from: fromTo[0],
                                            to: fromTo[1],
                                        },
                                    });
                                }
                            }
                        });
                        const { data: requestRows } = await Contract.getRequestRows(payload);
                        this.price = asset.metadata.amount * requestRows.rows_count;
                    } else {
                        this.price = asset.metadata.amount * asset.metadata.final_cleaning_number_of_rows;
                    }
                    this.selectedCurrency = asset.metadata.currency;
                }

                this.quotation = quotation;
                this.asset = asset;
                this.contractTemplates = contractTemplates;
                this.contractTemplates.forEach((template) => {
                    if (template.is_default) {
                        this.selectContractTemplate(template);
                    }
                });
            }
        } else {
            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.e('Contract/Request not found!');
        }
        this.ready = true;
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
        selectCurrency(option) {
            this.selectedCurrency = option;
        },
        selectContractTemplate(option) {
            if (this.terms.replace(/<[^>]*>?/gm, '').trim() !== '') {
                this.$swal({
                    title: 'Loading this template will discard current contract terms. Are you sure?',
                    text: 'This action cannot be undone',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d92550',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                }).then(async (result) => {
                    if (result.value) {
                        this.terms = option.terms;
                        this.selectedContractTemplate = option.name;
                    }
                });
            } else {
                this.terms = option.terms;
                this.selectedContractTemplate = option.name;
            }
        },
        showUnlock(callback) {
            this.callback = callback;
            this.$bvModal.show('unlockWallet');
        },
        async sendContract(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');
            // Connect to contract
            const icarusCore = new ethers.Contract(this.contractAddress, abi.core, myWallet);

            let contractAssetType = 0;
            let contractRelatedDatasets = '';
            if (this.assetType === 'application') {
                contractAssetType = 1;
                this.relatedDatasets.forEach((rd, index) => {
                    contractRelatedDatasets += `${rd.id},${rd.name}`;
                    if (index < this.asset.metadata.relatedDatasets.length - 1) {
                        contractRelatedDatasets += ',';
                    }
                });
            }

            // Create smart contract
            this.message = 'Creating Smart Contract...';
            const tx = await icarusCore.createContract(
                `0x${this.organization.ethaddress}`, // Consumer Address
                keccak256.array(`${this.organization.id}${this.asset.id}`), // Hash of asset, prefixed with consumer id
                this.quotation.fields,
                this.quotation.filters,
                this.quotation.duration,
                this.quotation.updates_duration,
                keccak256.array(this.terms), // Hash of terms
                keccak256.array(this.platformTerms), // Hash of platform terms
                contractAssetType, // 0 for Dataset, 1 for Application
                contractRelatedDatasets, // Application's related datasets
                { gasLimit: 4700000 },
            );

            // Wait for contract to be mined and get its address
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while...';
            const receipt = await tx.wait();
            const contractCreated = receipt.events.pop();
            const contractAddress = contractCreated.args[0];

            // Create the equivalent contract to platform
            this.message = 'Saving to ICARUS database';
            const payload = {
                amount: this.price,
                contract_address: contractAddress,
                data_consumer_id: this.quotation.organization_consumer.id,
                data_provider_id: this.quotation.organization_owner.id,
                fields: this.quotation.fields,
                filters: this.quotation.filters,
                tax: this.tax,
                terms: this.terms,
                currency: this.selectedCurrency,
                duration: this.quotation.duration,
                updates_duration: this.quotation.updates_duration,
                buy_asset_id: this.requestId,
            };

            let contract = null;
            if (this.assetType === 'dataset') {
                payload.asset_id = this.asset.id;
                const { data } = await Contract.create(payload);
                contract = data;
            } else if (this.assetType === 'application') {
                payload.application_id = this.asset.id;
                const { data } = await Contract.createApplicationContract(payload);
                contract = data;
            }

            await Notifications.publish({
                eventType: 'CONTRACT_OFFERED',
                properties: {
                    targetId: contract.id,
                    assetId: this.asset.id,
                    targetType: 'contract',
                    applicantId: contract.organization_consumer.id,
                    ownerId: contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            await UsageAnalytics.publish({
                event_type: 'CONTRACT_OFFERED',
                properties: {
                    asset_request_id: this.requestId,
                    asset_id: this.asset.id,
                    asset_type: 'data_asset',
                    org_applicant_id: contract.organization_consumer.id,
                    org_owner_id: contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            // Mark request as accepted
            await Contract.acceptRequest(this.requestId);

            // Redirect to home
            this.$bvModal.hide('progressModal');
            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.s('Contract created successfully', 'Success');
        },
        async declineRequest() {
            await Contract.rejectRequest(this.requestId);

            await UsageAnalytics.publish({
                event_type: 'ASSET_REQUEST_REJECTED',
                properties: {
                    asset_request_id: this.requestId,
                    asset_id: this.asset.id,
                    asset_type: 'data_asset',
                    org_applicant_id: this.quotation.organization_consumer.id,
                    org_owner_id: this.quotation.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            await Notifications.publish({
                eventType: 'REQUEST_REJECTED',
                properties: {
                    targetId: this.requestId,
                    assetId: this.asset.id,
                    targetType: 'buy-asset',
                    applicantId: this.quotation.organization_consumer.id,
                    ownerId: this.quotation.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.e('Contract request rejected');
        },
        async acceptContract(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');

            const icarusContract = new ethers.Contract(this.contract.contract_address, abi.contract, myWallet);
            this.message = 'Accepting Smart Contract...';
            const tx = await icarusContract.acceptContract({ gasLimit: 4700000 });

            // Wait for contract to be mined
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while...';
            await tx.wait();

            // Reject contract to platform
            this.message = 'Saving to ICARUS database';
            await Contract.acceptContract(this.contractId);

            await Notifications.publish({
                eventType: 'CONTRACT_ACCEPTED',
                properties: {
                    targetId: this.contractId,
                    assetId: this.asset.id,
                    targetType: 'contract',
                    applicantId: this.contract.organization_consumer.id,
                    ownerId: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            await UsageAnalytics.publish({
                event_type: 'CONTRACT_ACCEPTED',
                properties: {
                    asset_request_id: this.requestId,
                    asset_id: this.asset.id,
                    asset_type: 'data_asset',
                    org_applicant_id: this.contract.organization_consumer.id,
                    org_owner_id: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            // Redirect to home
            this.$bvModal.hide('progressModal');
            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.s('Contract accepted', 'Success');
        },
        async acceptOffer(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');

            const icarusContract = new ethers.Contract(this.contract.contract_address, abi.contract, myWallet);
            this.message = 'Accepting Smart Contract...';
            const tx = await icarusContract.acceptOffer({ gasLimit: 4700000 });

            // Wait for contract to be mined
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while...';
            await tx.wait();

            // Reject contract to platform
            this.message = 'Saving to ICARUS database';
            await Contract.acceptOffer(this.contractId);

            await Notifications.publish({
                eventType: 'CONTRACT_OFFER_ACCEPTED',
                properties: {
                    targetId: this.contractId,
                    assetId: this.asset.id,
                    targetType: 'contract',
                    applicantId: this.contract.organization_consumer.id,
                    ownerId: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            // Redirect to home
            this.$bvModal.hide('progressModal');
            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.s('Contract accepted', 'Success');
        },
        async negotiateContract(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');

            const icarusContract = new ethers.Contract(this.contract.contract_address, abi.contract, myWallet);
            this.message = 'Writing updated Smart Contract...';
            let tx = null;
            if (this.$store.state.organization.id === this.contract.organization_consumer.id) {
                tx = await icarusContract.negotiate(keccak256.array(this.terms), { gasLimit: 4700000 });
            } else {
                tx = await icarusContract.counterOffer(keccak256.array(this.terms), { gasLimit: 4700000 });
            }

            // Wait for contract to be mined
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while';
            await tx.wait();

            // Negotiate contract to platform
            this.message = 'Saving updated contract to ICARUS database';
            const data = { terms: this.terms, amount: this.price };
            let counter = false;
            if (this.$store.state.organization.id === this.contract.organization_consumer.id) {
                // We are consumer, so we negotiate the offered contract
                await Contract.negotiateContract(this.contractId, data);
            } else {
                // We are providers/owners, so we make a counter offer
                await Contract.counterOffer(this.contractId, data);
                counter = true;
            }

            await Notifications.publish({
                eventType: counter ? 'CONTRACT_COUNTERED' : 'CONTRACT_NEGOTIATED',
                properties: {
                    targetId: this.contractId,
                    assetId: this.asset.id,
                    targetType: 'contract',
                    applicantId: this.contract.organization_consumer.id,
                    ownerId: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            await UsageAnalytics.publish({
                eventType: counter ? 'CONTRACT_COUNTERED' : 'CONTRACT_NEGOTIATED',
                properties: {
                    assetRequestId: this.requestId,
                    assetId: this.asset.id,
                    assetType: 'data_asset',
                    orgApplicantId: this.contract.organization_consumer.id,
                    orgOwnerId: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            // Redirect to home
            this.$bvModal.hide('progressModal');
            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.s('Updated contract submited', 'Success');
        },
        async rejectContract(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');

            const icarusContract = new ethers.Contract(this.contract.contract_address, abi.contract, myWallet);
            this.message = 'Rejecting Smart Contract...';
            const tx = await icarusContract.rejectContract({ gasLimit: 4700000 });

            // Wait for contract to be mined
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while...';
            await tx.wait();

            // Reject contract to platform
            this.message = 'Saving to ICARUS database';
            await Contract.rejectContract(this.contractId);

            await Notifications.publish({
                eventType: 'CONTRACT_REJECTED',
                properties: {
                    targetId: this.contractId,
                    assetId: this.asset.id,
                    targetType: 'contract',
                    applicantId: this.contract.organization_consumer.id,
                    ownerId: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            await UsageAnalytics.publish({
                event_type: 'CONTRACT_REJECTED',
                properties: {
                    asset_request_id: this.requestId,
                    asset_id: this.asset.id,
                    asset_type: 'data_asset',
                    org_applicant_id: this.contract.organization_consumer.id,
                    org_owner_id: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            // Redirect to home
            this.$bvModal.hide('progressModal');
            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.s('Contract rejected', 'Success');
        },
        async rejectOffer(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');

            const icarusContract = new ethers.Contract(this.contract.contract_address, abi.contract, myWallet);
            this.message = 'Rejecting Smart Contract...';
            const tx = await icarusContract.rejectOffer({ gasLimit: 4700000 });

            // Wait for contract to be mined
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while...';
            await tx.wait();

            // Reject contract to platform
            this.message = 'Saving to ICARUS database';
            await Contract.rejectOffer(this.contractId);

            await Notifications.publish({
                eventType: 'CONTRACT_OFFER_REJECTED',
                properties: {
                    targetId: this.contractId,
                    assetId: this.asset.id,
                    targetType: 'contract',
                    applicantId: this.contract.organization_consumer.id,
                    ownerId: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            // Redirect to home
            this.$bvModal.hide('progressModal');
            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.s('Contract rejected', 'Success');
        },
        async markAsPaid(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');

            const icarusContract = new ethers.Contract(this.contract.contract_address, abi.contract, myWallet);
            this.message = 'Marking as Paid...';
            const tx = await icarusContract.contractPaid({ gasLimit: 4700000 });

            // Wait for contract to be mined
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while...';
            await tx.wait();

            // Reject contract to platform
            this.message = 'Saving to ICARUS database';
            await Contract.contractPaid(this.contractId);

            await Notifications.publish({
                eventType: 'CONTRACT_PAID',
                properties: {
                    targetId: this.contractId,
                    assetId: this.asset.id,
                    targetType: 'contract',
                    applicantId: this.contract.organization_consumer.id,
                    ownerId: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            await UsageAnalytics.publish({
                event_type: 'CONTRACT_PAID',
                properties: {
                    asset_request_id: this.requestId,
                    asset_id: this.asset.id,
                    asset_type: 'data_asset',
                    org_applicant_id: this.contract.organization_consumer.id,
                    org_owner_id: this.contract.organization_owner.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});

            // Redirect to home
            this.$bvModal.hide('progressModal');
            this.$router.push({ name: 'assets.contracts' });
            this.$toastr.s('Contract marked as Paid', 'Success');
        },
        async downloadPDF() {
            const { data: pdf } = await Contract.getPDF(this.contractId);
            const fileURL = window.URL.createObjectURL(new Blob([pdf]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            let contractName = '';
            if (this.contract.data_asset) {
                contractName = this.contract.data_asset.name;
            } else if (this.contract.application) {
                contractName = this.contract.application.name;
            }
            fileLink.setAttribute('download', `${contractName} Contract.pdf`);
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
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
    .quillWrapper .ql-snow.ql-toolbar {
        background-color: var(--light);
    }

    #terms {
        height: 38vh;
    }

    h6.label {
        font-size: 0.9rem;
        font-weight: 600;
    }
    .input-group-text {
        font-size: 0.8rem;
        font-weight: 500;
        background-color: var(--light);
    }

    .input-group-append .btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .ql-align-justify {
        margin-bottom: 0;
    }

    .ql-align-center {
        text-align: center;
    }
    .contract-templates {
        text-transform: none;
    }
    .download {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    ins {
        background-color: #e6ffe6;
        text-decoration: none;
    }
    del {
        background-color: #ffe6e6;
        text-decoration: line-through;
        color: #555;
    }
}
</style>
