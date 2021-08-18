<template>
    <div class="card-body query-builder">
        <div v-if="query.length" class="form-group">
            <h6 class="label font-weight-bold">Query Editor:</h6>
            <ul>
                <li v-for="(item, index) in query" :key="index">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0">
                            Dataset
                            <strong v-if="item.operator === 'Exists'">contains</strong>
                            <strong v-else-if="item.operator === 'Does not exist'">does not contain</strong>
                            <strong v-else>{{ item.operator.toLowerCase() }}</strong>
                            column title
                            <strong>{{ item.columnTitle }}</strong>
                            <span v-if="item.operator !== 'Exists' && item.operator !== 'Does not exist'">
                                with value{{ numberOfValues(item) }}
                                <strong>{{ modifyValues(item) }}</strong>
                            </span>
                        </h6>

                        <div class="d-flex justify-content-between">
                            <b-dropdown
                                class="mr-2"
                                size="sm"
                                :text="item.linkOperator.text"
                                :disabled="index === query.length - 1 && checkAvailability"
                                variant="light"
                            >
                                <b-dropdown-item
                                    v-for="(option, idx) in index === query.length - 1
                                        ? lastQueryLinkOperators
                                        : linkOperators"
                                    :key="idx"
                                    :value="option.value"
                                    :active="option.value === item.linkOperator.value"
                                    @click="changeLinkOperator(index, option)"
                                >
                                    {{ option.text }}
                                </b-dropdown-item>
                            </b-dropdown>
                            <b-button-group size="sm">
                                <b-button
                                    @click="editQuery(item, index)"
                                    variant="light"
                                    size="sm"
                                    :disabled="showAddQueryWindow"
                                    v-b-tooltip.hover
                                    :title="!showAddQueryWindow ? 'Edit' : null"
                                >
                                    <font-awesome-icon icon="edit" />
                                </b-button>
                                <b-button
                                    :disabled="showAddQueryWindow"
                                    @click="removeQuery(index)"
                                    variant="danger"
                                    size="sm"
                                    v-b-tooltip="'Delete'"
                                >
                                    <font-awesome-icon icon="trash" />
                                </b-button>
                            </b-button-group>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div
            v-if="showAddQueryWindow || !query.length"
            class="card-body border border-secondary rounded mb-4"
            style="background-color: #f3f4f6;"
        >
            <div class="row">
                <div class="position-relative form-group col-lg-6">
                    <label for="columnTitles">
                        Column title
                        <tooltip v-b-tooltip="'The exact columns / concepts that must appear in the data asset. '" />
                    </label>
                    <div class="d-flex">
                        <div>
                            <treeselect
                                name="columnTitles"
                                :options="dataModel"
                                :searchable="true"
                                :disable-branch-nodes="true"
                                v-model="newQuery.columnTitle"
                                @select="clearSelection()"
                                placeholder="Select column title"
                            >
                                <label
                                    slot="option-label"
                                    slot-scope="{ node, labelClassName }"
                                    :class="labelClassName"
                                >
                                    {{ node.raw.text }}
                                </label>
                                <label slot="value-label" slot-scope="{ node, labelClassName }" :class="labelClassName">
                                    {{ node.raw.text }}
                                </label>
                            </treeselect>
                        </div>
                        <b-button
                            class="btn-icon paste-button"
                            size="sm"
                            variant="primary"
                            v-if="$store.state.copiedConcept"
                            @click="pasteCopiedConcept()"
                            v-b-tooltip.hover="'Paste Copied Concept'"
                        >
                            <font-awesome-icon icon="paste" />
                        </b-button>
                    </div>
                </div>

                <div class="position-relative form-group col-lg-6">
                    <label for="operator">
                        Operator
                        <tooltip v-b-tooltip="'The exact columns / concepts that must appear in the data asset. '" />
                    </label>

                    <b-form-radio-group
                        buttons
                        class="d-flex align-items-end"
                        button-variant="outline-primary"
                        size="md"
                        v-model="newQuery.operator"
                        :options="['Exists', 'Does not exist', 'Contains', 'Does not contain']"
                        name="operator"
                    />
                </div>
            </div>
            <div class="row">
                <div class="position-relative form-group col-sm-9">
                    <div
                        v-if="
                            newQuery.columnTitle &&
                            newQuery.operator !== 'Exists' &&
                            newQuery.operator !== 'Does not exist'
                        "
                    >
                        <label for="values">
                            Value(s)
                            <tooltip
                                v-b-tooltip="
                                    'Different values are allowed based on the Column title\'s data type. All values must be separated by comma (,).'
                                "
                            />
                        </label>
                        <div>
                            <div class="d-flex" v-if="columnTitleType === 'datetime' || columnTitleType === 'date'">
                                <div class="mr-2 d-flex align-items-center">
                                    <b-form-radio-group
                                        buttons
                                        button-variant="outline-primary"
                                        size="md"
                                        @change="newQuery.values = null"
                                        v-model="newQuery.singleOrRange"
                                        v-b-tooltip="'Select either a Single date or a Range of dates'"
                                        :options="datetimeTypeOptions"
                                        name="datesChoice"
                                    />
                                </div>
                                <div style="width: 100%;">
                                    <date-picker
                                        v-show="newQuery.singleOrRange === 'Range'"
                                        name="values"
                                        input-class="form-control"
                                        width="100%"
                                        v-model="newQuery.values"
                                        :type="'date'"
                                        :lang="'en'"
                                        :shortcuts="false"
                                        :value-type="'format'"
                                        range
                                        @clear="newQuery.values = null"
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

                                    <date-picker
                                        v-show="newQuery.singleOrRange === 'Single'"
                                        name="values"
                                        input-class="form-control"
                                        width="100%"
                                        v-model="newQuery.values"
                                        :type="'date'"
                                        :lang="'en'"
                                        :shortcuts="false"
                                        :value-type="'format'"
                                        @clear="newQuery.values = null"
                                    ></date-picker>
                                </div>
                            </div>

                            <input
                                v-else
                                name="values"
                                required
                                :placeholder="
                                    columnTitleType === 'double' || columnTitleType === 'integer'
                                        ? 'Enter numeric value(s)'
                                        : 'Enter value(s), use the wildcard operator ? to match any single character and * to match zero or more characters'
                                "
                                type="text"
                                :class="{ 'is-invalid': notNumericValue || notValidTimeValue }"
                                class="form-control col-sm-12"
                                v-model="newQuery.values"
                            />
                        </div>
                    </div>
                </div>

                <div class="position-relative form-group col-sm-3">
                    <div class="d-flex justify-content-end mt-4 pt-1">
                        <button
                            v-if="editingQueryIdx === null"
                            @click="addQueryToList"
                            type="button"
                            style="height: 35px;"
                            class="btn btn-primary"
                            :disabled="invalid"
                        >
                            Add sub-query
                        </button>
                        <span v-else>
                            <button
                                @click="cancelEditQuery()"
                                type="button"
                                class="btn btn-light mr-2"
                                style="height: 35px;"
                            >
                                Cancel
                            </button>
                            <button
                                @click="updateQuery()"
                                type="button"
                                class="btn btn-primary"
                                style="height: 35px;"
                                :disabled="invalid"
                            >
                                Update
                            </button>
                        </span>
                    </div>
                </div>
            </div>

            <div class="row" v-if="notNumericValue || notValidTimeValue">
                <div class="col-sm-12">
                    <div class="alert alert-danger" role="error">
                        <font-awesome-icon icon="info-circle" />
                        <span class="ml-2">
                            {{
                                notNumericValue
                                    ? 'Values must only be numbers separated by comma (,)'
                                    : 'Values must either be numbers between 1-24 (included) or in the form hours:minutes (00:00 - 23:59). They should be separated by comma (,)'
                            }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-if="checkAvailability">
            <div class="col-sm-12">
                <div class="alert alert-warning" role="alert">
                    <font-awesome-icon icon="info-circle" />
                    <span class="ml-2">Limit of added sub-queries has been reached</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12 text-left">
                <button type="button" class="btn btn-light mr-2" :disabled="!query.length" @click="clearQuery()">
                    Clear filters
                </button>
                <button
                    v-if="!editMode"
                    type="button"
                    class="btn btn-primary mr-2"
                    :disabled="showAddQueryWindow || !query.length"
                    @click="openSaveQueryModal()"
                >
                    Save query
                </button>
                <button
                    v-else
                    type="button"
                    class="btn btn-primary mr-2"
                    :disabled="showAddQueryWindow || !query.length"
                    @click="updateSavedQuery()"
                >
                    Update query
                </button>
            </div>
        </div>
        <save-query-modal id="saveQueryModal" @save-query-details="saveQuery" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { clone } from 'ramda';
import Treeselect from '@riophae/vue-treeselect';
import SaveQueryModal from '@/layouts/architect/components/modals/SaveQueryModal.vue';
import { Tooltip } from '@/components';
import DatePicker from 'vue2-datepicker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaste, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { SET_COPIED_CONCEPT } from '@/store/mutation-types';
import { Query } from '@/api';

library.add(faPaste, faTrash, faEdit);
const R = { clone };

export default {
    name: 'QueryBuilder',
    components: { Treeselect, Tooltip, FontAwesomeIcon, SaveQueryModal, DatePicker },
    props: {
        parentQuery: {
            type: Array,
            default: null,
        },
        dataModel: {
            type: [Array, Object],
            default: null,
        },
        editMode: {
            type: [String, Number],
            default: null,
        },
    },
    data() {
        return {
            query: [],
            newQuery: {
                id: null,
                columnTitle: null,
                columnType: null,
                operator: 'Exists',
                domainKnowledge: false,
                singleOrRange: null,
                values: null,
                linkOperator: { text: 'None', value: null },
            },
            lastQueryLinkOperators: [
                { text: 'None', value: null },
                { text: 'AND', value: 'and' },
                { text: 'OR', value: 'or' },
            ],
            linkOperators: [
                { text: 'AND', value: 'and' },
                { text: 'OR', value: 'or' },
            ],
            showAddQueryWindow: false,
            editingQueryIdx: null,
            resetQueryValues: null,
            notNumericValue: false,
            notValidTimeValue: false,
            datetimeTypeOptions: ['Single', 'Range'],
        };
    },
    computed: {
        ...mapGetters(['flatModel']),
        invalid() {
            if (this.newQuery.operator === 'Exists' || this.newQuery.operator === 'Does not exist')
                return !this.newQuery.columnTitle;
            return !(this.newQuery.columnTitle && this.newQuery.values);
        },
        checkAvailability() {
            return this.query.length === 5;
        },
        columnTitleType() {
            return this.flatModel[this.newQuery.columnTitle].type;
        },
    },
    watch: {
        parentQuery() {
            if (this.parentQuery) {
                this.query = R.clone(this.parentQuery);
            }
        },
    },
    async created() {
        if (this.parentQuery) {
            this.query = R.clone(this.parentQuery);
        }
    },
    methods: {
        clearQuery() {
            this.query = [];
            this.$emit('clear-query');
        },
        clearNewQuery() {
            this.newQuery = {
                id: null,
                columnTitle: null,
                columnType: null,
                operator: 'Exists',
                domainKnowledge: false,
                singleOrRange: null,
                values: null,
                linkOperator: { text: 'None', value: null },
            };
        },
        pasteCopiedConcept() {
            if (this.editingQueryIdx === null) {
                this.newQuery.columnTitle = this.$store.state.copiedConcept;
            } else {
                this.query[this.editingQueryIdx].columnTitle = this.$store.state.copiedConcept;
            }
            this.$store.commit(SET_COPIED_CONCEPT, null);
        },
        updateParentQuery() {
            this.$emit('update-query', this.query);
        },
        checkIfTimeValues(timeValues) {
            let checkIfNotValidNumber = false; // 1-24 and 00:00 - 23:59 all of these values are valid
            let checkIfNotTimeRepresentation = false;

            timeValues.forEach((t) => {
                // eslint-disable-next-line no-restricted-globals
                if (isNaN(Number(t))) {
                    checkIfNotValidNumber = true;
                } else if (Number(t) < 1 || Number(t) > 24) {
                    checkIfNotValidNumber = true;
                }

                if (!/^([0-1][0-9])|(2[0-3]):([0-5][0-9])$/.test(t)) {
                    checkIfNotTimeRepresentation = true;
                }

                if (checkIfNotValidNumber && checkIfNotTimeRepresentation) {
                    this.notValidTimeValue = true;
                }

                checkIfNotTimeRepresentation = false;
                checkIfNotValidNumber = false;
            });
        },
        validateValuesType() {
            this.notNumericValue = false;
            this.notValidTimeValue = false;

            const splittedValues =
                this.columnTitleType !== 'date' && this.columnTitleType !== 'datetime'
                    ? this.newQuery.values.split(',')
                    : [];

            switch (this.columnTitleType) {
                case 'double':
                case 'integer':
                    splittedValues.forEach((v) => {
                        // eslint-disable-next-line no-restricted-globals
                        if (isNaN(Number(v))) {
                            this.notNumericValue = true;
                        }
                    });

                    break;
                case 'time':
                    this.checkIfTimeValues(splittedValues);
                    break;
                default:
                    break;
            }
        },
        async addQueryToList() {
            if (this.newQuery.values) await this.validateValuesType();
            if (!this.notNumericValue && !this.notValidTimeValue) {
                this.newQuery.columnType = this.columnTitleType;
                this.newQuery.id = this.query.length ? this.query[this.query.length - 1].id + 1 : 1;
                this.query.push(this.newQuery);
                this.updateParentQuery();
                this.clearNewQuery();
                this.showAddQueryWindow = false;
            }
        },
        changeLinkOperator(idx, linkOperator) {
            this.notNumericValue = false;
            this.notValidTimeValue = false;
            this.query[idx].linkOperator = linkOperator;
            this.updateParentQuery();

            if (this.query.length - 1 === idx) {
                this.showAddQueryWindow = !!linkOperator.value;
            }
        },
        editQuery(item, idx) {
            this.editingQueryIdx = idx;
            this.showAddQueryWindow = true;
            this.newQuery = R.clone(item);
            this.resetQueryValues = R.clone(item);
        },
        cancelEditQuery() {
            this.showAddQueryWindow = false;
            this.clearNewQuery();
            this.query[this.editingQueryIdx] = this.resetQueryValues;
            this.updateParentQuery();
            this.editingQueryIdx = null;
            this.resetQueryValues = null;
        },
        async updateQuery() {
            if (this.newQuery.values) await this.validateValuesType();
            if (!this.notNumericValue && !this.notValidTimeValue) {
                this.newQuery.columnType = this.columnTitleType;
                this.showAddQueryWindow = false;
                this.query[this.editingQueryIdx] = this.newQuery;
                this.updateParentQuery();
                this.resetQueryValues = null;
                this.editingQueryIdx = null;
                this.clearNewQuery();
            }
        },
        async removeQuery(idx) {
            this.query.splice(idx, 1);
            if (this.query.length && this.query[this.query.length - 1].linkOperator.value) {
                this.showAddQueryWindow = false;
                this.query[this.query.length - 1].linkOperator = { text: 'None', value: null };
            }
            await this.updateParentQuery();
        },
        openSaveQueryModal() {
            this.$bvModal.show('saveQueryModal');
        },
        saveQuery(queryDetails) {
            const queryPayload = {
                parameters: this.query,
                ...queryDetails,
            };
            Query.create(queryPayload)
                .then((res) => {
                    this.$emit('created-query', this.query, res.data.id);
                    this.$toastr.s('Query has been saved successfully!', 'Success');
                })
                .catch(() => {
                    this.$toastr.e('Query could not be saved due to an error.', 'Error');
                });

            this.$bvModal.hide('saveQueryModal');
        },
        updateSavedQuery() {
            Query.update(this.editMode, { parameters: this.query })
                .then(() => {
                    this.$toastr.s('Query has been updated successfully!', 'Success');
                })
                .catch(() => {
                    this.$toastr.e('Query could not be updated due to an error.', 'Error');
                });
        },
        clearSelection() {
            this.notNumericValue = false;
            this.notValidTimeValue = false;
            this.newQuery.values = null;
            this.newQuery.singleOrRange = 'Single';
        },
        numberOfValues(item) {
            if (!item.values) return '';
            if (item.columnType === 'datetime' || item.columnType === 'date') {
                if (item.singleOrRange === 'Single') {
                    return '';
                }
                return 's';
            }

            return item.values.split(',').length > 1 ? 's' : '';
        },
        modifyValues(item) {
            if (item.singleOrRange === 'Range') {
                return item.values[0].concat(' ~ ').concat(item.values[1]);
            }
            return item.values;
        },
    },
};
</script>

<style lang="scss">
.query-builder {
    .paste-button {
        margin: 1px;
        padding: 0.25rem 0.6rem;
    }

    .form-control {
        height: 35px;
    }
}
</style>
