<template>
    <div>
        <div class="loading-indicator" v-if="isLoading">
            <Spinner name="wave" color="var(--primary)" no-fade-in />
            <h6 class="message">Loading dataset. Please wait...</h6>
        </div>
        <div class="dataset" v-else>
            <div
                class="mb-3 card header"
                :class="{ 'default-bg-image': !hasImage }"
                :style="{ 'background-image': getImageUrl() }"
            >
                <div class="overlay"></div>
                <div class="no-gutters row">
                    <div class="col-sm-12 col-md-12 col-xl-12 content">
                        <div class="d-flex align-items-center">
                            <h1>{{ dataset.name }}</h1>
                            <div style="cursor: pointer;">
                                <font-awesome-icon
                                    icon="star"
                                    @click="
                                        changeState(dataset.id);
                                        $event.stopImmediatePropagation();
                                    "
                                    class="favorite-button ml-2 mb-1"
                                    :class="
                                        favoriteDatasets.find((fav) => fav === dataset.id) ? 'full-star' : 'empty-star'
                                    "
                                    v-b-tooltip.hover="
                                        favoriteDatasets.find((fav) => fav === dataset.id)
                                            ? 'Remove from favorites'
                                            : 'Add to favorites'
                                    "
                                />
                            </div>
                        </div>
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
                                    <div class="widget-heading">{{ dataset.organization.name }}</div>
                                </div>
                                <div class="widget-content-right">
                                    <div class="button-wrapper">
                                        <b-button
                                            class="btn-hover-shine btn-shadow btn-transition btn-sm btn-wide"
                                            v-if="organization.id === dataset.organization.id"
                                            variant="light"
                                            @click="$router.push({ name: 'assets.dataset.edit', params: { id: id } })"
                                        >
                                            <font-awesome-icon icon="edit" />
                                            &nbsp; Edit
                                        </b-button>

                                        <b-button
                                            class="btn-hover-shine btn-sm btn-shadow btn-transition purchase-button"
                                            v-if="
                                                organization.id !== dataset.organization.id &&
                                                organization.id !== 1 &&
                                                dataset.status !== 'Public' &&
                                                activeContracts.indexOf(dataset.id) === -1 &&
                                                pendingContracts.indexOf(dataset.id) === -1
                                            "
                                            variant="warning"
                                            @click="
                                                $router.push({
                                                    name: 'marketplace.quotation',
                                                    params: { assetId: dataset.id, assetType: 'dataset' },
                                                })
                                            "
                                        >
                                            <font-awesome-icon icon="shopping-cart" />
                                            &nbsp; Purchase
                                        </b-button>

                                        <b-button
                                            class="btn-sm purchase-button text-dark"
                                            v-if="
                                                organization.id !== dataset.organization.id &&
                                                dataset.status === 'Public' &&
                                                activeContracts.indexOf(dataset.id) === -1 &&
                                                pendingContracts.indexOf(dataset.id) === -1
                                            "
                                            variant="light"
                                            @click="
                                                getOpenData(dataset.id);
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
                                    <div class="col-sm-9" v-if="dataset.description">
                                        <div class="field-heading">
                                            Description
                                            <tooltip
                                                v-b-tooltip="
                                                    'A brief overview that acts as an account of the data asset’s contents.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.description }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.tags.length > 0">
                                        <div class="field-heading">
                                            Tags
                                            <tooltip
                                                v-b-tooltip="
                                                    'A list of keywords and / or arbitrary textual tags associated with the data asset by its data provider.'
                                                "
                                            />
                                        </div>
                                        <span
                                            class="badge badge-info tag"
                                            v-for="(tag, index) in dataset.metadata.tags"
                                            :key="index"
                                        >
                                            {{ tag }}
                                        </span>
                                    </div>
                                </div>
                                <br v-if="dataset.description || dataset.metadata.tags.length > 0" />
                                <div class="row">
                                    <div class="col-sm-3" v-if="dataset.categories.length > 0">
                                        <div class="field-heading">
                                            Categories
                                            <tooltip
                                                v-b-tooltip="
                                                    'A classification of the data asset according to the concepts of the ICARUS aviation data model it currently includes.'
                                                "
                                            />
                                        </div>
                                        <span
                                            class="text-muted"
                                            v-for="(category, index) in dataset.categories"
                                            :key="index"
                                        >
                                            {{ category.name }}
                                            <span v-if="index + 1 < dataset.categories.length">,</span>
                                        </span>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="field-heading">
                                            Status
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication of whether the dataset is available in the ICARUS platform.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.datasetStatus | capitalize }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.created">
                                        <div class="field-heading">
                                            Date Available
                                            <tooltip
                                                v-b-tooltip="
                                                    'The date when the data asset became available in the ICARUS platform.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.created }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.updated">
                                        <div class="field-heading">
                                            Date Modified
                                            <tooltip
                                                v-b-tooltip="
                                                    'The date when the data asset was last updated / changed in the ICARUS platform.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.updated }}</div>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                    Features
                                </h6>
                                <br />
                                <div class="row">
                                    <div class="col-sm-3" v-if="dataset.metadata.size">
                                        <div class="field-heading">
                                            Volume
                                            <tooltip
                                                v-b-tooltip="
                                                    'The scale / amount of data within the data asset, e.g. X GBs / records / transactions in total or per hour / day / month.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">
                                            {{ dataset.metadata.size }}
                                        </div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.final_cleaning_number_of_rows">
                                        <div class="field-heading">
                                            Rows
                                            <tooltip v-b-tooltip="'The total number of rows within the data asset.'" />
                                        </div>
                                        <div class="text-muted">
                                            {{ dataset.metadata.final_cleaning_number_of_rows | formatNumber }}
                                        </div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.columns.length > 0">
                                        <div class="field-heading">
                                            Columns
                                            <tooltip
                                                v-b-tooltip="'The total number of columns within the data asset.'"
                                            />
                                        </div>
                                        <div class="text-muted">
                                            {{ dataset.columns.length | formatNumber }}
                                        </div>
                                    </div>
                                </div>
                                <br
                                    v-if="
                                        dataset.metadata.size ||
                                        dataset.metadata.final_cleaning_number_of_rows ||
                                        dataset.columns.length > 0
                                    "
                                />
                                <div class="row">
                                    <div class="col-sm-3" v-if="dataset.metadata.velocity">
                                        <div class="field-heading">
                                            Velocity
                                            <tooltip
                                                v-b-tooltip="
                                                    'The speed with which the data asset becomes available in ICARUS, i.e. Streaming, Real-time, Near Real-time, Micro-Batch, Batch. By default, the current release of the ICARUS platform only supports the batch mode.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.velocity }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.frequency">
                                        <div class="field-heading">
                                            Frequency
                                            <tooltip
                                                v-b-tooltip="
                                                    'The rate at which the data have been collected, i.e. Hourly, Daily, Weekly, Monthly, Yearly, other.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.frequency }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.temporalCoverage.length > 0">
                                        <div class="field-heading">
                                            Temporal Coverage
                                            <tooltip
                                                v-b-tooltip="
                                                    'A named period, date, or date range that the data asset covers.'
                                                "
                                            />
                                        </div>
                                        <span
                                            class="text-muted"
                                            v-for="(date, index) in dataset.metadata.temporalCoverage"
                                            :key="index"
                                        >
                                            {{ date }}
                                            <span v-if="index + 1 < dataset.metadata.temporalCoverage.length">~</span>
                                        </span>
                                    </div>
                                    <div class="col-sm-3" v-if="spatialCoverage.length > 0">
                                        <div class="field-heading">
                                            Spatial Coverage
                                            <tooltip
                                                v-b-tooltip="
                                                    'The list of countries or locations to which the data asset refers.'
                                                "
                                            />
                                        </div>
                                        <span class="text-muted" v-for="(value, index) in spatialCoverage" :key="index">
                                            <span>{{ value }}</span>
                                            <span v-if="index + 1 < spatialCoverage.length">,&nbsp;</span>
                                        </span>
                                    </div>
                                </div>
                                <br
                                    v-if="
                                        dataset.metadata.velocity ||
                                        dataset.metadata.frequency ||
                                        dataset.metadata.temporalCoverage.length > 0 ||
                                        spatialCoverage.length > 0
                                    "
                                />
                                <div class="row">
                                    <div class="col-sm-3" v-if="dataset.metadata.language.length > 0">
                                        <div class="field-heading">
                                            Language
                                            <tooltip v-b-tooltip="'The language of the data asset.'" />
                                        </div>
                                        <span
                                            class="text-muted"
                                            v-for="(lang, index) in dataset.metadata.language"
                                            :key="index"
                                        >
                                            <span v-if="languageOptions.find((language) => language.id === lang)">
                                                {{ languageOptions.find((language) => language.id === lang).label }}
                                            </span>
                                            <span v-if="index + 1 < dataset.metadata.language.length">,</span>
                                        </span>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.accessibility">
                                        <div class="field-heading">
                                            Accessibility
                                            <tooltip
                                                v-b-tooltip="
                                                    'The method by which the data asset can become accessible to a data consumer, e.g. through API, as a downloadable file, as database extract, other.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">
                                            {{ dataset.metadata.accessibility }}
                                        </div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.standards">
                                        <div class="field-heading">
                                            Standards
                                            <tooltip
                                                v-b-tooltip="
                                                    'A standard or any other specification to which the data asset conforms.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">
                                            {{ dataset.metadata.standards }}
                                        </div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.version">
                                        <div class="field-heading">
                                            Version
                                            <tooltip v-b-tooltip="'The current version of the data asset.'" />
                                        </div>
                                        <div class="text-muted">{{ dataset.version }}</div>
                                    </div>
                                </div>
                            </b-tab>
                            <b-tab title="Sample" class="custom-tab">
                                <div class="row">
                                    <div class="col-sm-4">
                                        <template v-if="dataset.status === 'Public'">
                                            <b-button class="btn-icon" variant="success" size="sm" @click="visualize()">
                                                <font-awesome-icon class="btn-icon-wrapper" icon="chart-area" />
                                                Visualize
                                            </b-button>
                                        </template>
                                    </div>
                                    <div class="col-sm-4 pt-1 text-center">
                                        <div class="badge badge-alternate">
                                            <font-awesome-icon class="text-white" icon="broom" />
                                        </div>
                                        <span class="ml-1">Cleaned</span>
                                        <div class="badge badge-primary ml-4">
                                            <font-awesome-icon class="text-white" icon="user-secret" />
                                        </div>
                                        <span class="ml-1">Anonymized</span>
                                        <div class="badge badge-success ml-4">
                                            <font-awesome-icon class="text-white" icon="lock" />
                                        </div>
                                        <span class="ml-1">Encrypted</span>
                                    </div>
                                    <div class="col-sm-4 download float-right">
                                        <span class="mr-2"><i>Download as:</i></span>
                                        <b-button
                                            class="mr-2 btn-icon"
                                            variant="primary"
                                            size="sm"
                                            @click="downloadCsv()"
                                        >
                                            <font-awesome-icon class="btn-icon-wrapper" icon="download" />
                                            &nbsp; CSV
                                        </b-button>
                                        <b-button
                                            id="downloadAnchorElem"
                                            class="btn-icon"
                                            variant="primary"
                                            size="sm"
                                            @click="downloadJson()"
                                        >
                                            <font-awesome-icon class="btn-icon-wrapper" icon="download" />
                                            &nbsp; JSON
                                        </b-button>
                                    </div>
                                </div>
                                <div class="row mt-4">
                                    <div class="col-sm-12">
                                        <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                            Dataset Structure
                                        </h6>
                                        <div class="table-responsive">
                                            <table class="align-middle mb-0 table table-hover mb-3">
                                                <thead>
                                                    <tr>
                                                        <th class="text-left" width="25%">
                                                            Column Title
                                                            <tooltip
                                                                v-b-tooltip="
                                                                    'The title of each column / concept that appears in the data asset according to the ICARUS aviation data model.'
                                                                "
                                                            />
                                                        </th>
                                                        <th class="text-left" width="45%">
                                                            Column Description
                                                            <tooltip
                                                                v-b-tooltip="
                                                                    'The description provided in the ICARUS aviation data model for the specific column / concept that appears in the data asset.'
                                                                "
                                                            />
                                                        </th>
                                                        <th class="text-left" width="15%">
                                                            Column Type
                                                            <tooltip
                                                                v-b-tooltip="
                                                                    'The type of each column / concept that appears in the data asset.'
                                                                "
                                                            />
                                                        </th>
                                                        <th class="text-left" width="15%">
                                                            Other
                                                            <tooltip
                                                                v-b-tooltip="
                                                                    'Additional information like measurement type, units, etc.'
                                                                "
                                                            />
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item, idx) in columns" :key="idx">
                                                        <td class="text-left" width="25%">
                                                            <span>{{ item.name }}</span>
                                                            <template v-if="dataset.metadata.fieldsInfo">
                                                                <div
                                                                    class="badge badge-alternate ml-2"
                                                                    v-if="
                                                                        dataset.metadata.fieldsInfo[item.name].cleaning
                                                                    "
                                                                >
                                                                    <font-awesome-icon
                                                                        class="text-white"
                                                                        icon="broom"
                                                                    />
                                                                </div>
                                                                <div
                                                                    class="badge badge-primary ml-2"
                                                                    v-if="
                                                                        dataset.metadata.fieldsInfo[item.name]
                                                                            .anonymization
                                                                    "
                                                                >
                                                                    <font-awesome-icon
                                                                        class="text-white"
                                                                        icon="user-secret"
                                                                    />
                                                                </div>
                                                                <div
                                                                    class="badge badge-success ml-2"
                                                                    v-if="
                                                                        dataset.metadata.fieldsInfo[item.name].encrypted
                                                                    "
                                                                >
                                                                    <font-awesome-icon class="text-white" icon="lock" />
                                                                </div>
                                                            </template>
                                                        </td>
                                                        <td class="text-left" width="45%">
                                                            <span>{{ item.definition }}</span>
                                                            <div
                                                                v-if="
                                                                    dataset.metadata.fieldsInfo &&
                                                                    dataset.metadata.fieldsInfo[item.name]
                                                                        .additional_description
                                                                "
                                                            >
                                                                <br />
                                                                <em class="text-muted">
                                                                    {{
                                                                        dataset.metadata.fieldsInfo[item.name]
                                                                            .additional_description
                                                                    }}
                                                                </em>
                                                            </div>
                                                        </td>
                                                        <td class="text-left" width="15%">
                                                            <span>{{ item.type | capitalize }}</span>
                                                        </td>
                                                        <td class="text-left" width="15%"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                            <b-tab title="License" class="custom-tab" v-if="!emptyMetadata">
                                <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                    General Information
                                </h6>
                                <br />
                                <div class="row">
                                    <div class="col-sm-6" v-if="dataset.metadata.license">
                                        <div class="field-heading">
                                            License
                                            <tooltip
                                                v-b-tooltip="
                                                    'The legal statement / terms giving official permission to the data asset in a custom manner or according to well-defined data licenses, e.g. CC Attribution-NonCommercial-ShareAlike (CC BY-NC-SA).'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.license }}</div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="field-heading">
                                            Copyright Owner
                                            <tooltip
                                                v-b-tooltip="
                                                    'The organization owning or managing rights over the data asset and officially acting as the data provider.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted" v-if="dataset.metadata.copyrightOwner">
                                            {{ dataset.metadata.copyrightOwner }}
                                        </div>
                                        <div class="text-muted" v-else>{{ dataset.organization.name }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.privacyLevel">
                                        <div class="field-heading">
                                            Privacy Level
                                            <tooltip
                                                v-b-tooltip="
                                                    'The desired visibility of a data asset, i.e. Confidential (not to be shared), Proprietary/Private (to be shared with appropriate licensing), Public (available to all). Note: a Private asset needs to be accompanied by appropriate access policies, otherwise it is treated as Confidential.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.privacyLevel }}</div>
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-sm-6" v-if="dataset.metadata.link">
                                        <div class="field-heading">
                                            Link
                                            <tooltip
                                                v-b-tooltip="'A link to the exact legal terms of the specific license.'"
                                            />
                                        </div>
                                        <a :href="dataset.metadata.link" target="_blank">{{ dataset.metadata.link }}</a>
                                    </div>
                                    <div
                                        class="col-sm-3"
                                        v-if="
                                            organization.id === dataset.organization.id && dataset.metadata.ethaddress
                                        "
                                    >
                                        <div class="field-heading">
                                            ICARUS Platform Terms of Use
                                            <tooltip v-b-tooltip="'The Terms of Use of the ICARUS platform.'" />
                                        </div>
                                        <a href="javascript:void(0)" @click="downloadPDF()">
                                            <font-awesome-icon class="btn-icon-wrapper" icon="download" />
                                            Download as PDF
                                        </a>
                                    </div>
                                </div>
                                <br
                                    v-if="
                                        dataset.metadata.link ||
                                        (organization.id === dataset.organization.id && dataset.metadata.ethaddress)
                                    "
                                />
                                <br />
                                <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                    Rights & Usage
                                </h6>
                                <br />
                                <div class="row">
                                    <div class="col-sm-3" v-if="dataset.metadata.derivation.length > 0">
                                        <div class="field-heading">
                                            Derivation
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether the creation and distribution of any update, adaptation, or any other alteration of the data asset or of a substantial part of the data asset that constitutes a derivative data asset is allowed, with permissions to modify, excerpt, annotate, aggregate the original data asset.'
                                                "
                                            />
                                        </div>
                                        <div v-if="dataset.metadata.derivation.includes('Prohibited')">
                                            <div class="text-muted">Prohibited</div>
                                        </div>
                                        <div v-else>
                                            <span class="text-muted">Allowed to</span>
                                            <span
                                                class="text-muted"
                                                v-for="(item, index) in dataset.metadata.derivation"
                                                :key="index"
                                            >
                                                {{ item }}
                                                <span v-if="index + 1 < dataset.metadata.derivation.length">,</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.attribution">
                                        <div class="field-heading">
                                            Attribution
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether it is required to give credit to copyright owner and/or asset provider.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.attribution }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.reproduction">
                                        <div class="field-heading">
                                            Reproduction
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether from a given data asset, temporary or permanent reproductions can be created by any means and in any form, in whole or in part.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.reproduction }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.distribution">
                                        <div class="field-heading">
                                            Distribution
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether restricted or unrestricted publication and distribution of the data asset is allowed.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.distribution }}</div>
                                    </div>
                                </div>
                                <br
                                    v-if="
                                        dataset.metadata.derivation.length > 0 ||
                                        dataset.metadata.attribution ||
                                        dataset.metadata.reproduction ||
                                        dataset.metadata.distribution
                                    "
                                />
                                <div class="row" v-if="dataset.metadata.shareAlike">
                                    <div class="col-sm-3">
                                        <div class="field-heading">
                                            Share Alike
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether any transformation or building upon the dataset requires distribution under the same license as the original.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.shareAlike }}</div>
                                    </div>
                                    <div class="col-sm-3" v-if="dataset.metadata.reContext">
                                        <div class="field-heading">
                                            Re-context
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether restricted or unrestricted use of the data asset in a different context is allowed.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">{{ dataset.metadata.reContext }}</div>
                                    </div>
                                    <div
                                        class="col-sm-3"
                                        v-if="
                                            dataset.metadata.targetPurpose ||
                                            (Array.isArray(dataset.metadata.targetPurpose) &&
                                                dataset.metadata.targetPurpose.length > 0)
                                        "
                                    >
                                        <div class="field-heading">
                                            Target Purpose
                                            <tooltip
                                                v-b-tooltip="
                                                    'The intended use that the data provider allows, i.e. for business purposes, for academic purposes, for scientific purposes, for personal purposes, for non-profit purposes.'
                                                "
                                            />
                                        </div>
                                        <div v-if="Array.isArray(dataset.metadata.targetPurpose)">
                                            <span
                                                class="text-muted"
                                                v-for="(purpose, index) in dataset.metadata.targetPurpose"
                                                :key="index"
                                            >
                                                {{ purpose }}
                                                <span v-if="index + 1 < dataset.metadata.targetPurpose.length">,</span>
                                            </span>
                                        </div>
                                        <div v-else>
                                            <div class="text-muted">{{ dataset.metadata.targetPurpose }}</div>
                                        </div>
                                    </div>
                                    <div
                                        class="col-sm-3"
                                        v-if="
                                            dataset.metadata.targetIndustry &&
                                            dataset.metadata.targetIndustry.length > 0
                                        "
                                    >
                                        <div class="field-heading">
                                            Target Industry
                                            <tooltip
                                                v-b-tooltip="
                                                    'The target industry for the data asset within and beyond the aviation data value chain stakeholders.'
                                                "
                                            />
                                        </div>
                                        <span
                                            class="text-muted"
                                            v-for="(industry, index) in dataset.metadata.targetIndustry"
                                            :key="index"
                                        >
                                            {{ industry }}
                                            <span v-if="index + 1 < dataset.metadata.targetIndustry.length">,</span>
                                        </span>
                                    </div>
                                </div>
                                <br
                                    v-if="
                                        dataset.metadata.shareAlike ||
                                        dataset.metadata.reContext ||
                                        dataset.metadata.targetPurpose ||
                                        (Array.isArray(dataset.metadata.targetPurpose) &&
                                            dataset.metadata.targetPurpose.length > 0) ||
                                        (dataset.metadata.targetIndustry && dataset.metadata.targetIndustry.length > 0)
                                    "
                                />
                                <div class="row">
                                    <div class="col-sm-3" v-if="dataset.metadata.onlineStorage">
                                        <div class="field-heading">
                                            Offline Retention
                                            <tooltip
                                                v-b-tooltip="
                                                    'An indication whether storage beyond the ICARUS platform (i.e. local downloading) is permitted for the data asset.'
                                                "
                                            />
                                        </div>
                                        <div class="text-muted">
                                            {{ dataset.metadata.onlineStorage }}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="
                                        customLicense &&
                                        dataset.metadata.privacyLevel !== 'Confidential' &&
                                        dataset.metadata.privacyLevel !== 'Public' &&
                                        dataset.status !== 'Public'
                                    "
                                >
                                    <br />
                                    <br />
                                    <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                        Pricing
                                    </h6>
                                    <br />
                                    <div class="row">
                                        <div class="col-sm-3" v-if="dataset.metadata.calculationScheme">
                                            <div class="field-heading">
                                                Amount
                                                <tooltip
                                                    v-b-tooltip="
                                                        'The price for the acquisition of the data asset including its currency, if it is fixed per asset.'
                                                    "
                                                />
                                            </div>
                                            <div
                                                class="text-muted"
                                                v-if="dataset.metadata.calculationScheme !== 'Request Dependent'"
                                            >
                                                {{ dataset.metadata.amount }} {{ dataset.metadata.currency }}
                                            </div>
                                            <div class="text-muted" v-else>Upon request</div>
                                        </div>
                                        <div class="col-sm-6" v-if="dataset.metadata.paymentMethod.length > 0">
                                            <div class="field-heading">
                                                Payment Methods
                                                <tooltip
                                                    v-b-tooltip="
                                                        'The applicable payment method that the data provider has defined in order for the payment to be conducted “offline” (outside the ICARUS platform), e.g. credit/debit card, bank transfer, online payment services.'
                                                    "
                                                />
                                            </div>
                                            <span
                                                class="text-muted"
                                                v-for="(payment, index) in dataset.metadata.paymentMethod"
                                                :key="index"
                                            >
                                                {{ payment }}
                                                <span v-if="index + 1 < dataset.metadata.paymentMethod.length">,</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                            <b-tab
                                v-if="
                                    this.dataset.status === 'Private' &&
                                    this.organization.id !== 1 &&
                                    this.organization.id === this.dataset.organization.id
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
import { mapGetters, mapState } from 'vuex';
import Papa from 'papaparse';
import numeral from 'numeral';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faDownload,
    faEdit,
    faInfoCircle,
    faShoppingCart,
    faChartArea,
    faUserSecret,
    faBroom,
    faSearch,
    faLock,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { assoc, clone, forEach, head, isEmpty, keys } from 'ramda';
