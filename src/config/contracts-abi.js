// Functions for the IcarusCore
export const core = [
    'event ContractCreated(address newContract)',
    'event LicenseContractCreated(address newLicenseContract)',
    'function createContract(address _consumer, bytes32 _assetHash, string _fields, string _filters, uint _duration, uint _updatesDuration, bytes32 _contract, bytes32 _platformTermsHash, uint8 _assetType, string _relatedDatasets)',
    'function createLicenseContract(bytes32 _assetHash, string _license, uint _privacyLevel, string _derivation, uint _attribution, uint _reproduction, uint _distribution, uint _offlineRetention, uint _reContext, uint _shareAlike, bytes32 _terms)',
    'function validateContract(address ctr)',
];

// Functions for the IcarusContract
export const contract = [
    'function acceptContract()',
    'function acceptOffer()',
    'function rejectContract()',
    'function rejectOffer()',
    'function contractPaid()',
    'function negotiate(bytes32 _newContractHash)',
    'function counterOffer(bytes32 _newContractHash)',
    'function validate()',
    'function isActive() view returns (bool)',
    'function allowUpdates() view returns (bool)',
];

export const licenseContract = [
    'function updateLicenseContract(string _license, uint _privacyLevel, string _derivation, uint _attribution, uint _reproduction, uint _distribution, uint _offlineRetention, uint _reContext, uint _shareAlike)',
];
