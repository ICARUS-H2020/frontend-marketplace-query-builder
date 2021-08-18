<template>
    <div>
        <div class="loading-indicator" v-if="isLoading">
            <Spinner name="wave" color="var(--primary)" no-fade-in />
            <h6 class="message">Loading dataset. Please wait...</h6>
        </div>

        <div class="edit-dataset" v-else>
            <page-title
                title="Edit Dataset"
                description="Edit metadata for dataset"
                icon="pe-7s-pen icon-gradient bg-malibu-beach"
                v-slot:actions
            >
                <button
                    type="button"
                    class="btn-shadow d-inline-flex align-items-center btn btn-warning text-white"
                    @click="submit()"
                >
                    Submit
                </button>
                &nbsp;
                <button
                    type="button"
                    class="btn-shadow d-inline-flex align-items-center btn btn-light"
                    @click="cancel()"
                >
                    Cancel
                </button>
            </page-title>

            <div class="row" v-if="dataset.updated === null">
                <div class="col-12">
                    <div class="alert alert-danger">
                        <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
                        Please fill in the dataset's metadata in order for the check-in job to start being executed
                        {{ apiImport ? '' : 'locally in the On-Premise Worker' }} and to eventually make the dataset
                        available in the platform.
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12 col-lg-12 col-xl-12">
                    <b-card class="mb-3" no-body>
                        <b-tabs class="card-header-tab-animation" card>
                            <b-tab class="custom-tab" active>
                                <template slot="title">
                                    <span
                                        class="tab-error"
                                        v-if="
                                            (errors.has('name') ||
                                                errors.has('description') ||
                                                errors.has('categories') ||
                                                errors.has('tags') ||
                                                errors.has('velocity') ||
                                                errors.has('frequency') ||
                                                errors.has('temporalCoverage') ||
                                                errors.has('spatialCoverage') ||
                                                errors.has('language') ||
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
                                        <label for="name">
                                            Title
                                            <tooltip
                                                v-b-tooltip="
                                                    'The name of the data asset by which it can be easily identified.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="name"
                                            placeholder="Enter name"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.name"
                                            v-validate="'required'"
                                            :class="{ invalid: errors.has('name') && formSubmitted }"
                                        />
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="description">
                                            Description
                                            <tooltip
                                                v-b-tooltip="
                                                    'A brief overview that acts as an account of the data asset’s contents.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="description"
                                            placeholder="Enter description"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.description"
                                            v-validate="'required'"
                                            :class="{ invalid: errors.has('description') && formSubmitted }"
                                        />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="status">
                                            Status
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication of whether the dataset is available in the ICARUS platform.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="status"
                                            placeholder="Enter status"
                                            type="text"
                                            class="form-control"
                                            :value="dataset.datasetStatus | capitalize"
                                            :disabled="true"
                                        />
                                        <multiselect
                                            name="status"
                                            ref="status"
                                            :hidden="true"
                                            v-model="dataset.status"
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
                                                    'A classification of the data asset according to the concepts of the ICARUS aviation data model it currently includes.'
                                                "
                                            />
                                        </label>
                                        <multiselect
                                            name="categories"
                                            v-model="dataset.categories"
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
                                        <label for="tags">
                                            Tags
                                            <tooltip
                                                v-b-tooltip="
                                                    'A list of keywords and / or arbitrary textual tags associated with the data asset by its data provider.'
                                                "
                                            />
                                        </label>
                                        <multiselect
                                            name="tags"
                                            v-model="dataset.metadata.tags"
                                            :options="tagOptions"
                                            :multiple="true"
                                            :close-on-select="false"
                                            :clear-on-select="false"
                                            :preserve-search="true"
                                            :limit="3"
                                            placeholder="Add tags"
                                            :preselect-first="false"
                                            :taggable="true"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('tags') && formSubmitted }"
                                            @tag="addTag"
                                        ></multiselect>
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="velocity">
                                            Velocity
                                            <tooltip
                                                v-b-tooltip="
                                                    'The speed with which the data asset becomes available in ICARUS, i.e. Streaming, Real-time, Near Real-time, Micro-Batch, Batch. By default, the current release of the ICARUS platform only supports the batch mode.'
                                                "
                                            />
                                        </label>
                                        <multiselect
                                            name="velocity"
                                            v-model="dataset.metadata.velocity"
                                            placeholder="Select velocity"
                                            :options="velocityOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('velocity') && formSubmitted }"
                                            deselect-label="Can't remove this value"
                                        ></multiselect>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="frequency">
                                            Frequency
                                            <tooltip
                                                v-b-tooltip="
                                                    'The rate at which the data have been collected, i.e. Hourly, Daily, Weekly, Monthly, Yearly, other.'
                                                "
                                            />
                                        </label>
                                        <multiselect
                                            name="frequency"
                                            v-model="dataset.metadata.frequency"
                                            placeholder="Select frequency"
                                            :options="frequencyOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('frequency') && formSubmitted }"
                                            deselect-label="Can't remove this value"
                                        ></multiselect>
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="temporalCoverage">
                                            Temporal Coverage
                                            <tooltip
                                                v-b-tooltip="
                                                    'A named period, date, or date range that the data asset covers.'
                                                "
                                            />
                                        </label>
                                        <date-picker
                                            name="temporalCoverage"
                                            input-class="form-control"
                                            width="100%"
                                            v-model="temporalCoverage"
                                            :type="'date'"
                                            :lang="'en'"
                                            :shortcuts="false"
                                            :value-type="'format'"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('temporalCoverage') && formSubmitted }"
                                            range
                                            ref="datepicker"
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
                                <div class="row">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="spatialCoverage">
                                            Spatial Coverage
                                            <tooltip
                                                v-b-tooltip="
                                                    'The list of countries or locations to which the data asset refers.'
                                                "
                                            />
                                        </label>
                                        <treeselect
                                            name="spatialCoverage"
                                            :options="countryOptions"
                                            :searchable="true"
                                            :multiple="true"
                                            :limit="3"
                                            :disable-branch-nodes="false"
                                            v-model="dataset.metadata.spatialCoverage"
                                            placeholder="Select countries"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('spatialCoverage') && formSubmitted }"
                                        />
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="spatialCoverage">
                                            Language
                                            <tooltip v-b-tooltip="'The language of the data asset.'" />
                                        </label>
                                        <treeselect
                                            name="language"
                                            :options="languageOptions"
                                            :searchable="true"
                                            :multiple="true"
                                            :limit="3"
                                            :disable-branch-nodes="false"
                                            v-model="dataset.metadata.language"
                                            placeholder="Select language"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('language') && formSubmitted }"
                                        />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="standards">
                                            Standards
                                            <tooltip
                                                v-b-tooltip="
                                                    'A standard or any other specification to which the data asset conforms.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="standards"
                                            placeholder="Enter standards"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.standards"
                                        />
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="accessibility">
                                            Accessibility
                                            <tooltip
                                                v-b-tooltip="
                                                    'The method by which the data asset can become accessible to a data consumer, e.g. through API, as a downloadable file, as database extract, other.'
                                                "
                                            />
                                        </label>
                                        <multiselect
                                            name="accessibility"
                                            v-model="dataset.metadata.accessibility"
                                            placeholder="Select accessibility"
                                            :options="accessibilityOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            deselect-label="Can't remove this value"
                                        ></multiselect>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label for="datasetImage">
                                            Dataset Image
                                            <tooltip v-b-tooltip="'The dataset\'s image.'" />
                                        </label>
                                        <b-form-file
                                            name="datasetImage"
                                            v-model="datasetImage"
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
                                                errors.has('onlineStorage') ||
                                                errors.has('reContext') ||
                                                errors.has('shareAlike') ||
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
                                <br />
                                <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                    License Details
                                </h6>
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
                                            :options="filteredLicenseOptions"
                                            :searchable="true"
                                            :clearable="false"
                                            :disable-branch-nodes="true"
                                            :disabled="initialPrivacyLevel !== 'Public' && initialPrivacyLevel !== null"
                                            v-model="dataset.metadata.license"
                                            placeholder="Select license"
                                            v-validate="'required'"
                                            :class="{
                                                disable:
                                                    initialPrivacyLevel !== 'Public' && initialPrivacyLevel !== null,
                                                invalid: errors.has('license') && formSubmitted,
                                            }"
                                            @select="checkLicense"
                                            @input="licenseDetailsChanged = true"
                                        />
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="privacyLevel">
                                            Privacy Level
                                            <tooltip
                                                v-b-tooltip="
                                                    'The desired visibility of a data asset, i.e. Confidential (not to be shared), Proprietary/Private (to be shared with appropriate licensing), Public (available to all). Note: a Private asset needs to be accompanied by appropriate access policies, otherwise it is treated as Confidential.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="privacyLevel"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.privacyLevel"
                                            disabled="true"
                                            v-show="!customLicense || initialPrivacyLevel === 'Public'"
                                        />
                                        <multiselect
                                            name="privacyLevel"
                                            ref="privacyLevel"
                                            v-model="dataset.metadata.privacyLevel"
                                            @select="alterStatus"
                                            @input="licenseDetailsChanged = true"
                                            placeholder="Select privacy level"
                                            :options="filteredPrivacyLevelOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            :disabled="organization.id === 1"
                                            deselect-label="Can't remove this value"
                                            v-validate="'required'"
                                            :class="{ invalid: errors.has('privacyLevel') && formSubmitted }"
                                            v-show="customLicense && initialPrivacyLevel !== 'Public'"
                                        ></multiselect>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="modify">
                                            Derivation
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether the creation and distribution of any update, adaptation, or any other alteration of the data asset or of a substantial part of the data asset that constitutes a derivative data asset is allowed, with permissions to modify, excerpt, annotate, aggregate the original data asset.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="derivation"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.derivation"
                                            disabled="true"
                                            v-show="!customLicense || dataset.metadata.privacyLevel === 'Confidential'"
                                        />
                                        <multiselect
                                            name="derivation"
                                            v-model="dataset.metadata.derivation"
                                            @input="licenseDetailsChanged = true"
                                            placeholder="Select derivation, otherwise it is considered as 'Prohibited'"
                                            :options="derivationOptions"
                                            :searchable="false"
                                            :limit="3"
                                            :multiple="true"
                                            :close-on-select="false"
                                            :clear-on-select="false"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('derivation') && formSubmitted }"
                                            v-show="customLicense && dataset.metadata.privacyLevel !== 'Confidential'"
                                        ></multiselect>
                                    </div>
                                    <div
                                        class="position-relative form-group col-sm-6"
                                        v-show="dataset.metadata.privacyLevel !== 'Confidential'"
                                    >
                                        <label for="attribution">
                                            Attribution
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether it is required to give credit to copyright owner and/or asset provider.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="attribution"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.attribution"
                                            disabled="true"
                                            v-show="!customLicense"
                                        />
                                        <multiselect
                                            name="attribution"
                                            v-model="dataset.metadata.attribution"
                                            @input="licenseDetailsChanged = true"
                                            placeholder="Select attribution"
                                            :options="requiredOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            deselect-label="Can't remove this value"
                                            v-validate="'required_if:status,Private,Public'"
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
                                                    'An indication whether from a given data asset, temporary or permanent reproductions can be created by any means and in any form, in whole or in part.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="reproduction"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.reproduction"
                                            disabled="true"
                                            v-show="!customLicense || dataset.metadata.privacyLevel === 'Confidential'"
                                        />
                                        <multiselect
                                            name="reproduction"
                                            v-model="dataset.metadata.reproduction"
                                            @input="licenseDetailsChanged = true"
                                            placeholder="Select reproduction"
                                            :options="allowedProhibitedOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            deselect-label="Can't remove this value"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('reproduction') && formSubmitted }"
                                            v-show="customLicense && dataset.metadata.privacyLevel !== 'Confidential'"
                                        ></multiselect>
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="distribution">
                                            Distribution
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether restricted or unrestricted publication and distribution of the data asset is allowed.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="distribution"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.distribution"
                                            disabled="true"
                                            v-show="!customLicense || dataset.metadata.privacyLevel === 'Confidential'"
                                        />
                                        <multiselect
                                            name="distribution"
                                            v-model="dataset.metadata.distribution"
                                            @input="licenseDetailsChanged = true"
                                            placeholder="Select distribution"
                                            :options="allowedProhibitedOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            deselect-label="Can't remove this value"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('distribution') && formSubmitted }"
                                            v-show="customLicense && dataset.metadata.privacyLevel !== 'Confidential'"
                                        ></multiselect>
                                    </div>
                                </div>
                                <div class="row" v-show="dataset.metadata.privacyLevel !== 'Confidential'">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="targetPurpose">
                                            Target Purpose
                                            <tooltip
                                                v-b-tooltip="
                                                    'The intended use that the data provider allows, i.e. for business purposes, for academic purposes, for scientific purposes, for personal purposes, for non-profit purposes.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="targetPurpose"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.targetPurpose"
                                            disabled="true"
                                            v-show="!customLicense"
                                        />
                                        <multiselect
                                            name="targetPurpose"
                                            v-model="dataset.metadata.targetPurpose"
                                            placeholder="Select target purpose"
                                            :options="targetPurposeOptions"
                                            :searchable="false"
                                            :limit="3"
                                            :multiple="true"
                                            :close-on-select="false"
                                            :clear-on-select="false"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('targetPurpose') && formSubmitted }"
                                            v-show="customLicense"
                                        ></multiselect>
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="targetIndustry">
                                            Target Industry
                                            <tooltip
                                                v-b-tooltip="
                                                    'The target industry for the data asset within and beyond the aviation data value chain stakeholders.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="targetIndustry"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.targetIndustry"
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
                                            v-model="dataset.metadata.targetIndustry"
                                            placeholder="Select target industry"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('targetIndustry') && formSubmitted }"
                                            v-show="customLicense"
                                        />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="onlineStorage">
                                            Offline Retention
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether storage beyond the ICARUS platform (i.e. local downloading) is permitted for the data asset.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="onlineStorage"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.onlineStorage"
                                            disabled="true"
                                            v-show="!customLicense || dataset.metadata.privacyLevel === 'Confidential'"
                                        />
                                        <multiselect
                                            name="onlineStorage"
                                            v-model="dataset.metadata.onlineStorage"
                                            @input="licenseDetailsChanged = true"
                                            placeholder="Select offline retention"
                                            :options="allowedProhibitedOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            deselect-label="Can't remove this value"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('onlineStorage') && formSubmitted }"
                                            v-show="customLicense && dataset.metadata.privacyLevel !== 'Confidential'"
                                        ></multiselect>
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="reContext">
                                            Re-context
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether restricted or unrestricted use of the data asset in a different context is allowed.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="reContext"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.reContext"
                                            disabled="true"
                                            v-show="!customLicense || dataset.metadata.privacyLevel === 'Confidential'"
                                        />
                                        <multiselect
                                            name="reContext"
                                            v-model="dataset.metadata.reContext"
                                            @input="licenseDetailsChanged = true"
                                            placeholder="Select re-context"
                                            :options="allowedProhibitedOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            deselect-label="Can't remove this value"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('reContext') && formSubmitted }"
                                            v-show="customLicense && dataset.metadata.privacyLevel !== 'Confidential'"
                                        ></multiselect>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="shareAlike">
                                            Share Alike
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether any transformation or building upon the dataset requires distribution under the same license as the original.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="shareAlike"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.shareAlike"
                                            disabled="true"
                                            v-show="!customLicense || dataset.metadata.privacyLevel === 'Confidential'"
                                        />
                                        <multiselect
                                            name="shareAlike"
                                            v-model="dataset.metadata.shareAlike"
                                            @input="licenseDetailsChanged = true"
                                            placeholder="Select share alike"
                                            :options="shareAlikeOptions"
                                            :searchable="false"
                                            :allow-empty="false"
                                            deselect-label="Can't remove this value"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('shareAlike') && formSubmitted }"
                                            v-show="customLicense && dataset.metadata.privacyLevel !== 'Confidential'"
                                        ></multiselect>
                                    </div>
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="link">
                                            Link
                                            <tooltip
                                                v-b-tooltip="'A link to the exact legal terms of the specific license.'"
                                            />
                                        </label>
                                        <input
                                            name="link"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.link"
                                            disabled="true"
                                            v-show="!customLicense"
                                        />
                                        <input
                                            name="link"
                                            placeholder="Enter link"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.link"
                                            v-validate="'required_if:status,Private,Public'"
                                            :class="{ invalid: errors.has('link') && formSubmitted }"
                                            v-show="customLicense"
                                        />
                                    </div>
                                </div>
                                <div class="row" v-if="dataset.metadata.privacyLevel === 'Public'">
                                    <div class="position-relative form-group col-sm-6">
                                        <label for="copyrightOwner">
                                            Copyright Owner
                                            <tooltip
                                                v-b-tooltip="
                                                    'The organization owning or managing rights over the data asset and officially acting as the data provider.'
                                                "
                                            />
                                        </label>
                                        <input
                                            name="copyrightOwner"
                                            placeholder="Enter copyright owner"
                                            type="text"
                                            class="form-control"
                                            v-model="dataset.metadata.copyrightOwner"
                                            v-validate="'required_if:status,Public'"
                                            :class="{ invalid: errors.has('copyrightOwner') && formSubmitted }"
                                        />
                                    </div>
                                </div>
                                <div
                                    v-show="
                                        customLicense &&
                                        dataset.metadata.privacyLevel !== 'Confidential' &&
                                        dataset.metadata.privacyLevel !== 'Public' &&
                                        dataset.status !== 'Public'
                                    "
                                >
                                    <br />
                                    <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                        Pricing Details
                                    </h6>
                                    <br />
                                    <div class="row">
                                        <div class="position-relative form-group col-sm-12">
                                            <label for="paymentMethod">
                                                Payment Method
                                                <tooltip
                                                    v-b-tooltip="
                                                        'The applicable payment method that the data provider has defined in order for the payment to be conducted “offline” (outside the ICARUS platform), e.g. credit/debit card, bank transfer, online payment services.'
                                                    "
                                                />
                                            </label>
                                            <multiselect
                                                name="paymentMethod"
                                                v-model="dataset.metadata.paymentMethod"
                                                :options="paymentMethodOptions"
                                                :multiple="true"
                                                :close-on-select="false"
                                                :clear-on-select="false"
                                                :preserve-search="true"
                                                :searchable="false"
                                                placeholder="Select payment method"
                                                :limit="4"
                                                v-validate="'required_if:status,Private'"
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
                                                        'The applicable cost calculation scheme for the data asset that may range from fixed per row and fixed per asset to request dependent.'
                                                    "
                                                />
                                            </label>
                                            <multiselect
                                                name="calculationScheme"
                                                v-model="dataset.metadata.calculationScheme"
                                                placeholder="Select calculation scheme"
                                                :options="calculationSchemeOptions"
                                                :searchable="false"
                                                :allow-empty="false"
                                                deselect-label="Can't remove this value"
                                                v-validate="'required_if:status,Private'"
                                                :class="{ invalid: errors.has('calculationScheme') && formSubmitted }"
                                            ></multiselect>
                                        </div>
                                        <div
                                            class="position-relative form-group col-sm-6"
                                            v-if="dataset.metadata.calculationScheme !== 'Request Dependent'"
                                        >
                                            <label for="amount">
                                                Amount
                                                <tooltip
                                                    v-b-tooltip="
                                                        'The price for the acquisition of the data asset including its currency, if it is fixed per asset.'
                                                    "
                                                />
                                            </label>

                                            <div class="input-group">
                                                <input
                                                    name="amount"
                                                    placeholder="Enter amount"
                                                    type="text"
                                                    class="form-control"
                                                    v-model="dataset.metadata.amount"
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
                            <b-tab v-if="dataset.status === 'Private'" title="Access Policy" class="custom-tab">
                                <div class="col-12">
                                    <div class="alert alert-warning" role="alert" v-if="!publicAccess">
                                        <font-awesome-icon icon="info-circle" />
                                        <span class="ml-2">
                                            A Private asset needs to be accompanied by appropriate access policies,
                                            otherwise it is treated as Confidential.
                                        </span>
                                    </div>
                                    <div class="alert alert-warning" role="alert" v-if="publicAccess">
                                        <font-awesome-icon icon="info-circle" />
                                        <span class="ml-2">
                                            All organizations can access the dataset.
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
                    </b-card>
                </div>
            </div>
        </div>
        <terms-modal :accept-callback="createLicenseContract" :reject-callback="update" />
        <unlock-wallet-modal :id="'unlockWalletUpdate'" :callback="updateLicenseContract" />
        <progress-modal :message="message" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';
