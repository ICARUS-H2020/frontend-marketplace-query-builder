<template>
    <div>
        <!-- total data assets per category AND total data assets per visibility level -->
        <div class="row" v-if="loadedCharts">
            <!-- All pie charts -->
            <div v-for="chart in barCharts" :key="chart.id" class="col-sm-12 col-md-12 col-lg-6">
                <div class="mb-3 card">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-bold">
                            {{ chart.title }}
                        </div>
                    </div>
                    <div class="p-0 card-body">
                        <div class="font-size-md subtitle">
                            {{ chart.subtitle }}
                        </div>
                        <div class="p-1 slick-slider-sm mx-auto">
                            <div class="widget-chart widget-chart2 text-left p-0">
                                <div class="widget-chat-wrapper-outer">
                                    <div class="widget-chart-wrapper he-auto opacity-10 m-0">
                                        <bar-horiz-chart :height="180" :chart-data="chart.data"></bar-horiz-chart>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- All charts with area timeline -->
            <div v-for="chart in pieCharts" :key="chart.id" class="col-sm-12 col-md-12 col-lg-6">
                <div class="mb-3 card">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-bold">
                            {{ chart.title }}
                        </div>
                    </div>
                    <div class="p-0 card-body">
                        <div class="font-size-md subtitle">
                            {{ chart.subtitle }}
                        </div>
                        <div class="p-1 slick-slider-sm mx-auto">
                            <div class="widget-chart widget-chart2 text-left p-0">
                                <div class="widget-chat-wrapper-outer">
                                    <div class="widget-chart-wrapper he-auto opacity-10 m-0">
                                        <doughnut-chart :height="180" :chart-data="chart.data"></doughnut-chart>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center" v-else>
            <div class="loading-indicator p-1">
                <Spinner name="wave" color="var(--primary)" no-fade-in />
                <h6 class="message">Please wait... Loading Statistics...</h6>
            </div>
        </div>
    </div>
</template>

<script>
// import { UsageAnalytics } from '@/api/';
import DoughnutChart from '../Charts/Doughnut';
import BarHorizChart from '../Charts/BarHoriz';
import { UsageAnalytics } from '../../api';

