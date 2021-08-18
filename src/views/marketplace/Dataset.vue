<template>
    <div class="dataset">
        <div class="mb-3 card header">
            <div class="overlay"></div>
            <div class="no-gutters row">
                <div class="col-sm-12 col-md-12 col-xl-12 content">
                    <h1>Athens International Airport Source</h1>
                    <div class="widget-content p-0 widget-wrapper">
                        <div class="widget-content-wrapper">
                            <div class="widget-content-left mr-3">
                                <div class="avatar-icon-wrapper mt-1">
                                    <div class="avatar-icon organization-icon">
                                        <img src="../../assets/images/org_logo.png" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div class="widget-content-left">
                                <div class="widget-heading">Organization name</div>
                            </div>
                            <div class="widget-content-right">
                                <div class="button-wrapper">
                                    <b-button
                                        class="btn-hover-shine btn-shadow btn-transition purchase-button"
                                        variant="warning"
                                        @click="$router.push({ name: 'marketplace.quotation' })"
                                    >
                                        <b>PURCHASE</b>
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
                                <div class="col-sm-9">
                                    <div class="field-heading">Description</div>
                                    <div class="text-muted">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris nisi ut aliquip ex e
                                    </div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Tags</div>
                                    <span class="badge badge-info tag">Airport</span>
                                    <span class="badge badge-info tag">Athens</span>
                                    <span class="badge badge-info tag">Greece</span>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Category</div>
                                    <div class="text-muted">Airports</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Status</div>
                                    <div class="text-muted">Unknown</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Date Available</div>
                                    <div class="text-muted">23 December 2019</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Date Modified</div>
                                    <div class="text-muted">29 December 2019</div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                Features
                            </h6>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Format</div>
                                    <div class="text-muted">Unknown</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Volume</div>
                                    <div class="text-muted">2 GB</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Rows</div>
                                    <div class="text-muted">2.000.000</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Columns</div>
                                    <div class="text-muted">30</div>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Velocity</div>
                                    <div class="text-muted">Real Time</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Frequency</div>
                                    <div class="text-muted">Hourly</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Temporal Coverage</div>
                                    <div class="text-muted">Unknown</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Spatial Coverage</div>
                                    <div class="text-muted">Unknown</div>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Language</div>
                                    <div class="text-muted">English</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Accessibility</div>
                                    <div class="text-muted">-</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Standards</div>
                                    <div class="text-muted">-</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Version</div>
                                    <div class="text-muted">1</div>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab title="Details" class="custom-tab">
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Sample Format</div>
                                    <div class="text-muted">CSV</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Sample Volume</div>
                                    <div class="text-muted">10 MB</div>
                                </div>
                                <div class="offset-sm-3 col-sm-3 download">
                                    <b-button class="mr-2 btn-icon" variant="primary" size="sm">
                                        <font-awesome-icon class="btn-icon-wrapper" icon="download" />
                                        &nbsp; CSV
                                    </b-button>
                                    <b-button class="btn-icon" variant="primary" size="sm">
                                        <font-awesome-icon class="btn-icon-wrapper" icon="download" />
                                        &nbsp; JSON
                                    </b-button>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="field-heading">Sample Format</div>
                                    <br />
                                    <div class="table-responsive table-scrollable">
                                        <table class="align-middle text-truncate mb-0 table table-hover mb-3">
                                            <thead>
                                                <tr>
                                                    <th class="text-center" width="5%">#</th>
                                                    <th class="text-center" width="25%">Column Title</th>
                                                    <th class="text-center" width="25%">Column Description</th>
                                                    <th class="text-center" width="25%">Column Type</th>
                                                    <th class="text-center" width="20%">Encrypted Column</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, idx) in items" :key="idx">
                                                    <td class="text-center" width="5%">
                                                        <span>{{ idx + 1 }}</span>
                                                    </td>
                                                    <td class="text-center" width="25%">
                                                        <span>{{ item.title }}</span>
                                                    </td>
                                                    <td class="text-center" width="25%">
                                                        <span>{{ item.description }}</span>
                                                    </td>
                                                    <td class="text-center" width="25%">
                                                        <span>{{ item.type }}</span>
                                                    </td>
                                                    <td class="text-center" width="20%">
                                                        <span>{{ item.encrypted }}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab title="License" class="custom-tab">
                            <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                General Information
                            </h6>
                            <br />
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="field-heading">License</div>
                                    <div class="text-muted">Custom</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Copyright Owner</div>
                                    <div class="text-muted">Required</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Privacy Level</div>
                                    <div class="text-muted">Allowed</div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">
                                Rights & Usage
                            </h6>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Derivation</div>
                                    <div class="text-muted">annotate</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Attribution</div>
                                    <div class="text-muted">Prohibited</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Reproduction</div>
                                    <div class="text-muted">Scientific Usage</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Distribution</div>
                                    <div class="text-muted">Scientific Usage</div>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Target Purpose</div>
                                    <div class="text-muted">Not allowed</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Target Industry</div>
                                    <div class="text-muted">Aviation</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Online Storage</div>
                                    <div class="text-muted">Contact Organization</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Re-context</div>
                                    <div class="text-muted">Allowed</div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <h6 class="text-muted text-uppercase font-size-md opacity-5 font-weight-normal">Pricing</h6>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Calculation Scheme</div>
                                    <div class="text-muted">Not allowed</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Amount</div>
                                    <div class="text-muted">Aviation</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Tax</div>
                                    <div class="text-muted">Contact Organization</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Payment Method</div>
                                    <div class="text-muted">Allowed</div>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab title="Access Policy" class="custom-tab">
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Software</div>
                                    <div class="text-muted">Custom</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Hardware</div>
                                    <div class="text-muted">annotate</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Requestor's Organization</div>
                                    <div class="text-muted">Required</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Requestor's Organization Type</div>
                                    <div class="text-muted">Allowed</div>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Requestor's Origin Country</div>
                                    <div class="text-muted">Prohibited</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Requestor's Location</div>
                                    <div class="text-muted">Scientific Usage</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Duration of Retention</div>
                                    <div class="text-muted">Aviation</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="field-heading">Duration of Use</div>
                                    <div class="text-muted">Not allowed</div>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="field-heading">Versioning & Updates</div>
                                    <div class="text-muted">Allowed</div>
                                </div>
                            </div>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faDownload);

export default {
    name: 'Dataset',
    components: { FontAwesomeIcon },
    data: () => ({
        items: [
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
            {
                title: 'Aircode',
                description: 'column for aircode',
                type: 'String',
                encrypted: 'Yes',
            },
        ],
    }),
};
</script>

<style lang="scss">
.dataset {
    .header {
        height: 12rem;
        background-image: url('../../assets/images/banner.png');
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
}
</style>
