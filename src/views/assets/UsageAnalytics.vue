<template>
    <div v-if="loadedCountStats && loadedCharts">
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
                <!--<div class="col-md-12 col-lg-12">
                                  <ul class="list-group list-group-flush">
                                    <li class="bg-transparent list-group-item first-group-item">
                                      <div class="widget-content p-0">
                                        <div class="widget-content-outer">
                                          <div class="widget-content-wrapper">
                                            <div class="widget-content-left">
                                              <div class="widget-heading">Contracts</div>
                                              <div class="widget-subheading">Pending</div>
                                            </div>
                                            <div class="widget-content-right">
                                              <div
                                                class="widget-numbers new-text-danger"
                                              >{{countStats.total_contracts_pending}}</div>
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
                                              <div class="widget-heading">Payments</div>
                                              <div class="widget-subheading">Pending</div>
                                            </div>
                                            <div class="widget-content-right">
                                              <div
                                                class="widget-numbers text-danger"
                                              >{{countStats.total_pending_payments}}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                </div>-->
            </div>
        </div>

        <!-- total data assets per category AND total data assets per visibility level -->
        <div class="row" v-if="loadedCharts">
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
            <!-- All pie charts -->
            <div v-for="chart in barCharts" :key="chart.id" class="col-sm-12 col-md-12 col-lg-6">
                <div class="mb-3 card">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-bold">
                            {{ chart.title }}
                        </div>
                    </div>
                    <div class="p-0 card-body">
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
import BarHorizChart from '../Charts/BarHoriz';
import DatePicker from 'vue2-datepicker';

