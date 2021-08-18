<template>
    <div>
        <div class="row">
            <div class="col-md-12 col-lg-12 col-xl-12">
                <b-card class="mb-3" no-body>
                    <b-tabs class="card-header-tab-animation" card>
                        <b-tab title="General - Platform Assets" class="custom-tab">
                            <p>
                                These statistics are based on the assets your organization is able to request access:
                            </p>
                            <br />
                            <GeneralStatistics></GeneralStatistics>
                        </b-tab>
                        <b-tab title="General - Owned Assets" class="custom-tab">
                            <p>
                                These statistics are based on the assets your organization has uploaded on the platform:
                            </p>
                            <br />
                            <usageAnalytics></usageAnalytics>
                        </b-tab>
                        <b-tab title="Specific - Owned Asset" class="custom-tab">
                            <div v-if="datasets">
                                <div class="row">
                                    <div class="sort-button leftmrg">
                                        <b-dropdown text="Pick a dataset:" variant="outline-primary">
                                            <b-dropdown-item
                                                v-for="asset in assets"
                                                :value="asset.id"
                                                :key="asset.id"
                                                @click="selectedDataset(asset)"
                                            >
                                                {{ asset.name }}
                                            </b-dropdown-item>
                                        </b-dropdown>
                                    </div>
                                    <p class="leftmrg">
                                        Selected Asset:
                                        <b>{{ name }}</b>
                                    </p>
                                </div>
                                <assetStatistics :dataset-id="id"></assetStatistics>
                            </div>
                            <div v-if="!datasets" class="text-center mb-3">
                                <h5>You don't have any assets yet.</h5>
                            </div>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import UsageAnalytics from './UsageAnalytics.vue';
import AssetStatistics from './AssetStatistics.vue';
import GeneralStatistics from './GeneralStatistics.vue';
import { DataAsset } from '@/api';

export default {
    name: 'AssetsStatistics',
    components: {
        UsageAnalytics,
        AssetStatistics,
        GeneralStatistics,
    },
    data: () => ({
        id: '',
        name: '',
        datasets: true,
        assets: [],
        params: {
            text: null,
            ownership: 'all',
            sort: 'date_created',
        },
    }),
    computed: {
        ...mapState(['organization']),
    },
    async created() {
        try {
            const response = await DataAsset.search(this.params);
            this.assets = response.data;

            this.id = this.assets[0].id;

            this.name = this.assets[0].name;
        } catch {
            this.datasets = false;
        }
    },
    methods: {
        async selectedDataset(option) {
            this.id = option.id;
            this.name = option.name;
        },
    },
};
</script>

<style lang="scss">
.custom-tab {
    outline: none;
}

.leftmrg {
    padding-left: 20px;
}

p {
    padding-top: 8px;
}
</style>
