const contractLensABI = [
  {
    inputs: [
      { internalType: "address", name: "followNFTImpl", type: "address" },
      { internalType: "address", name: "collectNFTImpl", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "CallerNotCollectNFT", type: "error" },
  { inputs: [], name: "CallerNotFollowNFT", type: "error" },
  { inputs: [], name: "CannotInitImplementation", type: "error" },
  { inputs: [], name: "DispatcherNotSet", type: "error" },
  { inputs: [], name: "EmergencyAdminCannotUnpause", type: "error" },
  { inputs: [], name: "InitParamsInvalid", type: "error" },
  { inputs: [], name: "Initialized", type: "error" },
  { inputs: [], name: "NotGovernance", type: "error" },
  { inputs: [], name: "NotGovernanceOrEmergencyAdmin", type: "error" },
  { inputs: [], name: "NotOwnerOrApproved", type: "error" },
  { inputs: [], name: "NotProfileOwner", type: "error" },
  { inputs: [], name: "NotProfileOwnerOrDispatcher", type: "error" },
  { inputs: [], name: "Paused", type: "error" },
  { inputs: [], name: "ProfileCreatorNotWhitelisted", type: "error" },
  { inputs: [], name: "ProfileImageURILengthInvalid", type: "error" },
  { inputs: [], name: "PublicationDoesNotExist", type: "error" },
  { inputs: [], name: "PublishingPaused", type: "error" },
  { inputs: [], name: "SignatureExpired", type: "error" },
  { inputs: [], name: "SignatureInvalid", type: "error" },
  { inputs: [], name: "ZeroSpender", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        internalType: "struct DataTypes.EIP712Signature",
        name: "sig",
        type: "tuple",
      },
    ],
    name: "burnWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "collect",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "collector", type: "address" },
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "uint256", name: "pubId", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.CollectWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "collectWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "uint256",
            name: "profileIdPointed",
            type: "uint256",
          },
          { internalType: "uint256", name: "pubIdPointed", type: "uint256" },
          {
            internalType: "bytes",
            name: "referenceModuleData",
            type: "bytes",
          },
          { internalType: "address", name: "collectModule", type: "address" },
          {
            internalType: "bytes",
            name: "collectModuleInitData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
        ],
        internalType: "struct DataTypes.CommentData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "comment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "uint256",
            name: "profileIdPointed",
            type: "uint256",
          },
          { internalType: "uint256", name: "pubIdPointed", type: "uint256" },
          {
            internalType: "bytes",
            name: "referenceModuleData",
            type: "bytes",
          },
          { internalType: "address", name: "collectModule", type: "address" },
          {
            internalType: "bytes",
            name: "collectModuleInitData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.CommentWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "commentWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "uint256",
            name: "profileIdPointed",
            type: "uint256",
          },
          { internalType: "uint256", name: "pubIdPointed", type: "uint256" },
          {
            internalType: "bytes",
            name: "referenceModuleData",
            type: "bytes",
          },
          { internalType: "address", name: "collectModule", type: "address" },
          {
            internalType: "bytes",
            name: "collectModuleInitData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.CommentWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "commentWithSig_Dispatcher",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "string", name: "handle", type: "string" },
          { internalType: "string", name: "imageURI", type: "string" },
          { internalType: "address", name: "followModule", type: "address" },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes",
          },
          { internalType: "string", name: "followNFTURI", type: "string" },
        ],
        internalType: "struct DataTypes.CreateProfileData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "createProfile",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "defaultProfile",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
      { internalType: "uint256", name: "collectNFTId", type: "uint256" },
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "emitCollectNFTTransferEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "followNFTId", type: "uint256" },
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "emitFollowNFTTransferEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "exists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "profileIds", type: "uint256[]" },
      { internalType: "bytes[]", name: "datas", type: "bytes[]" },
    ],
    name: "follow",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "follower", type: "address" },
          {
            internalType: "uint256[]",
            name: "profileIds",
            type: "uint256[]",
          },
          { internalType: "bytes[]", name: "datas", type: "bytes[]" },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.FollowWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "followWithSig",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
    ],
    name: "getCollectModule",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
    ],
    name: "getCollectNFT",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCollectNFTImpl",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
    ],
    name: "getContentURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getDispatcher",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDomainSeparator",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getFollowModule",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getFollowNFT",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFollowNFTImpl",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getFollowNFTURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGovernance",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getHandle",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getProfile",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "pubCount", type: "uint256" },
          { internalType: "address", name: "followModule", type: "address" },
          { internalType: "address", name: "followNFT", type: "address" },
          { internalType: "string", name: "handle", type: "string" },
          { internalType: "string", name: "imageURI", type: "string" },
          { internalType: "string", name: "followNFTURI", type: "string" },
        ],
        internalType: "struct DataTypes.ProfileStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "handle", type: "string" }],
    name: "getProfileIdByHandle",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
    ],
    name: "getPub",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "profileIdPointed",
            type: "uint256",
          },
          { internalType: "uint256", name: "pubIdPointed", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          { internalType: "address", name: "collectModule", type: "address" },
          { internalType: "address", name: "collectNFT", type: "address" },
        ],
        internalType: "struct DataTypes.PublicationStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getPubCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
    ],
    name: "getPubPointer",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
    ],
    name: "getPubType",
    outputs: [
      { internalType: "enum DataTypes.PubType", name: "", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
    ],
    name: "getReferenceModule",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getState",
    outputs: [
      {
        internalType: "enum DataTypes.ProtocolState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "address", name: "newGovernance", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "collectModule", type: "address" },
    ],
    name: "isCollectModuleWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "followModule", type: "address" },
    ],
    name: "isFollowModuleWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "profileCreator", type: "address" },
    ],
    name: "isProfileCreatorWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "referenceModule", type: "address" },
    ],
    name: "isReferenceModuleWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "mintTimestampOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          {
            internalType: "uint256",
            name: "profileIdPointed",
            type: "uint256",
          },
          { internalType: "uint256", name: "pubIdPointed", type: "uint256" },
          {
            internalType: "bytes",
            name: "referenceModuleData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
        ],
        internalType: "struct DataTypes.MirrorData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "mirror",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          {
            internalType: "uint256",
            name: "profileIdPointed",
            type: "uint256",
          },
          { internalType: "uint256", name: "pubIdPointed", type: "uint256" },
          {
            internalType: "bytes",
            name: "referenceModuleData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.MirrorWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "mirrorWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          {
            internalType: "uint256",
            name: "profileIdPointed",
            type: "uint256",
          },
          { internalType: "uint256", name: "pubIdPointed", type: "uint256" },
          {
            internalType: "bytes",
            name: "referenceModuleData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.MirrorWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "mirrorWithSig_Dispatcher",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        internalType: "struct DataTypes.EIP712Signature",
        name: "sig",
        type: "tuple",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
      {
        components: [
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        internalType: "struct DataTypes.EIP712Signature",
        name: "sig",
        type: "tuple",
      },
    ],
    name: "permitForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          { internalType: "address", name: "collectModule", type: "address" },
          {
            internalType: "bytes",
            name: "collectModuleInitData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
        ],
        internalType: "struct DataTypes.PostData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "post",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          { internalType: "address", name: "collectModule", type: "address" },
          {
            internalType: "bytes",
            name: "collectModuleInitData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.PostWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "postWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          { internalType: "address", name: "collectModule", type: "address" },
          {
            internalType: "bytes",
            name: "collectModuleInitData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "referenceModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes",
          },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.PostWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "postWithSig_Dispatcher",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "setDefaultProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "wallet", type: "address" },
          { internalType: "uint256", name: "profileId", type: "uint256" },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.SetDefaultProfileWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "setDefaultProfileWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "address", name: "dispatcher", type: "address" },
    ],
    name: "setDispatcher",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "address", name: "dispatcher", type: "address" },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.SetDispatcherWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "setDispatcherWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newEmergencyAdmin", type: "address" },
    ],
    name: "setEmergencyAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "address", name: "followModule", type: "address" },
      { internalType: "bytes", name: "followModuleInitData", type: "bytes" },
    ],
    name: "setFollowModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "address", name: "followModule", type: "address" },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes",
          },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.SetFollowModuleWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "setFollowModuleWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "string", name: "followNFTURI", type: "string" },
    ],
    name: "setFollowNFTURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "followNFTURI", type: "string" },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.SetFollowNFTURIWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "setFollowNFTURIWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newGovernance", type: "address" },
    ],
    name: "setGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "string", name: "imageURI", type: "string" },
    ],
    name: "setProfileImageURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "imageURI", type: "string" },
          {
            components: [
              { internalType: "uint8", name: "v", type: "uint8" },
              { internalType: "bytes32", name: "r", type: "bytes32" },
              { internalType: "bytes32", name: "s", type: "bytes32" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            internalType: "struct DataTypes.EIP712Signature",
            name: "sig",
            type: "tuple",
          },
        ],
        internalType: "struct DataTypes.SetProfileImageURIWithSigData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "setProfileImageURIWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum DataTypes.ProtocolState",
        name: "newState",
        type: "uint8",
      },
    ],
    name: "setState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "sigNonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenDataOf",
    outputs: [
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint96", name: "mintTimestamp", type: "uint96" },
        ],
        internalType: "struct IERC721Time.TokenData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "collectModule", type: "address" },
      { internalType: "bool", name: "whitelist", type: "bool" },
    ],
    name: "whitelistCollectModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "followModule", type: "address" },
      { internalType: "bool", name: "whitelist", type: "bool" },
    ],
    name: "whitelistFollowModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "profileCreator", type: "address" },
      { internalType: "bool", name: "whitelist", type: "bool" },
    ],
    name: "whitelistProfileCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "referenceModule", type: "address" },
      { internalType: "bool", name: "whitelist", type: "bool" },
    ],
    name: "whitelistReferenceModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "follower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "profileIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "bytes[]",
        name: "followModuleDatas",
        type: "bytes[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Followed",
    type: "event",
  },
];

