<template>
    <div>
        <div class="loading-indicator" v-if="isLoading">
            <Spinner name="wave" color="var(--primary)" no-fade-in />
            <h6 class="message">Loading application. Please wait...</h6>
        </div>
        <div class="application" v-else>
            <div
                class="mb-3 card header"
                :class="{ 'default-bg-image': !hasImage }"
                :style="{ 'background-image': getImageUrl() }"
            >
                <div class="overlay"></div>
                <div class="no-gutters row">
                    <div class="col-sm-12 col-md-12 col-xl-12 content">
                        <h1>{{ application.name }}</h1>
                        <div class="widget-content p-0 widget-wrapper">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left mr-3">
                                    <div class="avatar-icon-wrapper mt-1">
                                        <div class="avatar-icon organization-icon">
                                            <img :src="orgLogo" alt v-if="hasLogoImage" />
                                            <img src="@/assets/images/org_logo.png" alt="" v-else />
                                        </div>
                                    </div>
                                </div>
                                <div class="widget-content-left">
                                    <div class="widget-heading">{{ application.organization.name }}</div>
                                </div>
                                <div class="widget-content-right">
                                    <div class="button-wrapper">
                                        <b-button
                                            class="btn-hover-shine btn-shadow btn-transition btn-sm btn-wide"
                                            variant="light"
                                            v-if="application.organization.id === organization.id"
                                            @click="
                                                $router.push({
                                                    name: 'assets.applications.detail.edit',
                                                    params: { id: id },
                                                })
                                            "
                                        >
                                            <font-awesome-icon icon="edit" />
                                            &nbsp; Edit
                                        </b-button>
                                        <b-button
                                            class="btn-hover-shine btn-sm btn-shadow btn-transition purchase-button"
                                            variant="warning"
                                            v-else-if="canBePurchased && sameOrganization"
                                            @click="
                                                $router.push({
                                                    name: 'marketplace.quotation',
                                                    params: { assetId: application.id, assetType: 'application' },
                                                })
                                            "
                                        >
                                            <font-awesome-icon icon="shopping-cart" />
                                            &nbsp; Purchase
                                        </b-button>
                                        <b-button
                                            class="btn-sm purchase-button text-dark"
                                            v-else-if="
                                                (application.organization.id === 1 ||
                                                    application.status === 'Public') &&
                                                activeContracts.indexOf(application.id) === -1 &&
                                                pendingContracts.indexOf(application.id) === -1
                                            "
                                            variant="light"
                                            @click="
                                                getOpenApplication(application.id);
                                                $event.stopImmediatePropagation();
                                            "
                                        >
                                            <b>GET</b>
                                        </b-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 col-lg-12 col-xl-12">
                    <b-card class="mb-3" no-body>
                        <b-tabs class="card-header-tab-animation" card>
                            <b-tab title="Overview" class="custom-tab" active>
                                <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                    General Information
                                </h6>
                                <br />
                                <div class="row">
                                    <div class="col-sm-9" v-if="application.description">
                                        <div class="field-heading">
                                            Description
                                            <tooltip
                                                v-b-tooltip="
                                                    'A brief overview that acts as an account of the application’s contents.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.description }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="application.metadata.tags.length > 0">
                                        <div class="field-heading">
                                            Tags
                                            <tooltip
                                                v-b-tooltip="
                                                    'A list of keywords and / or arbitrary textual tags associated with the application by its application provider.'
                                                "
                                            />
                                        </div>
                                        <span
                                            class="badge badge-info tag"
                                            v-for="tag in application.metadata.tags"
                                            :key="tag"
                                        >
                                            {{ tag }}
                                        </span>
                                    </div>
                                </div>
                                <br v-if="application.description || application.metadata.tags.length > 0" />
                                <div class="row">
                                    <div class="col-sm-3" v-if="application.categories.length > 0">
                                        <div class="field-heading">
                                            Categories
                                            <tooltip
                                                v-b-tooltip="
                                                    'A classification of the application according to the concepts of the ICARUS aviation data model it currently includes.'
                                                "
                                            />
                                        </div>
                                        <span
                                            class="text-muted"
                                            v-for="(category, index) in application.categories"
                                            :key="category.id"
                                        >
                                            {{ category.name }}
                                            <span v-if="index + 1 < application.categories.length">,</span>
                                        </span>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="field-heading">
                                            Status
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication of whether the application is available in the ICARUS platform.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">Available</div>
                                    </div>
                                    <div class="col-sm-3" v-if="application.created">
                                        <div class="field-heading">
                                            Date Available
                                            <tooltip
                                                v-b-tooltip="
                                                    'The date when the application became available in the ICARUS platform.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.created }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="application.updated">
                                        <div class="field-heading">
                                            Date Modified
                                            <tooltip
                                                v-b-tooltip="
                                                    'The date when the application was last updated / changed in the ICARUS platform.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.updated }}</div>
                                    </div>
                                </div>
                                <br />
                                <div class="row" v-if="application.metadata.version">
                                    <div class="col-sm-3">
                                        <div class="field-heading">
                                            Version
                                            <tooltip v-b-tooltip="'The current version of the application.'" />
                                        </div>
                                        <div class="text-muted">{{ application.metadata.version }}</div>
                                    </div>
                                </div>
                            </b-tab>
                            <b-tab title="License" class="custom-tab">
                                <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                    General Information
                                </h6>
                                <br />
                                <div class="row">
                                    <div class="col-sm-6" v-if="application.metadata.license">
                                        <div class="field-heading">
                                            License
                                            <tooltip
                                                v-b-tooltip="
                                                    'The legal statement / terms giving official permission to the application in a custom manner or according to well-defined data licenses, e.g. CC Attribution-NonCommercial-ShareAlike (CC BY-NC-SA).'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.metadata.license }}</div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="field-heading">
                                            Copyright Owner
                                            <tooltip
                                                v-b-tooltip="
                                                    'The organization owning or managing rights over the application and officially acting as the application provider.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted" v-if="application.metadata.copyrightOwner">
                                            {{ application.metadata.copyrightOwner }}
                                        </div>
                                        <div class="text-muted" v-else>{{ application.organization.name }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="application.metadata.privacyLevel">
                                        <div class="field-heading">
                                            Privacy Level
                                            <tooltip
                                                v-b-tooltip="
                                                    'The desired visibility of an application, i.e. Confidential (not to be shared), Proprietary/Private (to be shared with appropriate licensing), Public (available to all).'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.metadata.privacyLevel }}</div>
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-sm-6" v-if="application.metadata.link">
                                        <div class="field-heading">
                                            Link
                                            <tooltip
                                                v-b-tooltip="'A link to the exact legal terms of the specific license.'"
                                            />
                                        </div>
                                        <a :href="application.metadata.link" target="_blank">
                                            {{ application.metadata.link }}
                                        </a>
                                    </div>
                                </div>
                                <br v-if="application.metadata.link" />
                                <br />
                                <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                    Rights & Usage
                                </h6>
                                <br />
                                <div class="row">
                                    <div class="col-sm-3" v-if="application.metadata.derivation.length > 0">
                                        <div class="field-heading">
                                            Derivation
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether the creation and distribution of any update, adaptation, or any other alteration of the application or of a substantial part of the application that constitutes a derivative application is allowed, with permissions to modify, excerpt, annotate, aggregate the original application.'
                                                "
                                            />
                                        </div>
                                        <div v-if="application.metadata.derivation.includes('Prohibited')">
                                            <div class="text-muted">Prohibited</div>
                                        </div>
                                        <div v-else>
                                            <span class="text-muted">Allowed to</span>
                                            <span
                                                class="text-muted"
                                                v-for="(item, index) in application.metadata.derivation"
                                                :key="index"
                                            >
                                                {{ item }}
                                                <span v-if="index + 1 < application.metadata.derivation.length">,</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-sm-3" v-if="application.metadata.attribution">
                                        <div class="field-heading">
                                            Attribution
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether it is required to give credit to copyright owner and/or application provider.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.metadata.attribution }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="application.metadata.reproduction">
                                        <div class="field-heading">
                                            Reproduction
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether from a given application, temporary or permanent reproductions can be created by any means and in any form, in whole or in part.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.metadata.reproduction }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="application.metadata.distribution">
                                        <div class="field-heading">
                                            Distribution
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether restricted or unrestricted publication and distribution of the application is allowed.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.metadata.distribution }}</div>
                                    </div>
                                </div>
                                <br
                                    v-if="
                                        application.metadata.derivation.length > 0 ||
                                        application.metadata.attribution ||
                                        application.metadata.reproduction ||
                                        application.metadata.distribution
                                    "
                                />
                                <div class="row" v-if="application.metadata.shareAlike">
                                    <div class="col-sm-3">
                                        <div class="field-heading">
                                            Share Alike
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether any transformation or building upon the application requires distribution under the same license as the original.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.metadata.shareAlike }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="application.metadata.reContext">
                                        <div class="field-heading">
                                            Re-context
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether restricted or unrestricted use of the application in a different context is allowed.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ application.metadata.reContext }}</div>
                                    </div>
                                    <div
                                        class="col-sm-3"
                                        v-if="
                                            application.metadata.targetPurpose ||
                                            (Array.isArray(application.metadata.targetPurpose) &&
                                                application.metadata.targetPurpose.length > 0)
                                        "
                                    >
                                        <div class="field-heading">
                                            Target Purpose
                                            <tooltip
                                                v-b-tooltip="
                                                    'The intended use that the application provider allows, i.e. for business purposes, for academic purposes, for scientific purposes, for personal purposes, for non-profit purposes.'
                                                "
                                            />
                                        </div>
                                        <div v-if="Array.isArray(application.metadata.targetPurpose)">
                                            <span
                                                class="text-muted"
                                                v-for="(purpose, index) in application.metadata.targetPurpose"
                                                :key="index"
                                            >
                                                {{ purpose }}
                                                <span v-if="index + 1 < application.metadata.targetPurpose.length">
                                                    ,
                                                </span>
                                            </span>
                                        </div>
                                        <div v-else>
                                            <div class="text-muted">{{ application.metadata.targetPurpose }}</div>
                                        </div>
                                    </div>
                                    <div
                                        class="col-sm-3"
                                        v-if="
                                            application.metadata.targetIndustry &&
                                            application.metadata.targetIndustry.length > 0
                                        "
                                    >
                                        <div class="field-heading">
                                            Target Industry
                                            <tooltip
                                                v-b-tooltip="
                                                    'The target industry for the application within and beyond the aviation data value chain stakeholders.'
                                                "
                                            />
                                        </div>
                                        <span
                                            class="text-muted"
                                            v-for="(industry, index) in application.metadata.targetIndustry"
                                            :key="index"
                                        >
                                            {{ industry }}
                                            <span v-if="index + 1 < application.metadata.targetIndustry.length">,</span>
                                        </span>
                                    </div>
                                </div>
                                <br
                                    v-if="
                                        application.metadata.shareAlike ||
                                        application.metadata.reContext ||
                                        application.metadata.targetPurpose ||
                                        (Array.isArray(application.metadata.targetPurpose) &&
                                            application.metadata.targetPurpose.length > 0) ||
                                        (application.metadata.targetIndustry &&
                                            application.metadata.targetIndustry.length > 0)
                                    "
                                />
                                <div
                                    v-if="
                                        customLicense &&
                                        application.metadata.privacyLevel !== 'Confidential' &&
                                        application.metadata.privacyLevel !== 'Public' &&
                                        application.organization.id !== 1
                                    "
                                >
                                    <br />
                                    <br />
                                    <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                        Pricing
                                    </h6>
                                    <br />
                                    <div class="row">
                                        <div class="col-sm-3" v-if="application.metadata.calculationScheme">
                                            <div class="field-heading">
                                                Amount
                                                <tooltip
                                                    v-b-tooltip="
                                                        'The price for the acquisition of the application including its currency, if it is fixed. It includes the cost of both the application and its related datasets that will be available for use only within the application.'
                                                    "
                                                />
                                            </div>
                                            <div
                                                class="text-muted"
                                                v-if="application.metadata.calculationScheme !== 'Request Dependent'"
                                            >
                                                {{ application.metadata.amount }} {{ application.metadata.currency }}
                                            </div>
                                            <div class="text-muted" v-else>Upon request</div>
                                        </div>
                                        <div class="col-sm-6" v-if="application.metadata.paymentMethod.length > 0">
                                            <div class="field-heading">
                                                Payment Methods
                                                <tooltip
                                                    v-b-tooltip="
                                                        'The applicable payment method that the application provider has defined in order for the payment to be conducted “offline” (outside the ICARUS platform), e.g. credit/debit card, bank transfer, online payment services.'
                                                    "
                                                />
                                            </div>
                                            <span
                                                class="text-muted"
                                                v-for="(payment, index) in application.metadata.paymentMethod"
                                                :key="index"
                                            >
                                                {{ payment }}
                                                <span v-if="index + 1 < application.metadata.paymentMethod.length">
                                                    ,
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>

                            <b-tab title="Related Datasets" class="custom-tab">
                                <div class="row" v-if="relatedDatasets.length === 0 && !isLoading">
                                    <div class="col-12">
                                        <div class="alert alert-warning mb-0" role="alert">
                                            <font-awesome-icon icon="info-circle" />
                                            <span class="ml-2">No Related Datasets found!</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="table-responsive">
                                    <table class="align-middle text-truncate mb-0 table table-hover fixed">
                                        <thead class="thead-light">
                                            <tr>
                                                <th
                                                    title="The ID of the specific dataset in the ICARUS platform."
                                                    class="text-left"
                                                    style="cursor: default;"
                                                    width="40%"
                                                >
                                                    Title
                                                </th>
                                                <th
                                                    title="The name of the specific dataset as assigned by its provider in the ICARUS platform."
                                                    class="text-center"
                                                    style="cursor: default;"
                                                    width="35%"
                                                >
                                                    Data Provider
                                                </th>

                                                <th
                                                    title="The version of the dataset that is currently available in the organization's Secure Space."
                                                    class="text-center"
                                                    style="cursor: default;"
                                                    width="10%"
                                                >
                                                    Version
                                                </th>
                                                <th
                                                    title="The date when the specific dataset was last updated in the organization's Secure Space."
                                                    class="text-center"
                                                    style="cursor: default;"
                                                    width="15%"
                                                >
                                                    Last Updated
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(relatedDataset, index) in relatedDatasets" :key="index">
                                                <td class="text-left overflow" width="40%">
                                                    <!-- ||
                                                            relatedDataset.type === 'result' -->
                                                    <router-link
                                                        v-if="relatedDataset.type === 'dataset'"
                                                        :to="{
                                                            name: 'assets.dataset',
                                                            params: { id: relatedDataset.id },
                                                        }"
                                                        class="router-link-overflow"
                                                    >
                                                        <strong>{{ relatedDataset.name }}</strong>
                                                        <br />
                                                    </router-link>
                                                    <div v-else>
                                                        <strong>{{ relatedDataset.name }}</strong>
                                                        <br />
                                                    </div>
                                                </td>
                                                <td class="text-center" width="35%">
                                                    {{
                                                        relatedDataset.organization
                                                            ? relatedDataset.organization.name
                                                            : 'N/A'
                                                    }}
                                                </td>
                                                <td class="text-center" width="10%">
                                                    {{ relatedDataset.version ? relatedDataset.version : 'N/A' }}
                                                </td>
                                                <td class="text-center" width="15%">
                                                    {{ relatedDataset.updated ? relatedDataset.updated : 'N/A' }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </b-tab>
                            <b-tab
                                v-if="
                                    application.status === 'Private' &&
                                    this.organization.id !== 1 &&
                                    this.organization.id === this.application.organization.id
                                "
                                title="Access Policy"
                                class="custom-tab access-policy"
                            >
                                <input
                                    style="margin: 12px;"
                                    type="checkbox"
                                    id="checkbox"
                                    v-model="publicAccess"
                                    disabled
                                />
                                <label style="margin: 12px 0;" for="checkbox">Allow Access to All</label>
                                <vue-query-builder
                                    v-if="!publicAccess"
                                    :max-depth="1"
                                    :labels="labels"
                                    :rules="query_filters"
                                    v-model="rules"
                                ></vue-query-builder>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faEdit, faInfoCircle, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { assoc, clone, head, isEmpty, keys } from 'ramda';
import { Application, Organization, Contract, DataAsset, VirtualDataset, Result } from '@/api';
import { Tooltip } from '@/components';
import VueQueryBuilder from 'vue-query-builder';
import useAsset from './assets';

library.add(faEdit, faDownload, faShoppingCart, faInfoCircle);
const R = { assoc, clone, head, keys, isEmpty };
const baseURL = process.env.VUE_APP_API_URL;

export default {
    name: 'Application',
    components: { FontAwesomeIcon, Tooltip, VueQueryBuilder },
    filters: {
        capitalize(s) {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
    },
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },
    data: () => ({
        application: {
            name: '',
            description: '',
            organization: { id: null },
            status: null,
            categories: [],
            coverphoto: null,
            metadata: {
                tags: [],
                velocity: null,
                frequency: null,
                temporalCoverage: [],
                spatialCoverage: [],
                language: [],
                accessibility: null,
                standards: null,
                version: null,
                license: null,
                privacyLevel: null,
                modify: null,
                excerpt: null,
                annotate: null,
                aggregate: null,
                derivation: [],
                attribution: null,
                reproduction: null,
                distribution: null,
                targetPurpose: null,
                targetIndustry: null,
                onlineStorage: null,
                reContext: null,
                shareAlike: null,
                link: null,
                calculationScheme: null,
                amount: null,
                paymentMethod: [],
            },
        },
        metadataPlaceholder: {
            tags: [],
            velocity: null,
            frequency: null,
            temporalCoverage: [],
            spatialCoverage: [],
            language: [],
            accessibility: null,
            standards: null,
            version: null,
            license: null,
            privacyLevel: null,
            modify: null,
            excerpt: null,
            annotate: null,
            aggregate: null,
            derivation: [],
            attribution: null,
            reproduction: null,
            distribution: null,
            targetPurpose: null,
            targetIndustry: null,
            onlineStorage: null,
            reContext: null,
            shareAlike: null,
            link: null,
            calculationScheme: null,
            amount: null,
            paymentMethod: [],
        },
        previousRoute: null,
        activeContracts: [],
        pendingContracts: [],
        rules: {},
        query_filters: [],
        labels: {
            matchType: 'Match Type',
            matchTypes: [
                { id: 'and', label: 'and' },
                { id: 'or', label: 'or' },
            ],
            addRule: 'Add Rule',
            removeRule: '&times;',
            textInputPlaceholder: 'value',
        },
        baseURL,
        hasImage: false,
        orgLogo: null,
        hasLogoImage: false,
        isLoading: true,
        relatedDatasets: [],
        sameOrganization: true,
        publicAccess: false,
    }),
    computed: {
        ...mapState(['organization']),
        customLicense() {
            if (
                this.application.metadata.license === undefined ||
                this.application.metadata.license === null ||
                this.application.metadata.license === 'Custom'
            ) {
                return true;
            }
            return false;
        },
        canBePurchased() {
            return (
                this.organization &&
                this.organization.id !== 1 &&
                this.application &&
                this.application.organization.id !== 1 &&
                this.application.organization.id !== this.organization.id &&
                this.application.status !== 'Public' &&
                this.activeContracts &&
                this.activeContracts.indexOf(this.application.id) === -1 &&
                this.pendingContracts &&
                this.pendingContracts.indexOf(this.application.id) === -1
            );
        },
    },
    async created() {
        try {
            let activePendingContracts = [];
            if (this.organization && this.organization.id !== 1) {
                const { data: contracts } = await Contract.activePendingAppContracts();
                activePendingContracts = contracts;
            }

            activePendingContracts.forEach((contract) => {
                if (contract.status === 'active') {
                    this.activeContracts.push(contract.id);
                } else {
                    this.pendingContracts.push(contract.id);
                }
            });

            const [{ data }, { data: authorization }, { data: filters }] = await Promise.all([
                Application.get(this.id),
                Application.getAuthorization(this.id),
                Application.getFilters(),
            ]);
            this.application = data;
            this.query_filters = filters;
            if (authorization && authorization.publicAccess) {
                this.publicAccess = authorization.publicAccess;
            } else {
                this.publicAccess = false;
            }
            if (authorization && authorization.context) {
                if (Object.entries(authorization.context).length !== 0) {
                    this.rules = R.clone(authorization.context);
                }
            }
            if (R.isEmpty(this.application.metadata)) {
                this.application.metadata = R.clone(this.metadataPlaceholder);
            }
            const { data: imageData } = await Application.getImage(this.application.coverphoto);
            this.hasImage = imageData.length > 0;

            if (this.application.organization.logoimage) {
                const { data: logoImageData } = await Organization.getLogoImage(
                    this.application.organization.logoimage,
                );
                this.hasLogoImage = logoImageData.length > 0;
                this.orgLogo = `${baseURL}/organization/logo-image/${this.application.organization.logoimage}`;
            }

            const { getDataset, getVirtualDataset, getResult } = useAsset(this.checkDataset);

            if (
                this.application.metadata &&
                this.application.metadata.relatedDatasets &&
                this.application.metadata.relatedDatasets.length
            ) {
                this.application.metadata.relatedDatasets.forEach(async (rDataset) => {
                    if (rDataset.id && rDataset.type === 'dataset') {
                        const { data: dataset } = await DataAsset.get(rDataset.id);
                        this.relatedDatasets.push(dataset);
                    } else if (rDataset.id && rDataset.type === 'virtual_dataset') {
                        const { data: vDataset } = await VirtualDataset.get(rDataset.id);
                        this.relatedDatasets.push(vDataset);
                    } else if (rDataset.id && rDataset.type === 'result') {
                        const { data: result } = await Result.get(rDataset.id);
                        this.relatedDatasets.push(result);
                    }
                });
            }

            // check if application can be purchased
            // (the owner of the application and of all related datasets must be the same organization)
            if (
                this.canBePurchased &&
                this.application.metadata &&
                this.application.metadata.relatedDatasets &&
                this.application.metadata.relatedDatasets.length > 0
            ) {
                this.application.metadata.relatedDatasets.forEach(async (relatedDataset) => {
                    if (relatedDataset.id && relatedDataset.type === 'dataset') {
                        await getDataset(relatedDataset.id);
                    } else if (relatedDataset.id && relatedDataset.type === 'virtual_dataset') {
                        await getVirtualDataset(relatedDataset.id);
                    } else if (relatedDataset.id && relatedDataset.type === 'result') {
                        await getResult(relatedDataset.id);
                    }
                });
            }

            this.isLoading = false;
        } catch (error) {
            this.$router.push(this.previousRoute);
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.previousRoute = from;
            if (from.name !== 'marketplace' && from.name !== 'assets.applications') {
                vm.previousRoute = { name: 'marketplace' };
            }
        });
    },
    methods: {
        getImageUrl() {
            if (this.hasImage) {
                return `url(${baseURL}/application/coverphoto-image/${this.application.coverphoto})`;
            }
            return 'inherit';
        },
        checkDataset(dataset) {
            if (
                dataset &&
                dataset.organization.id !== 1 &&
                dataset.organization.id !== this.application.organization.id
            ) {
                this.sameOrganization = false;
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
    },
};
</script>

<style lang="scss">
.access-policy {
    pointer-events: none !important;
}
.application {
    .default-bg-image {
        background-image: url('../../assets/images/banner.png') !important;
    }

    .header {
        height: 12rem;
        background-size: cover;
        background-position: center center;
        display: flex;
        border-radius: 0.3rem;

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 0.3rem;
        }

        .content {
            padding: 1rem;
            color: white;

            .widget-wrapper {
                margin-top: 3.5rem;

                .button-wrapper {
                    text-align: right;
                    padding: 1rem;
                    margin-right: -1rem;

                    .purchase-button {
                        color: white;
                    }
                }
            }

            .organization-icon {
                border: 1px solid #fff;

                img {
                    object-fit: cover;
                }
            }
        }
    }

    .field-heading {
        font-weight: 700;
    }

    .tag {
        color: #fff;
        font-size: 65%;
        padding: 5px 6px;
        margin-right: 1px;
    }

    .download {
        justify-content: flex-end;
        display: flex;
        align-items: center;
    }

    .sample-table-wrapper {
        height: 20rem;
        overflow-y: auto;
    }

    .custom-tab {
        outline: none;
    }

    .query-builder .rules-group-container {
        width: 100% !important;
    }
}
</style>