export default {
    name: 'UsageAnalytics',
    components: {
        LineChart,
        BarHorizChart,
        DatePicker,
    },
    data: () => ({
        countsStatsInfo: {
            ASSET_REQUESTED: { name: 'Assets Total Requests', color: 'warning' },
            ASSET_REQUEST_REJECTED: {
                name: 'Assets Total Requests Rejected',
                color: 'warning',
            },
            ASSET_UNSTARRED: { name: 'Assets Total Stars', color: 'info' },
            ASSET_VIEWED: { name: 'Assets Total Views', color: 'info' },
            ASSET_STARRED: { name: 'Assets Total Stars', color: 'info' },
            CONTRACT_OFFERED: {
                name: 'Assets Total Purchases In Progress',
                color: 'warning',
            },
            CONTRACT_ACCEPTED: { name: 'Total Acceptected Contracts', color: 'info' },
            CONTRACT_REJECTED: { name: 'Total Rejected Contracts', color: 'warning' },
            CONTRACT_PAID: { name: 'Assets Total Purchases', color: 'warning' },
            // total_contracts_pending: { name: "Total Pending Contracts", color: "danger" },
            // total_pending_payments: { name: "Total Pending Payments", color: "danger" },
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
            // total_contracts_pending:"-",
            // total_pending_payments:"-"
        },

        timelineAllDatasetEvents: UsageAnalytics.timelineAllDatasetEvents(),

        userDataAssetEvents: UsageAnalytics.userDataAssetEvents(),

        cards: [],

        allResults: [],

        timelinesTitles: [
            { title: "Assets' Views", pointTitle: 'assets viewed' },
            {
                title: "Assets' Stars",
                pointTitle: 'assets starred',
            },
            {
                title: "Assets' Unstars",
                pointTitle: 'assets unstarred',
            },
            { title: "Assets' Requests", pointTitle: 'assets requested' },
            {
                title: "Assets' Accepted Contracts",
                pointTitle: 'accepted contracts',
            },
            {
                title: "Assets' Rejected Contracts",
                pointTitle: 'rejected contracts',
            },
            { title: "Assets' Purchases", pointTitle: 'assets purchased' },
        ],

        timelineCharts: [],

        barTitleAssoc: [
            'ASSET_VIEWED',
            'ASSET_STARRED',
            'ASSET_UNSTARRED',
            'ASSET_REQUESTED',
            'CONTRACT_ACCEPTED',
            'CONTRACT_REJECTED',
            'CONTRACT_PAID',
        ],

        barTitles: [
            { title: "Assets' Views" },
            { title: "Assets' Stars" },
            { title: "Assets' Unstars" },
            { title: "Assets' Requests" },
            { title: "Assets' Accepted Contracts" },
            { title: "Assets' Rejected Contracts" },
            { title: "Assets' Purchases" },
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

        loadedCountStats: false,
        loadedCharts: false,
    }),
    computed: {},
    async created() {
        this.getCountStats();

        this.timelineAllDatasetEvents = await Promise.all([this.timelineAllDatasetEvents]);
        this.allResults = await Promise.all([
            this.timelineAllDatasetEvents[0].data.ASSET_VIEWED,
            this.timelineAllDatasetEvents[0].data.ASSET_STARRED,
            this.timelineAllDatasetEvents[0].data.ASSET_UNSTARRED,
            this.timelineAllDatasetEvents[0].data.ASSET_REQUESTED,
            this.timelineAllDatasetEvents[0].data.CONTRACT_ACCEPTED,
            this.timelineAllDatasetEvents[0].data.CONTRACT_REJECTED,
            this.timelineAllDatasetEvents[0].data.CONTRACT_PAID,
        ]);

        await Promise.all([this.createTimelineCharts(this.allResults), this.createBarCharts()]);
        this.loadedCharts = true;
    },
    methods: {
        // Cards with stats
        async getCountStats() {
            const res = await Promise.all([this.userDataAssetEvents]);
            const metricKeys = Object.keys(this.countsStatsInfo);
            let cardId = 1;
            this.cards = [];

            try {
                if (res !== undefined) {
                    for (let i = 0; i < metricKeys.length; i++) {
                        const batchKeys = Object.keys(res[0].data);
                        const batchValues = Object.values(res[0].data);

                        for (let j = 0; j < batchKeys.length; j++) {
                            if (metricKeys[i].includes(batchKeys[j])) {
                                this.countStats[metricKeys[i]] = batchValues[j];

                                const card = {
                                    id: cardId,
                                    statName: this.countsStatsInfo[metricKeys[i]].name,
                                    borderColor: `border-${this.countsStatsInfo[metricKeys[i]].color}`,
                                    shadowColor: `card-shadow-${this.countsStatsInfo[metricKeys[i]].color}`,
                                    statValue: this.countStats[metricKeys[i]],
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
                        this.countStats.CONTRACT_ACCEPTED =
                            this.countStats.CONTRACT_ACCEPTED - this.countStats.CONTRACT_PAID;
                    }

                    this.loadedCountStats = true;
                }
            } catch (e) {
                console.log(e);
            }
        },

        /** This function is called to set the timeline period on the timeline charts */
        updateTimeline(id) {
            let [start, end] = id.split('timeline');
            id = end;

            if (this.allResults[id] != null) {
                start = new Date(this.timelineCharts[id].datePeriod[0]);
                end = new Date(this.timelineCharts[id].datePeriod[1]);
                const labelDates = [];
                const dataPoints = [];
                const keys = Object.keys(this.allResults[id]);
                const values = Object.values(this.allResults[id]);

                if (keys.length !== undefined)
                    for (let i = 0; i < keys.length; i++) {
                        const date = new Date(keys[i]);
                        if (start <= date && end >= date) {
                            labelDates.push(date);
                            dataPoints.push(values[i]);
                        }
                    }

                this.assignNewDataToTimelineChart(id, labelDates, dataPoints);
            }
        },

        /** This function is called to clear the filtering from the timeline charts */
        clearTimeline(id) {
            let [keys, values] = id.split('timeline');
            id = values;

            if (this.allResults[id] != null) {
                const labelDates = [];
                const dataPoints = [];
                keys = Object.keys(this.allResults[id]);
                values = Object.values(this.allResults[id]);

                if (keys.length !== undefined)
                    for (let i = 0; i < keys.length; i++) {
                        labelDates.push(keys[i]);
                        dataPoints.push(values[i]);
                    }
                this.assignNewDataToTimelineChart(id, labelDates, dataPoints);
            }
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
        async createTimelineCharts(allResults) {
            try {
                for (let i = 0; i < this.timelinesTitles.length; i++) {
                    const labelDates = [];
                    const dataPoints = [];
                    let keys = [];
                    let values = [];

                    if (allResults[i] != null) {
                        keys = Object.keys(allResults[i]);
                        values = Object.values(allResults[i]);
                    }

                    if (keys.length !== undefined) {
                        for (let j = 0; j < keys.length; j++) {
                            labelDates.push(keys[j]);
                            dataPoints.push(values[j]);
                        }
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
                        id: `timeline${i}`,
                        title: this.timelinesTitles[i].title,
                        data: dataCollection,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },

        /** Create asynchronizely multiple bar charts */
        async createBarCharts() {
            const allResults = await Promise.all([UsageAnalytics.dataAssetEvents()]);

            try {
                let dataset = [];
                const keys = Object.keys(allResults[0].data);
                const values = Object.values(allResults[0].data);
                const nameKeys = [];

                if (keys !== undefined) {
                    for (let i = 0; i < keys.length; i++) {
                        dataset.push(UsageAnalytics.getDataAsset(keys[i]));
                    }

                    dataset = await Promise.all(dataset);

                    for (let i = 0; i < keys.length; i++) {
                        nameKeys.push(dataset[i].data.name);
                    }

                    dataset = [];

                    for (let i = 0; i < this.barTitles.length; i++) {
                        let dataPoints = [];
                        const labelDates = [];

                        for (let j = 0; j < keys.length; j++) {
                            if (
                                values[j][this.barTitleAssoc[i]] !== undefined &&
                                values[j][this.barTitleAssoc[i]] !== null
                            )
                                dataPoints.push(values[j][this.barTitleAssoc[i]]);
                        }

                        const reorganizedData = [];
                        const backgroundColor = this.backgroundColorPalette;
                        const color = this.colorPalette;
                        if (this.backgroundColorPalette.length < keys.length) {
                            for (let j = 0; j <= keys.length - this.backgroundColorPalette.length; j++) {
                                backgroundColor.push(this.backgroundColorPalette[j]);
                                color.push(this.colorPalette[j]);
                            }
                        }

                        for (let j = 0; j < keys.length; j += 1) {
                            reorganizedData.push({ label: nameKeys[j], value: dataPoints[j] });
                        }
                        dataPoints = [];
                        reorganizedData.sort((a, b) => b.value - a.value);

                        for (let j = 0; j < keys.length; j++) {
                            labelDates.push(reorganizedData[j].label);
                            dataPoints.push(reorganizedData[j].value);
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
