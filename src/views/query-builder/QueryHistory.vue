<template>
    <div class="query-history">
        <div class="mb-2">
            <div class="d-flex flex-wrap justify-content-end">
                <div>
                    <b-button
                        class="btn-hover-shine btn-shadow btn-transition btn-warning text-white my-1"
                        variant="warning"
                        size="sm"
                        v-b-tooltip="'Add New Query Search'"
                        @click="createNewQuerySearch()"
                        v-if="!isLoading"
                    >
                        <font-awesome-icon icon="plus" class="mr-2" />
                        New Query Search
                    </b-button>
                    <loading-button variant="warning" :loading="isLoading" />
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12" v-if="filteredQueries.length === 0 && !isLoading && !hasError">
                <div class="alert alert-warning" role="alert">
                    <font-awesome-icon icon="info-circle" />
                    <span class="ml-2">No queries found!</span>
                </div>
            </div>
            <div class="col-12" v-if="hasError">
                <div class="alert alert-danger" role="alert">
                    <font-awesome-icon icon="exclamation-circle" />
                    <span class="ml-2">Something went wrong! Please try again later.</span>
                </div>
            </div>
        </div>
        <div class="main-card card card-border mb-3" v-if="filteredQueries.length">
            <div class="table-responsive">
                <table class="align-middle text-truncate mb-0 table table-hover fixed">
                    <thead>
                        <tr>
                            <th class="text-center" width="7%">ID</th>
                            <th class="text-left" width="30%">Query Name</th>
                            <th class="text-center" width="40%">Created By</th>
                            <th class="text-center" width="5%">Created Date</th>
                            <th width="20%"></th>

                            <th class="text-center" width="10%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(query, index) in filteredQueries" :key="index">
                            <td class="text-center text-muted pl-4 pr-4" width="7%">{{ query.id }}</td>
                            <td class="text-left overflow" width="30%">
                                <router-link :to="{ name: 'marketplace', params: query }" class="router-link-overflow">
                                    <strong>{{ query.name }}</strong>
                                    <br />
                                </router-link>
                                <em class="text-muted">{{ query.description }}</em>
                            </td>
                            <td class="text-center" width="40%">
                                <vue-avatar
                                    class="mr-1"
                                    :username="[query.created_by.firstname, query.created_by.lastname].join(' ')"
                                    :size="32"
                                    :custom-style="{ display: 'inline-block', opacity: 0.4 }"
                                    :lighten="200"
                                />
                                {{ query.created_by.firstname }} {{ query.created_by.lastname }}
                            </td>
                            <td class="text-center" width="20%">
                                {{ query.created_at }}
                            </td>
                            <td class="text-center" width="20%"></td>

                            <td class="text-center pl-4 pr-4" width="10%">
                                <b-button-group>
                                    <b-button
                                        variant="light"
                                        size="sm"
                                        v-b-tooltip.hover.top="'Edit'"
                                        @click="openEditModal(query)"
                                    >
                                        <font-awesome-icon icon="edit" />
                                    </b-button>
                                    <b-button
                                        variant="danger"
                                        size="sm"
                                        v-b-tooltip.hover.top="'Delete'"
                                        @click="deleteQuery(index)"
                                    >
                                        <font-awesome-icon icon="trash" />
                                    </b-button>
                                </b-button-group>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <edit-query-modal :query="queryUnderEditing" id="editQueryModal" @update-query-details="updateQueryDetails" />
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faInfoCircle, faEdit, faTrash, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import EditQueryModal from '@/layouts/architect/components/modals/EditQueryModal.vue';
import VueAvatar from 'vue-avatar';
import { LoadingButton } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Query } from '@/api';
import { clone } from 'ramda';

const R = { clone };

library.add(faExclamationCircle, faInfoCircle, faEdit, faTrash, faPlay, faPlus);
export default {
    name: 'QueryHistory',
    components: { FontAwesomeIcon, LoadingButton, EditQueryModal, VueAvatar },
    data: () => ({
        queries: [],
        isLoading: false,
        hasError: false,
        query: '',
        queryUnderEditing: null,
    }),
    computed: {
        filteredQueries() {
            return this.queries;
        },
    },
    async created() {
        this.search();
    },
    methods: {
        async search() {
            this.hasError = false;
            this.isLoading = true;
            this.queries = [];
            try {
                const { data: organisationQueries } = await Query.all();
                this.queries = organisationQueries;
            } catch {
                this.hasError = true;
            } finally {
                this.isLoading = false;
            }
        },
        createNewQuerySearch() {
            this.$router.push({ name: 'marketplace', params: { openQueryBuilder: true } });
        },
        openEditModal(query) {
            this.queryUnderEditing = R.clone(query);
            this.$bvModal.show('editQueryModal');
        },
        async deleteQuery(idx) {
            Query.delete(this.queries[idx].id)
                .then(() => {
                    this.queries.splice(idx, 1);
                    this.$toastr.s('Query has been deleted successfully!', 'Success');
                })
                .catch(() => {
                    this.$toastr.e('Query could not be deleted due to an error.', 'Error');
                });
        },
        updateQueryDetails(updatedQueryDetails) {
            const idx = this.queries.findIndex((obj) => obj.id === updatedQueryDetails.id);
            const payload = {
                name: updatedQueryDetails.name,
                description: updatedQueryDetails.description,
                parameterers: updatedQueryDetails.parameters,
            };
            Query.update(this.queries[idx].id, payload)
                .then(() => {
                    if (~idx) {
                        this.queries[idx].name = updatedQueryDetails.name;
                        this.queries[idx].description = updatedQueryDetails.description;
                    }
                    this.$toastr.s('Query has been updated successfully!', 'Success');
                })
                .catch(() => {
                    this.$toastr.e('Query could not be updated due to an error.', 'Error');
                });

            this.$bvModal.hide('editQueryModal');
        },
    },
};
</script>

<style lang="scss">
.query-history {
    .queries-header {
        box-shadow: 0px 2px 10px 0px rgba(204, 204, 204, 1);
    }
}
</style>
