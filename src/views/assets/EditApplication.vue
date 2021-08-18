<template>
    <div class="edit-dataset">
        <page-title
            title="Edit Application"
            description="Edit metada for application"
            icon="pe-7s-pen icon-gradient bg-malibu-beach"
            v-slot:actions
        >
            <button
                type="button"
                class="btn-shadow d-inline-flex align-items-center btn btn-warning text-white"
                @click="submit()"
                :disabled="submitButton.locked"
            >
                Submit
            </button>
            &nbsp;
            <button type="button" class="btn-shadow d-inline-flex align-items-center btn btn-light" @click="cancel()">
                Cancel
            </button>
        </page-title>

        <div class="row">
            <div class="col-md-12 col-lg-12 col-xl-12">
                <b-card class="mb-3" no-body>
                    <designer-metadata mode="update" :id="id" v-model="submitButton" ref="metadataComponent" />
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
import { PageTitle } from '@/components';
import DesignerMetadata from '../workspace/Metadata.vue';

export default {
    name: 'Dataset',
    components: {
        PageTitle,
        DesignerMetadata,
    },
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },
    data: () => ({
        submitButton: {
            locked: false,
        },
    }),
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.previousRoute = from;
        });
    },
    methods: {
        async submit() {
            this.$refs.metadataComponent.checkDerivation();
            this.$refs.metadataComponent.formSubmitted = true;
            this.$refs.metadataComponent.$validator.validateAll().then(async (success) => {
                if (success) {
                    try {
                        await this.$refs.metadataComponent.updateApplication();
                    } catch (e) {
                        this.$toastr.e('Error saving application');
                    }
                } else {
                    this.$toastr.e('One or more fields require your attention', 'Error');
                }
            });
        },
        cancel() {
            this.$router.push(this.previousRoute);
        },
    },
};
</script>

<style lang="scss"></style>
