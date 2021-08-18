<template>
    <tr>
        <td class="text-center" style="width: 64px;">
            <div class="custom-checkbox custom-control">
                <b-form-checkbox :value="column.name" v-model="value" @change="onChange">&nbsp;</b-form-checkbox>
            </div>
        </td>
        <td class="text-left">
            {{ column.name }}
            <template v-if="fieldsInfo">
                <div class="badge badge-alternate ml-2" v-if="fieldsInfo[column.name].cleaning">
                    <font-awesome-icon class="text-white" icon="broom" />
                </div>
                <div class="badge badge-primary ml-2" v-if="fieldsInfo[column.name].anonymization">
                    <font-awesome-icon class="text-white" icon="user-secret" />
                </div>
                <div class="badge badge-success ml-2" v-if="fieldsInfo[column.name].encrypted">
                    <font-awesome-icon class="text-white" icon="lock" />
                </div>
            </template>
        </td>
        <td class="text-left">
            {{ column.definition }}
            <div v-if="fieldsInfo && fieldsInfo[column.name].additional_description">
                <br />
                <em class="text-muted">{{ fieldsInfo[column.name].additional_description }}</em>
            </div>
        </td>
        <td class="text-left pt-3 pb-3 narrow-padding">
            <template v-if="fieldsInfo[column.name].encrypted">&mdash;</template>
            <template v-else>
                <template v-if="column.type === 'datetime'">
                    <date-picker
                        v-model="column.filter"
                        :type="'date'"
                        :lang="'en'"
                        :editable="false"
                        :shortcuts="false"
                        :value-type="'format'"
                        :disabled="disabled"
                        range
                    >
                        <template slot="header">
                            <p class="px-2 pt-2 mb-0 text-center">
                                <u>Select start and end dates using the left and right calendars respectively</u>
                            </p>
                        </template>
                    </date-picker>
                </template>
                <template v-else>&mdash;</template>
            </template>
        </td>
    </tr>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    name: 'ColumnRow',
    components: { DatePicker, FontAwesomeIcon },
    props: {
        column: {
            type: Object,
            required: true,
        },
        value: {
            type: Array,
            required: true,
        },
        fieldsInfo: {
            validator: (prop) => typeof prop === 'object' || prop === null,
            required: true,
        },
    },
    data() {
        return {
            disabled: false,
        };
    },
    methods: {
        onChange(e) {
            const newValue = [...this.value];
            this.disabled = !e;
            if (e) {
                newValue.push(this.column.name);
            } else {
                const idx = newValue.findIndex((obj) => obj === this.column.name);
                if (~idx) {
                    newValue.splice(idx, 1);
                }
            }
            this.$emit('input', newValue);
        },
    },
};
</script>