const ERC721 = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "awardItem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const superTokenABI = [
  {
    inputs: [
      { internalType: "contract ISuperfluid", name: "host", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "SF_TOKEN_AGREEMENT_ALREADY_EXISTS", type: "error" },
  { inputs: [], name: "SF_TOKEN_AGREEMENT_DOES_NOT_EXIST", type: "error" },
  { inputs: [], name: "SF_TOKEN_BURN_INSUFFICIENT_BALANCE", type: "error" },
  { inputs: [], name: "SF_TOKEN_MOVE_INSUFFICIENT_BALANCE", type: "error" },
  { inputs: [], name: "SF_TOKEN_ONLY_HOST", type: "error" },
  { inputs: [], name: "SF_TOKEN_ONLY_LISTED_AGREEMENT", type: "error" },
  { inputs: [], name: "SUPER_TOKEN_APPROVE_FROM_ZERO_ADDRESS", type: "error" },
  { inputs: [], name: "SUPER_TOKEN_APPROVE_TO_ZERO_ADDRESS", type: "error" },
  { inputs: [], name: "SUPER_TOKEN_BURN_FROM_ZERO_ADDRESS", type: "error" },
  {
    inputs: [],
    name: "SUPER_TOKEN_CALLER_IS_NOT_OPERATOR_FOR_HOLDER",
    type: "error",
  },
  {
    inputs: [],
    name: "SUPER_TOKEN_INFLATIONARY_DEFLATIONARY_NOT_SUPPORTED",
    type: "error",
  },
  { inputs: [], name: "SUPER_TOKEN_MINT_TO_ZERO_ADDRESS", type: "error" },
  {
    inputs: [],
    name: "SUPER_TOKEN_NOT_ERC777_TOKENS_RECIPIENT",
    type: "error",
  },
  { inputs: [], name: "SUPER_TOKEN_NO_UNDERLYING_TOKEN", type: "error" },
  { inputs: [], name: "SUPER_TOKEN_ONLY_HOST", type: "error" },
  { inputs: [], name: "SUPER_TOKEN_ONLY_SELF", type: "error" },
  { inputs: [], name: "SUPER_TOKEN_TRANSFER_FROM_ZERO_ADDRESS", type: "error" },
  { inputs: [], name: "SUPER_TOKEN_TRANSFER_TO_ZERO_ADDRESS", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "agreementClass",
        type: "address",
      },
      { indexed: false, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "data",
        type: "bytes32[]",
      },
    ],
    name: "AgreementCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "agreementClass",
        type: "address",
      },
      { indexed: false, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "penaltyAccount",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "rewardAccount",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
    ],
    name: "AgreementLiquidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "liquidatorAccount",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "agreementClass",
        type: "address",
      },
      { indexed: false, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "penaltyAccount",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "bondAccount",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bailoutAmount",
        type: "uint256",
      },
    ],
    name: "AgreementLiquidatedBy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "agreementClass",
        type: "address",
      },
      { indexed: false, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "liquidatorAccount",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "targetAccount",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "rewardAmountReceiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "targetAccountBalanceDelta",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "liquidationTypeData",
        type: "bytes",
      },
    ],
    name: "AgreementLiquidatedV2",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "agreementClass",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "slotId",
        type: "uint256",
      },
    ],
    name: "AgreementStateUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "agreementClass",
        type: "address",
      },
      { indexed: false, internalType: "bytes32", name: "id", type: "bytes32" },
    ],
    name: "AgreementTerminated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "agreementClass",
        type: "address",
      },
      { indexed: false, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "data",
        type: "bytes32[]",
      },
    ],
    name: "AgreementUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenHolder",
        type: "address",
      },
    ],
    name: "AuthorizedOperator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "bailoutAccount",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bailoutAmount",
        type: "uint256",
      },
    ],
    name: "Bailout",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
      {
        indexed: false,
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "Burned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "uuid",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "codeAddress",
        type: "address",
      },
    ],
    name: "CodeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
      {
        indexed: false,
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "Minted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenHolder",
        type: "address",
      },
    ],
    name: "RevokedOperator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
      {
        indexed: false,
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "Sent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenDowngraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }],
    name: "authorizeOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "castrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "bytes32[]", name: "data", type: "bytes32[]" },
    ],
    name: "createAgreement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultOperators",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "downgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "downgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getAccountActiveAgreements",
    outputs: [
      {
        internalType: "contract ISuperAgreement[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "agreementClass", type: "address" },
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "uint256", name: "dataLength", type: "uint256" },
    ],
    name: "getAgreementData",
    outputs: [{ internalType: "bytes32[]", name: "data", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "agreementClass", type: "address" },
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "slotId", type: "uint256" },
      { internalType: "uint256", name: "dataLength", type: "uint256" },
    ],
    name: "getAgreementStateSlot",
    outputs: [
      { internalType: "bytes32[]", name: "slotData", type: "bytes32[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCodeAddress",
    outputs: [
      { internalType: "address", name: "codeAddress", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHost",
    outputs: [{ internalType: "address", name: "host", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUnderlyingToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "granularity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "underlyingToken",
        type: "address",
      },
      { internalType: "uint8", name: "underlyingDecimals", type: "uint8" },
      { internalType: "string", name: "n", type: "string" },
      { internalType: "string", name: "s", type: "string" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "isAccountCritical",
    outputs: [{ internalType: "bool", name: "isCritical", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isAccountCriticalNow",
    outputs: [{ internalType: "bool", name: "isCritical", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "isAccountSolvent",
    outputs: [{ internalType: "bool", name: "isSolvent", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isAccountSolventNow",
    outputs: [{ internalType: "bool", name: "isSolvent", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "address", name: "tokenHolder", type: "address" },
    ],
    name: "isOperatorFor",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "bytes", name: "liquidationTypeData", type: "bytes" },
      { internalType: "address", name: "liquidatorAccount", type: "address" },
      { internalType: "bool", name: "useDefaultRewardAccount", type: "bool" },
      { internalType: "address", name: "targetAccount", type: "address" },
      { internalType: "uint256", name: "rewardAmount", type: "uint256" },
      {
        internalType: "int256",
        name: "targetAccountBalanceDelta",
        type: "int256",
      },
    ],
    name: "makeLiquidationPayoutsV2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "operationApprove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "operationDecreaseAllowance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "operationDowngrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "operationIncreaseAllowance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "userData", type: "bytes" },
    ],
    name: "operationSend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "operationTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "operationUpgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
      { internalType: "bytes", name: "operatorData", type: "bytes" },
    ],
    name: "operatorBurn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
      { internalType: "bytes", name: "operatorData", type: "bytes" },
    ],
    name: "operatorSend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "realtimeBalanceOf",
    outputs: [
      { internalType: "int256", name: "availableBalance", type: "int256" },
      { internalType: "uint256", name: "deposit", type: "uint256" },
      { internalType: "uint256", name: "owedDeposit", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "realtimeBalanceOfNow",
    outputs: [
      { internalType: "int256", name: "availableBalance", type: "int256" },
      { internalType: "uint256", name: "deposit", type: "uint256" },
      { internalType: "uint256", name: "owedDeposit", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }],
    name: "revokeOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "selfApproveFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "userData", type: "bytes" },
    ],
    name: "selfBurn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "userData", type: "bytes" },
    ],
    name: "selfMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "selfTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "send",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "int256", name: "delta", type: "int256" },
    ],
    name: "settleBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "uint256", name: "dataLength", type: "uint256" },
    ],
    name: "terminateAgreement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "recipient", type: "address" }],
    name: "transferAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "bytes32[]", name: "data", type: "bytes32[]" },
    ],
    name: "updateAgreementData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "slotId", type: "uint256" },
      { internalType: "bytes32[]", name: "slotData", type: "bytes32[]" },
    ],
    name: "updateAgreementStateSlot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newAddress", type: "address" }],
    name: "updateCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "upgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const campaignABI = [
  {
    inputs: [
      {
        internalType: "contract ISuperToken",
        name: "_tokenX",
        type: "address",
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "chargeFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenXAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawTokenX",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contractCampaingABI = [];

const contractLensAddress = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

module.exports = {
  contractLensABI,
  ERC721,
  superTokenABI,
  campaignABI,
  contractLensAddress,
  contractCampaingABI,
};
