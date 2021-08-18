<template>
    <div class="col-sm-12">
        <div v-for="(item, index) in activeQuery" :key="index" class="pt-2 pl-4">
            {{ parseActiveQueryStart(index) ? '(' : '' }}
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
            {{ parseActiveQueryEnd(index) ? ')' : '' }}
            &nbsp;
            <strong>
                <u>{{ item.linkOperator.value ? item.linkOperator.text : '' }}</u>
            </strong>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ActiveQueryDisplay',
    props: {
        activeQuery: {
            type: Array,
            required: true,
        },
    },
    methods: {
        parseActiveQueryStart(index) {
            if (index === this.activeQuery.length - 1) {
                return false;
            }
            if (this.activeQuery.length > 2) {
                if (this.activeQuery.find((q) => q.linkOperator.value === 'and')) {
                    if (index === 0 && this.activeQuery[index].linkOperator.value === 'or') {
                        return true;
                    }

                    if (
                        this.activeQuery[index].linkOperator.value === 'or' &&
                        this.activeQuery[index + 1].linkOperator.value === 'and' &&
                        this.activeQuery[index - 1].linkOperator.value !== 'or'
                    ) {
                        return true;
                    }

                    if (
                        this.activeQuery[index].linkOperator.value === 'or' &&
                        this.activeQuery[index - 1].linkOperator.value === 'and'
                    ) {
                        return true;
                    }
                }
            }
            return false;
        },
        parseActiveQueryEnd(index) {
            if (this.activeQuery.length > 2) {
                if (this.activeQuery.find((q) => q.linkOperator.value === 'and')) {
                    if (
                        index > 0 &&
                        this.activeQuery[index].linkOperator.value === 'and' &&
                        this.activeQuery[index - 1].linkOperator.value === 'or'
                    ) {
                        return true;
                    }
                    if (
                        !this.activeQuery[index].linkOperator.value &&
                        this.activeQuery[index - 1].linkOperator.value === 'or'
                    ) {
                        return true;
                    }
                }
            }
            return false;
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