import { Contract, DataAsset, Favorites, UsageAnalytics, Organization } from '@/api';
import { Tooltip } from '@/components';
import VueQueryBuilder from 'vue-query-builder';
import datasetOptions from '@/config/dataset.json';

library.add(
    faEdit,
    faDownload,
    faShoppingCart,
    faInfoCircle,
    faChartArea,
    faUserSecret,
    faBroom,
    faSearch,
    faLock,
    faStar,
);
const R = {
    assoc,
    clone,
    head,
    keys,
    isEmpty,
    forEach,
};
const baseURL = process.env.VUE_APP_API_URL;

export default {
    name: 'Dataset',
    components: { FontAwesomeIcon, Tooltip, VueQueryBuilder },
    filters: {
        capitalize(s) {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        },
        formatNumber(value) {
            return numeral(value).format('0,0');
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
        columns: [],
        dataset: {
            name: '',
            description: '',
            organization: { id: null },
            status: null,
            categories: [],
            coverphoto: null,
            version: null,
            metadata: {
                tags: [],
                velocity: null,
                frequency: null,
                temporalCoverage: [],
                spatialCoverage: [],
                language: [],
                accessibility: null,
                standards: null,
                license: null,
                privacyLevel: null,
                modify: null,
                excerpt: null,
                annotate: null,
                aggregate: null,
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
            license: null,
            privacyLevel: null,
            modify: null,
            excerpt: null,
            annotate: null,
            aggregate: null,
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
        previousRoute: null,
        activeContracts: [],
        pendingContracts: [],
        baseURL,
        hasImage: false,
        languageOptions: datasetOptions.languageOptions,
        countryOptions: datasetOptions.countryOptions,
        favoriteDatasets: [],
        orgLogo: null,
        hasLogoImage: false,
        spatialCoverage: [],
        emptyMetadata: false,
        publicAccess: false,
    }),
    computed: {
        ...mapGetters(['flatModel']),
        ...mapState(['organization']),
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
    },
    watch: {
        async flatModel() {
            if (this.flatModel) {
                await this.loadDataset();
            }
        },
    },
    async created() {
        if (this.flatModel) {
            await this.loadDataset();
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.previousRoute = from;
            if (from.name !== 'marketplace' && from.name !== 'assets') {
                vm.previousRoute = { name: 'marketplace' };
            }
        });
    },
    methods: {
        async loadDataset() {
            try {
                const { data: favoritesData } = await Favorites.all();
                this.favoriteDatasets = favoritesData;

                // If organisation exists and is Open Data, then contracts are empty
                // because backend returns a stupid error code!
                let activePendingContracts = [];
                if (this.organization && this.organization.id !== 1) {
                    const { data: contracts } = await Contract.activePending();
                    activePendingContracts = contracts;
                }

                const [{ data }, { data: authorization }, { data: filters }] = await Promise.all([
                    DataAsset.get(this.id),
                    DataAsset.getAuthorization(this.id),
                    DataAsset.getFilters(),
                ]);

                this.dataset = data;

                if (this.$store.state.user.organizationid !== this.dataset.organization.id) {
                    await UsageAnalytics.publish({
                        event_type: 'ASSET_VIEWED',
                        properties: {
                            asset_id: this.id,
                            asset_type: 'data_asset',
                        },
                        timestamp: Math.floor(Date.now() / 1000),
                    }).catch(() => {});
                }

                this.query_filters = filters;
                if (authorization && authorization.context) {
                    if (Object.entries(authorization.context).length !== 0) {
                        this.rules = R.clone(authorization.context);
                    }
                }
                if (authorization && authorization.publicAccess) {
                    this.publicAccess = authorization.publicAccess;
                } else {
                    this.publicAccess = false;
                }
                if (R.isEmpty(this.dataset.metadata)) {
                    this.emptyMetadata = true;
                    this.dataset.metadata = R.clone(this.metadataPlaceholder);
                }
                if (this.dataset.metadata.spatialCoverage.length > 0) {
                    this.dataset.metadata.spatialCoverage.forEach((value) => {
                        this.countryOptions.forEach((global) => {
                            if (global.id === value) {
                                this.spatialCoverage.push(global.label);
                            } else {
                                global.children.forEach((continent) => {
                                    if (continent.id === value) {
                                        this.spatialCoverage.push(continent.label);
                                    } else {
                                        continent.children.forEach((country) => {
                                            if (country.id === value) {
                                                this.spatialCoverage.push(country.label);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }

                R.forEach((contract) => {
                    if (contract.status === 'active') {
                        this.activeContracts.push(contract.id);
                    } else {
                        this.pendingContracts.push(contract.id);
                    }
                }, activePendingContracts);

                const fields = R.keys(R.head(this.dataset.sample));
                let field = null;
                fields.sort();
                fields.forEach((name) => {
                    if (name === 'undefined') return;
                    if (name.includes('_')) {
                        field = name.substring(0, name.indexOf('_'));
                    } else {
                        field = name;
                    }
                    this.columns.push(R.assoc('filter', null, R.assoc('name', name, this.flatModel[field])));
                });
                const { data: imageData } = await DataAsset.getImage(this.dataset.coverphoto);
                this.hasImage = imageData.length > 0;

                if (this.dataset.organization.logoimage) {
                    const { data: logoImageData } = await Organization.getLogoImage(
                        this.dataset.organization.logoimage,
                    );
                    this.hasLogoImage = logoImageData.length > 0;
                    this.orgLogo = `${baseURL}/organization/logo-image/${this.dataset.organization.logoimage}`;
                }

                this.isLoading = false;
            } catch (error) {
                this.$router.push(this.previousRoute);
                this.$toastr.e("You don't have permission to view this dataset");
            }
        },
        convertFinal(arrOfArr) {
            return arrOfArr.map((arr) => {
                const obj = {};
                Object.keys(arr).forEach((key) => {
                    if (Object.prototype.hasOwnProperty.call(arr, key)) {
                        obj[key] = arr[key];
                    }
                });
                return obj;
            });
        },
        downloadJson() {
            const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.dataset.sample))}`;
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', 'sample.json');
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },
        downloadCsv() {
            const csv = Papa.unparse(this.convertFinal(this.dataset.sample));

            const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            let csvURL = null;
            if (navigator.msSaveBlob) {
                csvURL = navigator.msSaveBlob(csvData, 'sample.csv');
            } else {
                csvURL = window.URL.createObjectURL(csvData);
            }

            const tempLink = document.createElement('a');
            tempLink.href = csvURL;
            tempLink.setAttribute('download', 'sample.csv');
            tempLink.click();
        },
        async downloadPDF() {
            const { data: pdf } = await DataAsset.getPDF(this.dataset.id);
            const fileURL = window.URL.createObjectURL(new Blob([pdf]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'ICARUS Platform Terms of Use.pdf');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
        },
        visualize() {
            this.$router.push({
                name: 'workspace.visualize',
                params: {
                    dbName: 'opendata',
                    datasetId: this.dataset.id,
                    datasetType: 'dataset',
                },
            });
        },
        async getOpenData(id) {
            try {
                await Contract.createVirtualContract(id);
                this.$router.push({ name: 'assets.dataset', params: { id } });
            } catch (error) {
                this.$toastr.e('Error getting dataset');
            }
        },
        getImageUrl() {
            if (this.hasImage) {
                return `url(${baseURL}/data-asset/coverphoto-image/${this.dataset.coverphoto})`;
            }
            return 'inherit';
        },
        changeState(id) {
            if (this.favoriteDatasets.find((d) => d === id)) {
                this.favoriteDatasets = this.favoriteDatasets.filter((d) => d !== id);
                Favorites.unlike(id)
                    .then(() =>
                        UsageAnalytics.publish({
                            event_type: 'ASSET_UNSTARRED',
                            properties: {
                                asset_id: id,
                                asset_type: 'data_asset',
                                user_id: this.$store.state.user.id,
                                org_id: this.$store.state.organization.id,
                            },
                            timestamp: Math.floor(Date.now() / 1000),
                        }).catch(() => {}),
                    )
                    .catch(() => {
                        this.$toastr.e('The dataset could not be removed from Favorites due to an error.', 'Error');
                    });
            } else {
                this.favoriteDatasets.push(id);
                Favorites.like(id)
                    .then(() =>
                        UsageAnalytics.publish({
                            event_type: 'ASSET_STARRED',
                            properties: {
                                asset_id: id,
                                asset_type: 'data_asset',
                                user_id: this.$store.state.user.id,
                                org_id: this.$store.state.organization.id,
                            },
                            timestamp: Math.floor(Date.now() / 1000),
                        }).catch(() => {}),
                    )
                    .catch(() => {
                        this.$toastr.e('The dataset could not be added to Favorites due to an error.', 'Error');
                    });
            }
        },
    },
};
</script>

<style lang="scss">
.access-policy {
    pointer-events: none !important;
}

.dataset {
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
        display: flex;
        justify-content: flex-end;
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

    .empty-star {
        font-size: 1.25rem;
        stroke-width: 20;
        opacity: 0.5;
        color: rgba(0, 0, 0, 0.2);
    }

    .empty-star:hover {
        color: rgba(247, 202, 24, 1);
        stroke: rgba(247, 202, 24, 0.4);
    }

    .full-star {
        font-size: 1.25rem;
    }
}
</style>
