<template>
    <div class="add-metadata">
        <b-tabs class="card-header-tab-animation" card>
            <b-tab class="custom-tab" active>
                <template slot="title">
                    <span
                        class="tab-error"
                        v-if="
                            (errors.has('description') ||
                                errors.has('categories') ||
                                errors.has('tags') ||
                                errors.has('version')) &&
                            formSubmitted
                        "
                    >
                        <font-awesome-icon class="btn-icon-wrapper" icon="exclamation-circle" />
                        &nbsp;Overview
                    </span>
                    <span v-else>Overview</span>
                </template>
                <div class="row">
                    <div class="position-relative form-group col-sm-6">
                        <label for="description">
                            Description
                            <tooltip
                                v-b-tooltip="'A brief overview that acts as an account of the application’s contents.'"
                            />
                        </label>
                        <input
                            name="description"
                            placeholder="Enter description"
                            type="text"
                            class="form-control"
                            v-model="application.description"
                            v-validate="'required'"
                            :class="{ invalid: errors.has('description') && formSubmitted }"
                        />
                    </div>
                    <div class="position-relative form-group col-sm-6">
                        <label for="tags">
                            Tags
                            <tooltip
                                v-b-tooltip="
                                    'A list of keywords and / or arbitrary textual tags associated with the application by its application provider.'
                                "
                            />
                        </label>
                        <multiselect
                            name="tags"
                            v-model="application.metadata.tags"
                            :options="tagOptions"
                            :multiple="true"
                            :close-on-select="false"
                            :clear-on-select="false"
                            :preserve-search="true"
                            :limit="3"
                            placeholder="Add tags"
                            :preselect-first="false"
                            :taggable="true"
                            v-validate="'required'"
                            :class="{ invalid: errors.has('tags') && formSubmitted }"
                            @tag="addTag"
                        ></multiselect>
                    </div>
                </div>
                <div class="row">
                    <div class="position-relative form-group col-sm-6">
                        <label for="status">
                            Status
                            <tooltip
                                v-b-tooltip="
                                    'An indication of whether the application is available in the ICARUS platform.'
                                "
                            />
                        </label>
                        <input
                            name="status"
                            placeholder="Enter status"
                            type="text"
                            class="form-control"
                            value="Undefined"
                            :disabled="true"
                        />
                        <multiselect
                            name="status"
                            ref="status"
                            :hidden="true"
                            v-model="application.status"
                            placeholder="Select status"
                            :options="statusOptions"
                            :searchable="false"
                            :allow-empty="false"
                            deselect-label="Can't remove this value"
                        ></multiselect>
                    </div>
                    <div class="position-relative form-group col-sm-6">
                        <label for="categories">
                            Categories
                            <tooltip
                                v-b-tooltip="
                                    'A classification of the application according to the concepts of the ICARUS aviation data model it currently includes.'
                                "
                            />
                        </label>
                        <multiselect
                            name="categories"
                            v-model="application.categories"
                            track-by="id"
                            label="name"
                            :options="categoryOptions"
                            :limit="3"
                            :multiple="true"
                            :close-on-select="false"
                            :clear-on-select="false"
                            :preserve-search="true"
                            placeholder="Select categories"
                            v-validate="'required'"
                            :class="{ invalid: errors.has('categories') && formSubmitted }"
                            :preselect-first="false"
                        ></multiselect>
                    </div>
                </div>
                <div class="row">
                    <div class="position-relative form-group col-sm-6">
                        <label for="version">
                            Version
                            <tooltip v-b-tooltip="'The current version of the application.'" />
                        </label>
                        <input
                            name="version"
                            placeholder="Enter version"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.version"
                            v-validate="'required'"
                            :class="{ invalid: errors.has('version') && formSubmitted }"
                        />
                    </div>
                    <div class="col-sm-6">
                        <label for="appImage">
                            Application Image
                            <tooltip v-b-tooltip="'The application\'s image.'" />
                        </label>
                        <b-form-file
                            name="appImage"
                            v-model="appImage"
                            accept="image/jpeg, image/png"
                            placeholder="Choose an image or drop it here..."
                            drop-placeholder="Drop image here..."
                        ></b-form-file>
                    </div>
                </div>
            </b-tab>
            <b-tab class="custom-tab">
                <template slot="title">
                    <span
                        class="tab-error"
                        v-if="
                            (errors.has('license') ||
                                errors.has('copyrightOwner') ||
                                errors.has('privacyLevel') ||
                                errors.has('derivation') ||
                                errors.has('attribution') ||
                                errors.has('reproduction') ||
                                errors.has('distribution') ||
                                errors.has('targetPurpose') ||
                                errors.has('targetIndustry') ||
                                errors.has('reContext') ||
                                errors.has('shareAlike') ||
                                errors.has('link') ||
                                errors.has('calculationScheme') ||
                                errors.has('amount') ||
                                errors.has('paymentMethod')) &&
                            formSubmitted
                        "
                    >
                        <font-awesome-icon class="btn-icon-wrapper" icon="exclamation-circle" />
                        &nbsp;License
                    </span>
                    <span v-else>License</span>
                </template>
                <div class="row" v-if="showError">
                    <div class="col-sm-12">
                        <div class="alert alert-danger" role="alert">
                            <font-awesome-icon icon="exclamation-triangle" />
                            <span class="ml-2">
                                Attention: The dataset(s) that are used in your application have restricted permissions
                                in Reproduction and / or Distribution. Please review the license of the dataset(s).
                            </span>
                        </div>
                    </div>
                </div>
                <br v-else />
                <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">License Details</h6>
                <br />
                <div class="row">
                    <div class="position-relative form-group col-sm-6">
                        <label for="license">
                            License
                            <tooltip
                                v-b-tooltip="
                                    'The legal statement / terms giving official permission to the data asset in a custom manner or according to well-defined data licenses, e.g. CC Attribution-NonCommercial-ShareAlike (CC BY-NC-SA).'
                                "
                            />
                        </label>
                        <treeselect
                            name="license"
                            :options="licenseOptions"
                            :searchable="true"
                            :clearable="false"
                            :disable-branch-nodes="true"
                            v-model="application.metadata.license"
                            placeholder="Select license"
                            v-validate="'required'"
                            :class="{
                                invalid: errors.has('license') && formSubmitted,
                            }"
                            @select="checkLicense"
                        />
                    </div>
                    <div class="position-relative form-group col-sm-6">
                        <label for="privacyLevel">
                            Privacy Level
                            <tooltip
                                v-b-tooltip="
                                    'The desired visibility of an application, i.e. Confidential (not to be shared), Proprietary/Private (to be shared with appropriate licensing), Public (available to all).'
                                "
                            />
                        </label>
                        <input
                            name="privacyLevel"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.privacyLevel"
                            disabled="true"
                            v-show="!customLicense"
                        />
                        <multiselect
                            name="privacyLevel"
                            v-model="application.metadata.privacyLevel"
                            @select="alterStatus"
                            @input="checkPrivacyLevel"
                            placeholder="Select privacy level"
                            :options="privacyLevelOptions"
                            :searchable="false"
                            :allow-empty="false"
                            :disabled="organization.id === 1"
                            deselect-label="Can't remove this value"
                            v-validate="'required'"
                            :class="{ invalid: errors.has('privacyLevel') && formSubmitted }"
                            v-show="customLicense"
                        ></multiselect>
                    </div>
                </div>
                <div class="row">
                    <div class="position-relative form-group col-sm-6">
                        <label for="modify">
                            Derivation
                            <tooltip
                                v-b-tooltip="
                                    'An indication whether the creation and distribution of any update, adaptation, or any other alteration of the application or of a substantial part of the application that constitutes a derivative application is allowed, with permissions to modify, excerpt, annotate, aggregate the original application.'
                                "
                            />
                        </label>
                        <input
                            name="derivation"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.derivation"
                            disabled="true"
                            v-show="!customLicense || application.metadata.privacyLevel === 'Confidential'"
                        />
                        <multiselect
                            name="derivation"
                            v-model="application.metadata.derivation"
                            placeholder="Select derivation, otherwise it is considered as 'Prohibited'"
                            :options="derivationOptions"
                            :searchable="false"
                            :limit="3"
                            :multiple="true"
                            :close-on-select="false"
                            :clear-on-select="false"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('derivation') && formSubmitted }"
                            v-show="customLicense && application.metadata.privacyLevel !== 'Confidential'"
                        ></multiselect>
                    </div>
                    <div
                        class="position-relative form-group col-sm-6"
                        v-show="application.metadata.privacyLevel !== 'Confidential'"
                    >
                        <label for="attribution">
                            Attribution
                            <tooltip
                                v-b-tooltip="
                                    'An indication whether it is required to give credit to copyright owner and/or application provider.'
                                "
                            />
                        </label>
                        <input
                            name="attribution"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.attribution"
                            disabled="true"
                            v-show="!customLicense"
                        />
                        <multiselect
                            name="attribution"
                            v-model="application.metadata.attribution"
                            placeholder="Select one"
                            :options="requiredOptions"
                            :searchable="false"
                            :allow-empty="false"
                            deselect-label="Can't remove this value"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('attribution') && formSubmitted }"
                            v-show="customLicense"
                        ></multiselect>
                    </div>
                </div>
                <div class="row">
                    <div class="position-relative form-group col-sm-6">
                        <label for="reproduction">
                            Reproduction
                            <tooltip
                                v-b-tooltip="
                                    'An indication whether from a given application, temporary or permanent reproductions can be created by any means and in any form, in whole or in part.'
                                "
                            />
                        </label>
                        <input
                            name="reproduction"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.reproduction"
                            disabled="true"
                            v-show="!customLicense || application.metadata.privacyLevel === 'Confidential'"
                        />
                        <multiselect
                            name="reproduction"
                            v-model="application.metadata.reproduction"
                            placeholder="Select one"
                            :options="allowedProhibitedOptions"
                            :searchable="false"
                            :allow-empty="false"
                            deselect-label="Can't remove this value"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('reproduction') && formSubmitted }"
                            v-show="customLicense && application.metadata.privacyLevel !== 'Confidential'"
                        ></multiselect>
                    </div>
                    <div class="position-relative form-group col-sm-6">
                        <label for="distribution">
                            Distribution
                            <tooltip
                                v-b-tooltip="
                                    'An indication whether restricted or unrestricted publication and distribution of the application is allowed.'
                                "
                            />
                        </label>
                        <input
                            name="distribution"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.distribution"
                            disabled="true"
                            v-show="!customLicense || application.metadata.privacyLevel === 'Confidential'"
                        />
                        <multiselect
                            name="distribution"
                            v-model="application.metadata.distribution"
                            placeholder="Select distribution"
                            :options="allowedProhibitedOptions"
                            :searchable="false"
                            :allow-empty="false"
                            deselect-label="Can't remove this value"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('distribution') && formSubmitted }"
                            v-show="customLicense && application.metadata.privacyLevel !== 'Confidential'"
                        ></multiselect>
                    </div>
                </div>
                <div class="row" v-show="application.metadata.privacyLevel !== 'Confidential'">
                    <div class="position-relative form-group col-sm-6">
                        <label for="targetPurpose">
                            Target Purpose
                            <tooltip
                                v-b-tooltip="
                                    'The intended use that the application provider allows, i.e. for business purposes, for academic purposes, for scientific purposes, for personal purposes, for non-profit purposes.'
                                "
                            />
                        </label>
                        <input
                            name="targetPurpose"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.targetPurpose"
                            disabled="true"
                            v-show="!customLicense"
                        />
                        <multiselect
                            name="targetPurpose"
                            v-model="application.metadata.targetPurpose"
                            placeholder="Select target purpose"
                            :options="targetPurposeOptions"
                            :searchable="false"
                            :limit="3"
                            :multiple="true"
                            :close-on-select="false"
                            :clear-on-select="false"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('targetPurpose') && formSubmitted }"
                            v-show="customLicense"
                        ></multiselect>
                    </div>
                    <div class="position-relative form-group col-sm-6">
                        <label for="targetIndustry">
                            Target Industry
                            <tooltip
                                v-b-tooltip="
                                    'The target industry for the application within and beyond the aviation data value chain stakeholders.'
                                "
                            />
                        </label>
                        <input
                            name="targetIndustry"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.targetIndustry"
                            disabled="true"
                            v-show="!customLicense"
                        />
                        <treeselect
                            name="targetIndustry"
                            :options="targetIndustryOptions"
                            :searchable="true"
                            :multiple="true"
                            :limit="3"
                            :disable-branch-nodes="false"
                            v-model="application.metadata.targetIndustry"
                            placeholder="Select target industry"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('targetIndustry') && formSubmitted }"
                            v-show="customLicense"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="position-relative form-group col-sm-6">
                        <label for="reContext">
                            Re-context
                            <tooltip
                                v-b-tooltip="
                                    'An indication whether restricted or unrestricted use of the application in a different context is allowed.'
                                "
                            />
                        </label>
                        <input
                            name="reContext"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.reContext"
                            disabled="true"
                            v-show="!customLicense || application.metadata.privacyLevel === 'Confidential'"
                        />
                        <multiselect
                            name="reContext"
                            v-model="application.metadata.reContext"
                            placeholder="Select re-context"
                            :options="allowedProhibitedOptions"
                            :searchable="false"
                            :allow-empty="false"
                            deselect-label="Can't remove this value"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('reContext') && formSubmitted }"
                            v-show="customLicense && application.metadata.privacyLevel !== 'Confidential'"
                        ></multiselect>
                    </div>
                    <div class="position-relative form-group col-sm-6">
                        <label for="shareAlike">
                            Share Alike
                            <tooltip
                                v-b-tooltip="
                                    'An indication whether any transformation or building upon the application requires distribution under the same license as the original.'
                                "
                            />
                        </label>
                        <input
                            name="shareAlike"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.shareAlike"
                            disabled="true"
                            v-show="!customLicense || application.metadata.privacyLevel === 'Confidential'"
                        />
                        <multiselect
                            name="shareAlike"
                            v-model="application.metadata.shareAlike"
                            placeholder="Select share alike"
                            :options="shareAlikeOptions"
                            :searchable="false"
                            :allow-empty="false"
                            deselect-label="Can't remove this value"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('shareAlike') && formSubmitted }"
                            v-show="customLicense && application.metadata.privacyLevel !== 'Confidential'"
                        ></multiselect>
                    </div>
                </div>
                <div class="row">
                    <div class="position-relative form-group col-sm-6">
                        <label for="link">
                            Link
                            <tooltip v-b-tooltip="'A link to the exact legal terms of the specific license.'" />
                        </label>
                        <input
                            name="link"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.link"
                            disabled="true"
                            v-show="!customLicense"
                        />
                        <input
                            name="link"
                            placeholder="Enter link"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.link"
                            v-validate="'required_if:status,Private,Public,null'"
                            :class="{ invalid: errors.has('link') && formSubmitted }"
                            v-show="customLicense"
                        />
                    </div>
                </div>
                <div class="row" v-show="application.metadata.privacyLevel === 'Public'">
                    <div class="position-relative form-group col-sm-6">
                        <label for="copyrightOwner">
                            Copyright Owner
                            <tooltip
                                v-b-tooltip="
                                    'The organization owning or managing rights over the application and officially acting as the application provider.'
                                "
                            />
                        </label>
                        <input
                            name="copyrightOwner"
                            placeholder="Enter copyright owner"
                            type="text"
                            class="form-control"
                            v-model="application.metadata.copyrightOwner"
                            v-validate="'required_if:status,Public'"
                            :class="{ invalid: errors.has('copyrightOwner') && formSubmitted }"
                        />
                    </div>
                </div>
                <div
                    v-show="
                        customLicense &&
                        application.metadata.privacyLevel !== 'Confidential' &&
                        application.metadata.privacyLevel !== 'Public' &&
                        organization.id !== 1
                    "
                >
                    <br />
                    <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">Pricing Details</h6>
                    <br />
                    <div class="row">
                        <div class="position-relative form-group col-sm-12">
                            <label for="paymentMethod">
                                Payment Method
                                <tooltip
                                    v-b-tooltip="
                                        'The applicable payment method that the application provider has defined in order for the payment to be conducted “offline” (outside the ICARUS platform), e.g. credit/debit card, bank transfer, online payment services.'
                                    "
                                />
                            </label>
                            <multiselect
                                name="paymentMethod"
                                v-model="application.metadata.paymentMethod"
                                :options="paymentMethodOptions"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :preserve-search="true"
                                :searchable="false"
                                placeholder="Select payment method"
                                :limit="4"
                                v-validate="'required_if:status,Private,null'"
                                :class="{ invalid: errors.has('paymentMethod') && formSubmitted }"
                            ></multiselect>
                        </div>
                    </div>
                    <div class="row">
                        <div class="position-relative form-group col-sm-6">
                            <label for="calculationScheme">
                                Calculation Scheme
                                <tooltip
                                    v-b-tooltip="
                                        'The applicable calculation scheme for the application that may range from fixed to request dependent. Note: The cost includes both the application and the related datasets it utilizes.'
                                    "
                                />
                            </label>
                            <multiselect
                                name="calculationScheme"
                                v-model="application.metadata.calculationScheme"
                                placeholder="Select calculation scheme"
                                :options="calculationSchemeOptions"
                                :searchable="false"
                                :allow-empty="false"
                                deselect-label="Can't remove this value"
                                v-validate="'required_if:status,Private,null'"
                                :class="{ invalid: errors.has('calculationScheme') && formSubmitted }"
                            ></multiselect>
                        </div>
                        <div
                            class="position-relative form-group col-sm-6"
                            v-if="application.metadata.calculationScheme !== 'Request Dependent'"
                        >
                            <label for="amount">
                                Amount
                                <tooltip
                                    v-b-tooltip="
                                        'The price for the acquisition of the application including its currency, if it is fixed. It includes the cost of both the application and its related datasets that will be available for use only within the application.'
                                    "
                                />
                            </label>

                            <div class="input-group">
                                <input
                                    name="amount"
                                    placeholder="Enter amount"
                                    type="text"
                                    class="form-control"
                                    v-model="application.metadata.amount"
                                />
                                <div class="input-group-append">
                                    <b-dropdown :text="selectedCurrency" variant="light">
                                        <b-dropdown-item
                                            v-for="(option, idx) in currencies"
                                            :key="idx"
                                            :value="option"
                                            :active="option === selectedCurrency"
                                            @click="selectCurrency(option)"
                                        >
                                            {{ option }}
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </b-tab>
            <b-tab
                v-if="application.status === 'Private' && this.organization.id !== 1"
                title="Access Policy"
                class="custom-tab"
            >
                <div class="col-12">
                    <div class="alert alert-warning" role="alert" v-if="!publicAccess">
                        <font-awesome-icon icon="info-circle" />
                        <span class="ml-2">
                            A Private application needs to be accompanied by appropriate access policies, otherwise it
                            is treated as Confidential.
                        </span>
                    </div>
                    <div class="alert alert-warning" role="alert" v-if="publicAccess">
                        <font-awesome-icon icon="info-circle" />
                        <span class="ml-2">
                            All organizations can access the application.
                        </span>
                    </div>
                </div>
                <input style="margin: 12px;" type="checkbox" id="checkbox" v-model="publicAccess" />
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
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { clone } from 'ramda';
import Multiselect from 'vue-multiselect';
import Treeselect from '@riophae/vue-treeselect';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import datasetOptions from '@/config/dataset.json';
import { Application, Category, DataAsset, VirtualDataset, Result } from '@/api';
import licenses from '@/config/licenses.json';
import { Tooltip } from '@/components';
import VueQueryBuilder from 'vue-query-builder';