import Treeselect from '@riophae/vue-treeselect';
import * as R from 'ramda';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Category, DataAsset, DataCheckin } from '@/api';
import { PageTitle, Tooltip } from '@/components';
import TermsModal from '@/layouts/architect/components/modals/TermsModal.vue';
import UnlockWalletModal from '@/layouts/architect/components/modals/UnlockWalletModal.vue';
import ProgressModal from '@/layouts/architect/components/modals/ProgressModal.vue';
import VueQueryBuilder from 'vue-query-builder';
import datasetOptions from '@/config/dataset.json';
import licenses from '@/config/licenses.json';
import { ethers } from 'ethers';
import { keccak256 } from 'js-sha3';
import * as abi from '@/config/contracts-abi';
import { terms } from '@/config/terms-of-use.json';

library.add(faExclamationCircle, faExclamationTriangle);

export default {
    name: 'Dataset',
    components: {
        Multiselect,
        DatePicker,
        Treeselect,
        FontAwesomeIcon,
        PageTitle,
        Tooltip,
        TermsModal,
        UnlockWalletModal,
        ProgressModal,
        VueQueryBuilder,
    },
    filters: {
        capitalize(s) {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        },
    },
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },
    data: () => ({
        isLoading: true,
        message: '',
        temporalCoverage: [],
        dataset: {
            name: '',
            description: '',
            status: null,
            categories: [],
            metadata: {
                tags: [],
                velocity: 'Batch',
                frequency: null,
                temporalCoverage: [],
                spatialCoverage: [],
                language: [],
                accessibility: null,
                standards: null,
                license: null,
                copyrightOwner: null,
                privacyLevel: null,
                derivation: null,
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
                currency: 'EUR',
                paymentMethod: [],
                ethaddress: null,
            },
        },
        metadataPlaceholder: {
            tags: [],
            velocity: 'Batch',
            frequency: null,
            temporalCoverage: [],
            spatialCoverage: [],
            language: [],
            copyrightOwner: null,
            accessibility: null,
            standards: null,
            license: null,
            privacyLevel: null,
            derivation: null,
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
            currency: 'EUR',
            paymentMethod: [],
        },
        formSubmitted: false,
        yesNoOptions: datasetOptions.yesNoOptions,
        requiredOptions: datasetOptions.requiredOptions,
        allowedProhibitedOptions: datasetOptions.allowedProhibitedOptions,
        shareAlikeOptions: datasetOptions.shareAlikeOptions,
        statusOptions: datasetOptions.statusOptions,
        velocityOptions: datasetOptions.velocityOptions,
        frequencyOptions: datasetOptions.frequencyOptions,
        tagOptions: [],
        countryOptions: datasetOptions.countryOptions,
        languageOptions: datasetOptions.languageOptions,
        accessibilityOptions: datasetOptions.accessibilityOptions,
        licenseOptions: datasetOptions.licenseOptions,
        privacyLevelOptions: datasetOptions.privacyLevelOptions,
        derivationOptions: datasetOptions.derivationOptions,
        targetPurposeOptions: datasetOptions.targetPurposeOptions,
        targetIndustryOptions: datasetOptions.targetIndustryOptions,
        calculationSchemeOptions: datasetOptions.calculationSchemeOptions,
        paymentMethodOptions: datasetOptions.paymentMethodOptions,
        rules: {},
        query_filters: [],
        authorization: {},
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
        currencies: ['EUR', 'USD', 'GBP'],
        selectedCurrency: 'EUR',
        amountDisabled: false,
        previousRoute: null,
        categoryOptions: [],
        datasetImage: null,
        licenses,
        terms,
        licenseDetailsChanged: false,
        initialPrivacyLevel: null,
        apiImport: false,
        publicAccess: false,
    }),
    computed: {
        ...mapState(['organization']),
        ...mapState('eth', ['contractAddress']),
        customLicense() {
            if (
                this.dataset.metadata.license === undefined ||
                this.dataset.metadata.license === null ||
                this.dataset.metadata.license === 'Custom'
            ) {
                return true;
            }
            return false;
        },
        filteredLicenseOptions() {
            if (this.initialPrivacyLevel === 'Public') {
                return this.licenseOptions.filter((l) => l.label !== 'Custom');
            }
            return this.licenseOptions;
        },
        filteredPrivacyLevelOptions() {
            if (this.initialPrivacyLevel !== 'Public' && this.initialPrivacyLevel !== null) {
                return this.privacyLevelOptions.filter((p) => p !== 'Public');
            }
            if (this.initialPrivacyLevel === 'Public') {
                return this.privacyLevelOptions.filter((p) => p === 'Public');
            }
            return this.privacyLevelOptions;
        },
    },
    watch: {
        temporalCoverage(newDate) {
            this.dataset.metadata.temporalCoverage = newDate;
            if (this.$refs.datepicker) {
                this.$refs.datepicker.closePopup();
            }
        },
    },
    async created() {
        const [
            { data: dataset },
            { data: authorization },
            { data: categories },
            { data: filters },
        ] = await Promise.all([
            DataAsset.get(this.id),
            DataAsset.getAuthorization(this.id),
            Category.all(),
            DataAsset.getFilters(),
        ]);
        const { data: job } = await DataCheckin.get(dataset.jobid);
        this.apiImport = job.apiImport;

        this.dataset.metadata.velocity = this.apiImport ? 'Near Real-Time' : 'Batch';
        this.metadataPlaceholder.velocity = this.apiImport ? 'Near Real-Time' : 'Batch';

        this.dataset.metadata.accessibility = this.apiImport ? 'Through API' : null;
        this.metadataPlaceholder.accessibility = this.apiImport ? 'Through API' : null;

        if (authorization && authorization.publicAccess) {
            this.publicAccess = authorization.publicAccess;
        } else {
            this.publicAccess = false;
        }
        if (authorization && authorization.context) {
            if (Object.entries(authorization.context).length !== 0) {
                this.rules = R.clone(authorization.context);
                this.publicAccess = authorization.publicAccess;
            }
        }
        this.categoryOptions = categories;
        this.countryOptions.forEach((global) => {
            global.children = R.sortBy(R.prop('label'), global.children);
            global.children.forEach((continent) => {
                continent.children = R.sortBy(R.prop('label'), continent.children);
            });
        });
        this.dataset = dataset;
        if (R.isEmpty(this.dataset.metadata)) {
            this.dataset.metadata = R.clone(this.metadataPlaceholder);
        }
        if (this.dataset.metadata && this.dataset.metadata.temporalCoverage) {
            this.temporalCoverage = this.dataset.metadata.temporalCoverage;
        }
        this.initialPrivacyLevel =
            this.dataset.metadata && this.dataset.metadata.privacyLevel
                ? this.dataset.metadata.privacyLevel
                : this.dataset.status;
        if (this.initialPrivacyLevel !== null && this.initialPrivacyLevel !== 'Public') {
            this.dataset.metadata.license = 'Custom';
            this.alterStatus(this.initialPrivacyLevel);
        }
        if (this.dataset.metadata.currency) {
            this.selectedCurrency = this.dataset.metadata.currency;
        }
        this.query_filters = filters;
        if (this.organization.id === 1) {
            this.dataset.metadata.privacyLevel = 'Public';
            this.initialPrivacyLevel = 'Public';
            this.dataset.status = 'Public';
        }
        if (!this.dataset.metadata.privacyLevel) {
            this.dataset.metadata.privacyLevel = this.dataset.status;
        }

        const { data: jobInfo } = await DataCheckin.get(dataset.jobid);
        this.dataset.metadata.fieldsInfo = jobInfo.configuration.fields.reduce(
            (info, obj) =>
                R.assoc(
                    obj.mapped_field,
                    {
                        encrypted: obj.encrypted,
                        searchable: obj.searchable,
                        cleaning: !!obj.cleaning,
                        anonymization: Object.keys(obj.anonymization).length > 0,
                    },
                    info,
                ),
            {},
        );

        this.isLoading = false;
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.previousRoute = from;
            if (from.name === 'edit-check-in' || from.name === null) {
                vm.previousRoute = { name: 'home' };
            }
        });
    },
    methods: {
        addTag(newTag) {
            this.tagOptions.push(newTag);
            if (this.dataset.metadata && !this.dataset.metadata.tags) {
                this.dataset.metadata.tags = [];
            }
            this.dataset.metadata.tags.push(newTag);
        },
        submit() {
            this.checkDerivation(this.dataset.metadata.derivation);
            this.formSubmitted = true;
            this.$validator.validateAll().then((success) => {
                if (success) {
                    if (this.$store.state.eth.wallet === null) {
                        this.update();
                    } else if (this.dataset.updated === null) {
                        this.$swal({
                            title:
                                'Do you want to optionally write the license of your data asset in the ICARUS blockchain as well?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#31679B',
                            confirmButtonText:
                                '<div style="white-space: pre;"> Store in the ICARUS platform only </div>',
                            cancelButtonText: 'Store in the ICARUS blockchain too',
                        }).then(async (result) => {
                            if (result.value) {
                                this.update();
                            } else {
                                this.$bvModal.show('termsModal');
                            }
                        });
                    } else if (!this.dataset.metadata.ethaddress) {
                        this.update();
                    } else if (this.licenseDetailsChanged) {
                        this.$bvModal.show('unlockWalletUpdate');
                    } else {
                        this.update();
                    }
                } else {
                    this.$toastr.e('One or more fields require your attention', 'Error');
                }
            });
        },
        async update() {
            this.authorization.id = this.id;
            this.authorization.organizationId = this.dataset.organization.id;
            if (this.dataset.status === 'Private') {
                this.authorization.context = this.rules;
                this.authorization.publicAccess = this.publicAccess;
            } else {
                this.authorization.context = {};
                this.authorization.publicAccess = this.publicAccess;
            }
            this.dataset.id = this.id;
            if (this.dataset.metadata.calculationScheme === 'Request Dependent') {
                delete this.dataset.metadata.amount;
            }

            const promises = [
                DataAsset.update(this.id, this.dataset),
                DataAsset.updateAuthorization(this.id, this.authorization),
            ];

            if (this.datasetImage) {
                const imageData = new FormData();
                imageData.append('file', this.datasetImage);
                promises.push(DataAsset.updateImage(this.id, imageData));
            }
            Promise.all(promises)
                .then(() => {
                    this.$toastr.s('Dataset updated!', 'Success');
                    this.$router.push(this.previousRoute);
                })
                .catch(() => {
                    this.$toastr.e('An error occured', 'Error');
                });
        },
        cancel() {
            this.$router.push(this.previousRoute);
        },
        selectCurrency(option) {
            this.dataset.metadata.currency = option;
            this.selectedCurrency = option;
        },
        alterStatus(selectedOption) {
            this.dataset.status = selectedOption;
            if (selectedOption === 'Confidential') {
                this.dataset.metadata.derivation = ['Prohibited'];
                this.dataset.metadata.attribution = 'Not applicable';
                this.dataset.metadata.reproduction = 'Prohibited';
                this.dataset.metadata.distribution = 'Prohibited';
                this.dataset.metadata.shareAlike = 'Not applicable';
                this.dataset.metadata.reContext = 'Prohibited';
                this.dataset.metadata.onlineStorage = 'Prohibited';
                this.dataset.metadata.targetPurpose = null;
                this.dataset.metadata.targetIndustry = null;
                this.dataset.metadata.link = null;
                this.dataset.metadata.paymentMethod = null;
                this.dataset.metadata.calculationScheme = null;
                this.dataset.metadata.amount = null;
                this.dataset.metadata.copyrightOwner = null;
            } else {
                this.dataset.metadata.derivation = null;
                this.dataset.metadata.reproduction = null;
                this.dataset.metadata.distribution = null;
                this.dataset.metadata.onlineStorage = null;
                this.dataset.metadata.reContext = null;
                this.dataset.metadata.shareAlike = null;
                this.dataset.metadata.copyrightOwner = null;
            }
        },
        checkLicense(node) {
            if (node && node.label !== 'Custom') {
                const licenseMetadata = this.licenses.find((element) => element.license === node.label);
                if (licenseMetadata) {
                    this.dataset.metadata.license = licenseMetadata.license;
                    this.dataset.metadata.privacyLevel = licenseMetadata.privacyLevel;
                    this.alterStatus(this.dataset.metadata.privacyLevel);
                    this.dataset.metadata.derivation = licenseMetadata.derivation;
                    this.dataset.metadata.attribution = licenseMetadata.attribution;
                    this.dataset.metadata.reproduction = licenseMetadata.reproduction;
                    this.dataset.metadata.distribution = licenseMetadata.distribution;
                    this.dataset.metadata.targetPurpose = licenseMetadata.targetPurpose;
                    this.dataset.metadata.targetIndustry = licenseMetadata.targetIndustry;
                    this.dataset.metadata.onlineStorage = licenseMetadata.onlineStorage;
                    this.dataset.metadata.reContext = licenseMetadata.reContext;
                    this.dataset.metadata.shareAlike = licenseMetadata.shareAlike;
                    this.dataset.metadata.link = licenseMetadata.link;
                }
            } else if (node && node.label === 'Custom') {
                this.dataset.metadata.license = 'Custom';
                if (this.initialPrivacyLevel !== 'Public' && this.organization && this.organization.id !== 1) {
                    this.dataset.metadata.privacyLevel = null;
                    this.alterStatus(this.dataset.metadata.privacyLevel);
                }
                this.dataset.metadata.derivation = null;
                this.dataset.metadata.attribution = null;
                this.dataset.metadata.reproduction = null;
                this.dataset.metadata.distribution = null;
                this.dataset.metadata.targetPurpose = null;
                this.dataset.metadata.targetIndustry = null;
                this.dataset.metadata.onlineStorage = null;
                this.dataset.metadata.reContext = null;
                this.dataset.metadata.shareAlike = null;
                this.dataset.metadata.link = null;
                this.dataset.metadata.paymentMethod = null;
                this.dataset.metadata.calculationScheme = null;
                this.dataset.metadata.amount = null;
            }
        },
        checkDerivation(value) {
            if (!value || value.length === 0) {
                this.dataset.metadata.derivation = ['Prohibited'];
            }
        },
        getPrivacyLevel(privacyLevel) {
            switch (privacyLevel) {
                case 'Confidential':
                    return 0;
                case 'Private':
                    return 1;
                case 'Public':
                    return 2;
                default:
                    return -1;
            }
        },
        getNecessityStatus(necessityStatus) {
            switch (necessityStatus) {
                case 'Required':
                    return 0;
                case 'Not required':
                    return 1;
                case 'Not applicable':
                    return 2;
                default:
                    return -1;
            }
        },
        getShareAlikeStatus(shareAlikeStatus) {
            switch (shareAlikeStatus) {
                case 'Required':
                    return 0;
                case 'Not required':
                    return 1;
                case 'Not applicable':
                    return 1;
                default:
                    return -1;
            }
        },
        getPermissionStatus(permissionStatus) {
            switch (permissionStatus) {
                case 'Allowed':
                    return 0;
                case 'Prohibited':
                    return 1;
                default:
                    return -1;
            }
        },
        async createLicenseContract(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');
            // Connect to contract
            const contractFactory = new ethers.Contract(this.contractAddress, abi.core, myWallet);
            // Create smart contract
            this.message = 'Creating Smart Contract...';
            const tx = await contractFactory.createLicenseContract(
                keccak256.array(`${this.organization.id}${this.dataset.id}`), // Hash of asset, prefixed with provider id
                this.dataset.metadata.license,
                this.getPrivacyLevel(this.dataset.metadata.privacyLevel),
                this.dataset.metadata.derivation.join(','),
                this.getNecessityStatus(this.dataset.metadata.attribution),
                this.getPermissionStatus(this.dataset.metadata.reproduction),
                this.getPermissionStatus(this.dataset.metadata.distribution),
                this.getPermissionStatus(this.dataset.metadata.onlineStorage),
                this.getPermissionStatus(this.dataset.metadata.reContext),
                this.getShareAlikeStatus(this.dataset.metadata.shareAlike),
                keccak256.array(this.terms),
                { gasLimit: 4700000 },
            );
            // Wait for contract to be mined and get its address
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while...';
            const receipt = await tx.wait();
            const contractCreated = receipt.events.pop();
            const contractAddress = contractCreated.args[0];
            // Save dataset ethaddress and metadata to platform
            this.message = 'Saving to ICARUS database';
            this.dataset.metadata.ethaddress = contractAddress;
            this.$bvModal.hide('progressModal');
            this.update();
        },
        async updateLicenseContract(myWallet) {
            this.message = 'Connecting...';
            this.$bvModal.show('progressModal');
            // Connect to contract
            const licenseContract = new ethers.Contract(
                this.dataset.metadata.ethaddress,
                abi.licenseContract,
                myWallet,
            );
            // Update smart contract
            this.message = 'Updating Smart Contract...';
            const tx = await licenseContract.updateLicenseContract(
                this.dataset.metadata.license,
                this.getPrivacyLevel(this.dataset.metadata.privacyLevel),
                this.dataset.metadata.derivation.join(','),
                this.getNecessityStatus(this.dataset.metadata.attribution),
                this.getPermissionStatus(this.dataset.metadata.reproduction),
                this.getPermissionStatus(this.dataset.metadata.distribution),
                this.getPermissionStatus(this.dataset.metadata.onlineStorage),
                this.getPermissionStatus(this.dataset.metadata.reContext),
                this.getShareAlikeStatus(this.dataset.metadata.shareAlike),
                { gasLimit: 4700000 },
            );
            // Wait for contract to be mined
            this.message = 'Waiting for transaction to be mined and confirmed. This might take a while...';
            await tx.wait();

            // Save dataset metadata to platform
            this.message = 'Saving to ICARUS database';
            this.$bvModal.hide('progressModal');
            this.update();
        },
    },
};
</script>

<style lang="scss">
.edit-dataset {
    .dataset-image {
        display: block;
        background-clip: padding-box;
        // margin: auto;
        width: 120px;
    }

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
}
</style>
