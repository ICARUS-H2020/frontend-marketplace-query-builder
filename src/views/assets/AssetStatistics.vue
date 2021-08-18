<template>
    <div v-if="noStats || loadedCountStats">
        <div class="text-center mb-3" v-if="noStats">
            <h5>There aren't any assets statistics for this dataset yet.</h5>
        </div>
        <!-- Table with stats -->
        <div class="card mb-3" v-if="loadedCountStats">
            <div class="no-gutters row">
                <div class="col-md-12 col-lg-3">
                    <ul class="list-group list-group-flush">
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Views</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers new-text-success">
                                                {{ countStats.ASSET_VIEWED }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Requests</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-warning">
                                                {{ countStats.ASSET_REQUESTED }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="col-md-12 col-lg-3">
                    <ul class="list-group list-group-flush">
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Purchases (Completed)</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers new-text-success">
                                                {{ countStats.CONTRACT_PAID }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Purchases (In Progress)</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-warning">
                                                {{ countStats.CONTRACT_OFFERED }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="col-md-12 col-lg-3">
                    <ul class="list-group list-group-flush">
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Accepted Contracts</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers new-text-success">
                                                {{ countStats.CONTRACT_ACCEPTED }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Rejected Contracts</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-warning">
                                                {{ countStats.CONTRACT_REJECTED }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="col-md-12 col-lg-3">
                    <ul class="list-group list-group-flush">
                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Stars</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers new-text-success">
                                                {{ countStats.ASSET_STARRED }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li class="bg-transparent list-group-item">
                            <div class="widget-content p-0">
                                <div class="widget-content-outer">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                            <div class="widget-heading">Unstars</div>
                                        </div>
                                        <div class="widget-content-right">
                                            <div class="widget-numbers text-warning">
                                                {{ countStats.ASSET_UNSTARRED }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- All charts with area timeline -->
            <div v-for="chart in timelineCharts" :key="chart.id" class="col-sm-12 col-md-12 col-lg-6">
                <div class="mb-3 card">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-bold">
                            {{ chart.title }}
                            <date-picker
                                :id="`d${chart.id}`"
                                name="datePeriod"
                                input-class="form-control"
                                width="100%"
                                class="mrgleft"
                                v-model="chart.datePeriod"
                                :type="'date'"
                                :lang="'en'"
                                :shortcuts="false"
                                :value-type="'format'"
                                :clearable="true"
                                :confirm="true"
                                range
                                @confirm="updateTimeline(`${chart.id}`)"
                                @clear="clearTimeline(`${chart.id}`)"
                            >
                                <template slot="header">
                                    <p class="px-2 pt-2 mb-0 text-center">
                                        <u>
                                            Select start and end dates using the left and right calendars respectively
                                        </u>
                                    </p>
                                </template>
                            </date-picker>
                        </div>
                    </div>
                    <div class="p-0 card-body">
                        <div class="p-1 slick-slider-sm mx-auto">
                            <div class="widget-chart widget-chart2 text-left p-0">
                                <div class="widget-chat-wrapper-outer">
                                    <div class="widget-chart-wrapper he-auto opacity-10 m-0">
                                        <line-chart :height="180" :chart-data="chart.data"></line-chart>
                                    </div>
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
</template>

<script>
import { UsageAnalytics } from '@/api';
import LineChart from '../Charts/LineChart';
import DatePicker from 'vue2-datepicker';

export default {
    name: 'AssetStatistics',
    components: {
        LineChart,
        DatePicker,
    },
    props: {
        datasetId: {
            type: [String, Number],
            required: true,
        },
    },
    data: () => ({
        countsStatsInfo: {
            ASSET_REQUESTED: { name: 'Data Assets Total Requests', color: 'warning' },
            ASSET_REQUEST_REJECTED: {
                name: 'Data Assets Total Requests Rejected',
                color: 'warning',
            },
            ASSET_UNSTARRED: { name: 'Data Assets Total Stars', color: 'info' },
            ASSET_VIEWED: { name: 'Data Assets Total Views', color: 'info' },
            ASSET_STARRED: { name: 'Data Assets Total Stars', color: 'info' },
            CONTRACT_OFFERED: {
                name: 'Data Assets Total Purchases In Progress',
                color: 'warning',
            },
            CONTRACT_ACCEPTED: { name: 'Total Acceptected Contracts', color: 'info' },
            CONTRACT_REJECTED: { name: 'Total Rejected Contracts', color: 'warning' },
            CONTRACT_PAID: { name: 'Data Assets Total Purchases', color: 'info' },
        },

        countStats: {
            ASSET_REQUESTED: '-',
            ASSET_REQUEST_REJECTED: '-',
            ASSET_UNSTARRED: '-',
            ASSET_VIEWED: '-',
            ASSET_STARRED: '-',
            CONTRACT_OFFERED: '-',
            CONTRACT_ACCEPTED: '-',
            CONTRACT_REJECTED: '-',
            CONTRACT_PAID: '-',
        },

        cards: [],

        allResults: [],

        timelineDatasetEvents: [],

        timelinesTitles: [
            { title: "Data Asset's Views", pointTitle: 'asset viewed' },
            {
                title: "Data Asset's Stars",
                pointTitle: 'asset starred',
            },
            {
                title: "Data Asset's Unstars",
                pointTitle: 'asset unstarred',
            },
            { title: "Data Asset's Requests", pointTitle: 'asset requested' },
            {
                title: "Data Asset's Accepted Contracts",
                pointTitle: 'accepted contract',
            },
            {
                title: "Data Asset's Rejected Contracts",
                pointTitle: 'rejected contract',
            },
            { title: "Data Asset's Purchases", pointTitle: 'asset purchased' },
        ],
        timelineCharts: [],

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

        loadedCountStats: false,
        noStats: false,
    }),
    computed: {},
    watch: {
        datasetId() {
            const empty = [];
            if (this.noStats === false && this.timelineCharts.length > 0) {
                for (let j = 0; j < this.timelinesTitles.length; j++) {
                    this.assignNewDataToTimelineChart(j, empty, empty);
                }
            }

            this.timelineCharts = [];
            this.allResults = [];
            this.loadedCountStats = false;
            this.noStats = false;
            this.countStats = {
                ASSET_REQUESTED: '-',
                ASSET_REQUEST_REJECTED: '-',
                ASSET_UNSTARRED: '-',
                ASSET_VIEWED: '-',
                ASSET_STARRED: '-',
                CONTRACT_OFFERED: '-',
                CONTRACT_ACCEPTED: '-',
                CONTRACT_REJECTED: '-',
                CONTRACT_PAID: '-',
            };
            this.getCountStats();
        },
    },
    async created() {
        this.getCountStats();
    },
    methods: {
        // Cards with stats
        async getCountStats() {
            const dataAssetEvents = await Promise.all([UsageAnalytics.dataAssetEvents()]);
            const res = dataAssetEvents[0].data[this.datasetId];
            const metricKeys = Object.keys(this.countsStatsInfo);
            let cardId = 1;
            this.cards = [];

            try {
                if (res !== undefined && Object.keys(res).length !== 0) {
                    for (let i = 0; i < metricKeys.length; i += 1) {
                        const batchKeys = Object.keys(res);
                        const batchValues = Object.values(res);

                        for (let j = 0; j < batchKeys.length; j += 1) {
                            if (metricKeys[i].includes(batchKeys[j])) {
                                this.countStats[metricKeys[i]] = batchValues[j];

                                const card = {
                                    id: cardId,
                                    statName: this.countsStatsInfo[metricKeys[i]].name,
                                    borderColor: `border-${this.countsStatsInfo[metricKeys[i]].color}`,
                                    shadowColor: `card-shadow-${this.countsStatsInfo[metricKeys[i]].color}`,
                                    statValue: res[batchKeys[j]][metricKeys[i]],
                                };
                                this.cards.push(card);
                                cardId++;
                            }
                        }
                    }

                    if (
                        this.countStats.ASSET_UNSTARRED !== undefined &&
                        this.countStats.ASSET_UNSTARRED !== 0 &&
                        this.countStats.ASSET_UNSTARRED !== '-'
                    ) {
                        this.countStats.ASSET_STARRED = this.countStats.ASSET_STARRED - this.countStats.ASSET_UNSTARRED;
                    }

                    if (
                        this.countStats.CONTRACT_PAID !== undefined &&
                        this.countStats.CONTRACT_PAID !== 0 &&
                        this.countStats.CONTRACT_PAID !== '-'
                    ) {
                        this.countStats.CONTRACT_PAID =
                            this.countStats.CONTRACT_ACCEPTED - this.countStats.CONTRACT_PAID;
                    }

                    this.loadedCountStats = true;
                } else this.noStats = true;
                if (this.datasetId !== undefined && this.datasetId !== '') {
                    this.timelineDatasetEvents = await Promise.all([
                        UsageAnalytics.timelineDatasetEvents(this.datasetId),
                    ]);

                    if (this.timelineDatasetEvents !== undefined) {
                        this.allResults = await Promise.all([
                            this.timelineDatasetEvents[0].data.ASSET_VIEWED,
                            this.timelineDatasetEvents[0].data.ASSET_STARRED,
                            this.timelineDatasetEvents[0].data.ASSET_UNSTARRED,
                            this.timelineDatasetEvents[0].data.ASSET_REQUESTED,
                            this.timelineDatasetEvents[0].data.CONTRACT_ACCEPTED,
                            this.timelineDatasetEvents[0].data.CONTRACT_REJECTED,
                            this.timelineDatasetEvents[0].data.CONTRACT_PAID,
                        ]);

                        for (let i = 0; i < this.allResults.length; i++) {
                            if (this.allResults[i] !== undefined) this.noStats = false;
                        }

                        this.createTimelineCharts();
                    }
                }
            } catch (e) {
                this.noStats = true;
                console.log(e);
            }
        },

        /** This function is called to set the timeline period on the timeline charts */
        updateTimeline(id) {
            const start = new Date(this.timelineCharts[id].datePeriod[0]);
            const end = new Date(this.timelineCharts[id].datePeriod[1]);

            const labelDates = [];
            const dataPoints = [];
            let date;

            for (let j = 0; j < this.allResults[id].length; j++) {
                date = new Date(this.allResults[id][j].date);

                if (start <= date && end >= date) {
                    labelDates.push(date);
                    dataPoints.push(this.allResults[id][j].count);
                }
            }

            this.assignNewDataToTimelineChart(id, labelDates, dataPoints);
        },

        /** This function is called to clear the filtering from the timeline charts */
        clearTimeline(id) {
            const labelDates = [];
            const dataPoints = [];

            for (let j = 0; j < this.allResults[id].length; j++) {
                labelDates.push(this.allResults[id][j].date);
                dataPoints.push(this.allResults[id][j].count);
            }
            this.assignNewDataToTimelineChart(id, labelDates, dataPoints);
        },

        /** This function is only used for updating or clearing the filtering from the timeline carts */
        assignNewDataToTimelineChart(id, labelDates, dataPoints) {
            // Chart.js data for x-axis labels, datasets and colors
            const dataCollection = {
                // Data to be represented on x-axis
                labels: labelDates,
                datasets: [
                    {
                        label: this.timelinesTitles[id].pointTitle,
                        fill: true,
                        lineTension: 0.5,
                        backgroundColor: `${this.colorPalette[id]}bb`,
                        borderColor: this.backgroundColorPalette[id],
                        pointBorderColor: this.backgroundColorPalette[id],
                        pointHoverBorderColor: this.backgroundColorPalette[id],
                        borderCapStyle: 'round',
                        borderDash: [],
                        borderWidth: 4,
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'round',
                        pointBackgroundColor: '#ffffff',
                        pointHoverBackgroundColor: '#ffffff',
                        pointBorderWidth: 5,
                        pointHoverRadius: 6,
                        pointHoverBorderWidth: 2,
                        pointRadius: 4,
                        pointHitRadius: 10,
                        data: dataPoints,
                    },
                ],
            };

            this.timelineCharts[id].data = dataCollection;
        },

        /** Create asynchronizely multiple timeline charts */
        async createTimelineCharts() {
            try {
                for (let i = 0; i < this.timelinesTitles.length; i++) {
                    const labelDates = [];
                    const dataPoints = [];
                    if (this.allResults[i] !== undefined) {
                        for (let j = 0; j < this.allResults[i].length; j++) {
                            labelDates.push(this.allResults[i][j].date);
                            dataPoints.push(this.allResults[i][j].count);
                        }

                        // Chart.js data for x-axis labels, datasets and colors
                        const dataCollection = {
                            // Data to be represented on x-axis
                            labels: labelDates,
                            datasets: [
                                {
                                    label: this.timelinesTitles[i].pointTitle,
                                    fill: true,
                                    lineTension: 0.5,
                                    backgroundColor: `${this.colorPalette[i]}bb`,
                                    borderColor: this.backgroundColorPalette[i],
                                    pointBorderColor: this.backgroundColorPalette[i],
                                    pointHoverBorderColor: this.backgroundColorPalette[i],

                                    borderCapStyle: 'round',
                                    borderDash: [],
                                    borderWidth: 4,
                                    borderDashOffset: 0.0,
                                    borderJoinStyle: 'round',
                                    pointBackgroundColor: '#ffffff',
                                    pointHoverBackgroundColor: '#ffffff',
                                    pointBorderWidth: 5,
                                    pointHoverRadius: 6,
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 4,
                                    pointHitRadius: 10,
                                    data: dataPoints,
                                },
                            ],
                        };

                        this.timelineCharts.push({
                            id: i,
                            title: this.timelinesTitles[i].title,
                            data: dataCollection,
                        });
                    }
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