library.add(faExclamationCircle, faExclamationTriangle);

const R = { clone };

export default {
    name: 'Dataset',
    components: {
        Multiselect,
        Treeselect,
        FontAwesomeIcon,
        Tooltip,
        VueQueryBuilder,
    },
    model: {
        prop: 'submitButton',
    },
    props: {
        datasets: {
            type: [Array, null],
            default: null,
        },
        workflowName: {
            type: [String, null],
            default: null,
        },
        mode: {
            type: String,
            required: true,
        },
        id: {
            type: [String, Number, null],
            default: null,
        },
        submitButton: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        application: {
            name: null,
            description: null,
            status: null,
            categories: [],
            workflowid: null,
            version: null,
            metadata: {
                tags: [],
                license: null,
                copyrightOwner: null,
                privacyLevel: null,
                derivation: null,
                attribution: null,
                reproduction: null,
                distribution: null,
                targetPurpose: null,
                targetIndustry: null,
                reContext: null,
                shareAlike: null,
                link: null,
                calculationScheme: null,
                amount: null,
                currency: 'EUR',
                paymentMethod: [],
            },
            authorizationcontext: null,
        },
        formSubmitted: false,
        requiredOptions: datasetOptions.requiredOptions,
        allowedProhibitedOptions: datasetOptions.allowedProhibitedOptions,
        shareAlikeOptions: datasetOptions.shareAlikeOptions,
        statusOptions: datasetOptions.statusOptions,
        tagOptions: [],
        licenseOptions: datasetOptions.licenseOptions,
        privacyLevelOptions: datasetOptions.privacyLevelOptions,
        derivationOptions: datasetOptions.derivationOptions,
        targetPurposeOptions: datasetOptions.targetPurposeOptions,
        targetIndustryOptions: datasetOptions.targetIndustryOptions,
        calculationSchemeOptions: datasetOptions.appCalculationSchemeOptions,
        paymentMethodOptions: datasetOptions.paymentMethodOptions,
        currencies: ['EUR', 'USD', 'GBP'],
        selectedCurrency: 'EUR',
        previousRoute: null,
        categoryOptions: [],
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
        authorization: {},
        appImage: null,
        licenses,
        showError: false,
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
    },
    async created() {
        const [{ data: categories }, { data: filters }] = await Promise.all([Category.all(), Application.getFilters()]);
        this.categoryOptions = categories;
        if (this.application.metadata.currency) {
            this.selectedCurrency = this.application.metadata.currency;
        }
        if (this.mode === 'update') {
            const [{ data }, { data: authorization }] = await Promise.all([
                Application.get(this.id),
                Application.getAuthorization(this.id),
            ]);
            this.application = data;
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
        }
        this.query_filters = filters;
        if (this.organization.id === 1) {
            this.application.metadata.privacyLevel = 'Public';
            this.application.status = 'Public';
        }
        if (this.application.metadata.privacyLevel) {
            this.checkPrivacyLevel(this.application.metadata.privacyLevel);
        }
    },
    methods: {
        addTag(newTag) {
            this.tagOptions.push(newTag);
            this.application.metadata.tags.push(newTag);
        },
        selectCurrency(option) {
            this.application.metadata.currency = option;
            this.selectedCurrency = option;
        },
        async createApplication() {
            if (this.application.status === 'Private') {
                this.application.authorizationcontext = this.rules;
            } else {
                this.application.authorizationcontext = {};
            }
            const applicationData = R.clone(this.application);
            applicationData.name = this.workflowName;
            applicationData.workflowid = this.workflowName;
            applicationData.metadata.relatedDatasets = this.datasets;
            const { data } = await Application.create(applicationData);
            if (this.appImage) {
                const imageData = new FormData();
                imageData.append('file', this.appImage);
                await Application.updateImage(data.id, imageData);
            }
        },
        async updateApplication() {
            try {
                if (this.application.status === 'Private') {
                    this.authorization.context = this.rules;
                    this.authorization.publicAccess = this.publicAccess;
                } else {
                    this.authorization.context = {};
                    this.authorization.publicAccess = this.publicAccess;
                }
                this.authorization.id = this.application.id;
                this.authorization.organizationId = this.application.organization.id;
                const promises = [
                    Application.update(this.id, this.application),
                    Application.updateAuthorization(this.id, this.authorization),
                ];

                if (this.appImage) {
                    const imageData = new FormData();
                    imageData.append('file', this.appImage);
                    promises.push(Application.updateImage(this.id, imageData));
                }

                Promise.all(promises)
                    .then(() => {
                        this.$toastr.s('Application updated successfully!');
                        this.$router.push({
                            name: 'assets.applications.detail',
                            params: { id: this.id },
                        });
                    })
                    .catch(() => {
                        this.$toastr.e('An error occured', 'Error');
                    });
            } catch (error) {
                this.$toastr.e('Error updating application!');
            }
        },
        alterStatus(selectedOption) {
            this.application.status = selectedOption;
            if (selectedOption === 'Confidential') {
                this.application.metadata.derivation = ['Prohibited'];
                this.application.metadata.attribution = null;
                this.application.metadata.reproduction = 'Prohibited';
                this.application.metadata.distribution = 'Prohibited';
                this.application.metadata.shareAlike = 'Prohibited';
                this.application.metadata.reContext = 'Prohibited';
                this.application.metadata.targetPurpose = null;
                this.application.metadata.targetIndustry = null;
                this.application.metadata.link = null;
                this.application.metadata.paymentMethod = null;
                this.application.metadata.calculationScheme = null;
                this.application.metadata.amount = null;
                this.application.metadata.copyrightOwner = null;
            } else {
                this.application.metadata.derivation = null;
                this.application.metadata.reproduction = null;
                this.application.metadata.distribution = null;
                this.application.metadata.reContext = null;
                this.application.metadata.shareAlike = null;
                this.application.metadata.copyrightOwner = null;
            }
        },
        async checkDataset(id) {
            const { data } = await DataAsset.get(id);
            if (
                data &&
                data.metadata &&
                (data.metadata.reproduction === 'Prohibited' ||
                    data.metadata.distribution === 'Prohibited' ||
                    (this.application.metadata.privacyLevel === 'Public' && data.metadata.privacyLevel !== 'Public'))
            ) {
                this.showError = true;
                this.submitButton.locked = true;
            }
        },
        async checkApplication(id) {
            const { data } = await Application.get(id);
            if (
                data &&
                data.metadata &&
                (data.metadata.reproduction === 'Prohibited' ||
                    data.metadata.distribution === 'Prohibited' ||
                    (this.application.metadata.privacyLevel === 'Public' && data.metadata.privacyLevel !== 'Public'))
            ) {
                this.showError = true;
                this.submitButton.locked = true;
            }
        },
        async checkVirtualDataset(id) {
            const { data } = await VirtualDataset.get(id);
            // check virtual dataset's input dataset
            if (data && data.input_dataset) {
                const inputDatasetSplit = data.input_dataset.split('_');
                if (data.input_dataset.includes('virtual_dataset')) {
                    await this.checkVirtualDataset(inputDatasetSplit[2]);
                } else if (data.input_dataset.includes('dataset')) {
                    await this.checkDataset(inputDatasetSplit[1]);
                }
            }
            // check virtual dataset's merged datasets
            if (data && data.virtualDatasetSteps) {
                data.virtualDatasetSteps.forEach((step) => {
                    if (step.action === 'merge') {
                        step.rules.forEach(async (rule) => {
                            if (rule.parameters.dataset_b) {
                                const inputDatasetSplit = rule.parameters.dataset_b.split('_');
                                if (rule.parameters.dataset_b.includes('virtual_dataset')) {
                                    await this.checkVirtualDataset(inputDatasetSplit[2]);
                                } else if (rule.parameters.dataset_b.includes('dataset')) {
                                    await this.checkDataset(inputDatasetSplit[1]);
                                }
                            }
                        });
                    }
                });
            }
        },
        async checkResult(id) {
            const { data } = await Result.get(id);
            if (data.inputs) {
                data.inputs.forEach(async (input) => {
                    if (input.table) {
                        const inputSplit = input.table.split('_');
                        if (input.table.includes('virtual_dataset')) {
                            await this.checkVirtualDataset(inputSplit[2]);
                        } else if (input.table.includes('dataset')) {
                            await this.checkDataset(inputSplit[1]);
                        } else if (input.table.includes('result')) {
                            await this.checkResult(inputSplit[1]);
                        }
                    }
                });
            }
            if (data.applicationId) {
                await this.checkApplication(data.applicationId);
            }
        },
        async checkPrivacyLevel(selectedOption) {
            this.showError = false;
            this.submitButton.locked = false;
            if (selectedOption === 'Public' || selectedOption === 'Private') {
                let appRelatedDatasets = [];
                if (this.application.metadata.relatedDatasets) {
                    appRelatedDatasets = this.application.metadata.relatedDatasets;
                } else {
                    appRelatedDatasets = this.datasets;
                }
                await appRelatedDatasets.forEach(async (dataset) => {
                    if (dataset.id && dataset.type === 'dataset') {
                        await this.checkDataset(dataset.id);
                    } else if (dataset.id && dataset.type === 'virtual_dataset') {
                        await this.checkVirtualDataset(dataset.id);
                    } else if (dataset.id && dataset.type === 'result') {
                        await this.checkResult(dataset.id);
                    }
                });
            }
        },
        checkLicense(node) {
            if (node && node.label !== 'Custom') {
                const licenseMetadata = this.licenses.find((element) => element.license === node.label);
                if (licenseMetadata) {
                    this.application.metadata.license = licenseMetadata.license;
                    this.application.metadata.privacyLevel = licenseMetadata.privacyLevel;
                    this.alterStatus(this.application.metadata.privacyLevel);
                    this.checkPrivacyLevel(this.application.metadata.privacyLevel);
                    this.application.metadata.derivation = licenseMetadata.derivation;
                    this.application.metadata.attribution = licenseMetadata.attribution;
                    this.application.metadata.reproduction = licenseMetadata.reproduction;
                    this.application.metadata.distribution = licenseMetadata.distribution;
                    this.application.metadata.targetPurpose = licenseMetadata.targetPurpose;
                    this.application.metadata.targetIndustry = licenseMetadata.targetIndustry;
                    this.application.metadata.reContext = licenseMetadata.reContext;
                    this.application.metadata.shareAlike = licenseMetadata.shareAlike;
                    this.application.metadata.link = licenseMetadata.link;
                }
            } else if (node && node.label === 'Custom') {
                this.application.metadata.license = 'Custom';
                this.application.metadata.derivation = null;
                this.application.metadata.attribution = null;
                this.application.metadata.reproduction = null;
                this.application.metadata.distribution = null;
                this.application.metadata.targetPurpose = null;
                this.application.metadata.targetIndustry = null;
                this.application.metadata.reContext = null;
                this.application.metadata.shareAlike = null;
                this.application.metadata.link = null;
                this.application.metadata.paymentMethod = null;
                this.application.metadata.calculationScheme = null;
                this.application.metadata.amount = null;
            }
        },
        checkDerivation() {
            if (!this.application.metadata.derivation || this.application.metadata.derivation.length === 0) {
                this.application.metadata.derivation = ['Prohibited'];
            }
        },
    },
};
</script>

<style lang="scss">
.add-metadata {
    .custom-tab {
        outline: none;
    }

    .invalid {
        border-color: red;
    }

    .multiselect.invalid .multiselect__tags {
        border-color: red;
    }

    .mx-datepicker.invalid .mx-input-wrapper .form-control {
        border-color: red;
    }

    .vue-treeselect.invalid .vue-treeselect__control {
        border-color: red;

        &:hover {
            border-color: red;
        }
    }

    .disable .vue-treeselect__control {
        background-color: #e9ecef;
    }

    .tab-error {
        color: red;
    }

    .vue-treeselect__control {
        height: 38px;
    }

    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
        line-height: 36px;
    }

    .vue-treeselect__placeholder {
        color: #8d8f90;
    }

    .query-builder .rules-group-container {
        width: 100% !important;
    }
}
</style>