export default {
    name: 'GeneralStatistics',
    components: {
        DoughnutChart,
        BarHorizChart,
    },
    data: () => ({
        cards: [],

        allResults: [],

        pieTitles: [
            {
                title: 'Most Viewed Assets',
                subtitle: 'Based only on the public assets:',
            },
            {
                title: 'Most Purchased Assets',
                subtitle: 'Based only on the public assets:',
            },
        ],
        pieCharts: [],

        barTitles: [
            {
                title: 'Total Assets Per Category',
                subtitle: 'Based only on the purchasable assets:',
            },
            {
                title: 'Preferred Assets Categories',
                subtitle: "Based on other organizations' preferences:",
            },
            {
                title: 'Most Popular Category Based on Views',
                subtitle: 'Based only on the purchasable assets:',
            },
            {
                title: 'Most Popular Category Based on Purchases',
                subtitle: 'Based only on the purchasable assets:',
            },
        ],

        barCharts: [],
        colorPalette: [
            '#34C4ED',
            '#A2B86C',
            '#A6B388',
            '#F2D874',
            '#EBC844',
            '#ECAA38',
            '#EF8B2C',
            '#F16C20',
            '#BD4639',
            '#0F5B78',
            '#117899',
            '#1395BA',
        ],

        backgroundColorPalette: [
            '#1395BA',
            '#5CA793',
            '#A2B86C',
            '#EBC844',
            '#ECAA38',
            '#EF8B2C',
            '#F16C20',
            '#D94E1F',
            '#C02E1D',
            '#0D3C55',
            '#0F5B78',
            '#117899',
        ],

        loadedCharts: false,
    }),
    computed: {},
    async created() {
        const allResults = await Promise.all([
            UsageAnalytics.popularCategoryAssets('ASSET_VIEWED'),
            UsageAnalytics.popularCategoryAssets('CONTRACT_PAID'),
        ]);

        await Promise.all([this.createBarCharts(allResults), this.createPieCharts(allResults)]);

        this.loadedCharts = true;
    },
    methods: {
        /** Create asynchronizely multiple pie charts */
        async createPieCharts(allResults) {
            try {
                for (let i = 0; i < this.pieTitles.length; i++) {
                    const backgroundColor = this.backgroundColorPalette;
                    const keys = [];
                    const values = [];

                    if (allResults[i].data.popular_datasets !== undefined) {
                        for (let j = 0; j < allResults[i].data.popular_datasets.length; j++) {
                            keys.push(allResults[i].data.popular_datasets[j].name);
                            values.push(allResults[i].data.popular_datasets[j].count);
                        }

                        if (this.backgroundColorPalette.length < keys.length) {
                            for (let j = 0; j <= keys.length - this.backgroundColorPalette.length; j++)
                                backgroundColor.push(this.backgroundColorPalette[j]);
                        }
                    }

                    // Chart.js data for x-axis labels, datasets and colors
                    const dataCollection = {
                        // Data to be represented on x-axis
                        labels: keys,
                        datasets: [
                            {
                                data: values,
                                backgroundColor,
                            },
                        ],
                    };

                    this.pieCharts.push({
                        id: `pie${i}`,
                        title: this.pieTitles[i].title,
                        subtitle: this.pieTitles[i].subtitle,
                        data: dataCollection,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },

        /** Create asynchronizely multiple bar charts */
        async createBarCharts(popularCategory) {
            const allResults = await Promise.all([
                UsageAnalytics.dataAssetsPerCategory(),
                UsageAnalytics.dataAssetPreferencePerCategory(),
            ]);

            allResults.push(popularCategory[0]);
            allResults.push(popularCategory[1]);

            try {
                for (let i = 0; i < this.barTitles.length; i++) {
                    const labelDates = [];
                    const dataPoints = [];
                    const reorganizedData = [];
                    const backgroundColor = this.backgroundColorPalette;
                    const color = this.colorPalette;

                    if (allResults[i] !== undefined) {
                        let keys = [];
                        let values = [];
                        if (i < this.barTitles.length - 2) {
                            keys = Object.keys(allResults[i].data);
                            values = Object.values(allResults[i].data);
                        } else {
                            for (let j = 0; j < allResults[i].data.popular_categories.length; j++) {
                                keys.push(allResults[i].data.popular_categories[j].category);
                                values.push(allResults[i].data.popular_categories[j].count);
                            }
                        }

                        if (this.backgroundColorPalette.length < keys.length) {
                            for (let j = 0; j <= keys.length - this.backgroundColorPalette.length; j++) {
                                backgroundColor.push(this.backgroundColorPalette[j]);
                                color.push(this.colorPalette[j]);
                            }
                        }

                        for (let j = 0; j < keys.length; j++) {
                            reorganizedData.push({ label: keys[j], value: values[j] });
                        }

                        reorganizedData.sort((a, b) => b.value - a.value);

                        for (let j = 0; j < keys.length; j++) {
                            labelDates.push(reorganizedData[j].label);
                            dataPoints.push(reorganizedData[j].value);
                        }
                    }

                    // Chart.js data for x-axis labels, datasets and colors
                    const dataCollection = {
                        // Data to be represented on x-axis
                        labels: labelDates,
                        datasets: [
                            {
                                label: '',
                                backgroundColor,
                                borderWidth: 1,
                                borderCapStyle: 'round',
                                data: dataPoints,
                            },
                        ],
                    };

                    this.barCharts.push({
                        id: `bar${i}`,
                        title: this.barTitles[i].title,
                        subtitle: this.barTitles[i].subtitle,
                        data: dataCollection,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
    },
};
</script>

<style lang="scss">
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.subtitle {
    padding: 0.75rem 1.25rem;
}

.new-text-danger {
    color: #c02e1d !important;
}

.new-text-success {
    color: #0d3c55 !important;
}

.first-group-item {
    border-top: 1px solid rgba(0, 0, 0, 0.23) !important;
}

@media only screen and (max-width: 991px) {
    .first-group-item {
        border-top: none !important;
    }
}

.mrgleft {
    margin-left: 8px;
}
</style>
