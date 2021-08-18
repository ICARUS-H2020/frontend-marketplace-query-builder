import { DataAsset, VirtualDataset, Result } from '@/api';

export default function useAsset(callback) {
    async function getDataset(id) {
        const { data } = await DataAsset.get(id);
        callback(data);
    }

    async function getVirtualDataset(id) {
        const { data } = await VirtualDataset.get(id);
        // get virtual dataset's input dataset
        if (data && data.input_dataset) {
            const inputDatasetSplit = data.input_dataset.split('_');
            if (data.input_dataset.includes('virtual_dataset')) {
                await getVirtualDataset(inputDatasetSplit[2]);
            } else if (data.input_dataset.includes('dataset')) {
                await getDataset(inputDatasetSplit[1]);
            }
        }
        // get virtual dataset's merged datasets
        if (data && data.virtualDatasetSteps) {
            data.virtualDatasetSteps.forEach((step) => {
                if (step.action === 'merge') {
                    step.rules.forEach(async (rule) => {
                        if (rule.parameters.dataset_b) {
                            const inputDatasetSplit = rule.parameters.dataset_b.split('_');
                            if (rule.parameters.dataset_b.includes('virtual_dataset')) {
                                await getVirtualDataset(inputDatasetSplit[2]);
                            } else if (rule.parameters.dataset_b.includes('dataset')) {
                                await getDataset(inputDatasetSplit[1]);
                            }
                        }
                    });
                }
            });
        }
    }

    async function getResult(id) {
        const { data } = await Result.get(id);
        if (data && data.inputs) {
            data.inputs.forEach(async (input) => {
                if (input.table) {
                    const inputSplit = input.table.split('_');
                    if (input.table.includes('virtual_dataset')) {
                        await getVirtualDataset(inputSplit[2]);
                    } else if (input.table.includes('dataset')) {
                        await getDataset(inputSplit[1]);
                    } else if (input.table.includes('result')) {
                        await getResult(inputSplit[1]);
                    }
                }
            });
        }
    }

    return { getDataset, getVirtualDataset, getResult };
}
