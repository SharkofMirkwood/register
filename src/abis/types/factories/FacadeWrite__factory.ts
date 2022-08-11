/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { FacadeWrite, FacadeWriteInterface } from "../FacadeWrite";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IDeployer",
        name: "deployer_",
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
        internalType: "contract IRToken",
        name: "rToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "governance",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "timelock",
        type: "address",
      },
    ],
    name: "GovernanceCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "rToken",
        type: "address",
      },
    ],
    name: "RTokenDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "manifestoURI",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "oneshotFreezeDuration",
                type: "uint32",
              },
              {
                components: [
                  {
                    internalType: "uint192",
                    name: "min",
                    type: "uint192",
                  },
                  {
                    internalType: "uint192",
                    name: "max",
                    type: "uint192",
                  },
                ],
                internalType: "struct TradingRange",
                name: "tradingRange",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint16",
                    name: "rTokenDist",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "rsrDist",
                    type: "uint16",
                  },
                ],
                internalType: "struct RevenueShare",
                name: "dist",
                type: "tuple",
              },
              {
                internalType: "uint32",
                name: "rewardPeriod",
                type: "uint32",
              },
              {
                internalType: "uint192",
                name: "rewardRatio",
                type: "uint192",
              },
              {
                internalType: "uint32",
                name: "unstakingDelay",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "tradingDelay",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "auctionLength",
                type: "uint32",
              },
              {
                internalType: "uint192",
                name: "backingBuffer",
                type: "uint192",
              },
              {
                internalType: "uint192",
                name: "maxTradeSlippage",
                type: "uint192",
              },
              {
                internalType: "uint192",
                name: "issuanceRate",
                type: "uint192",
              },
            ],
            internalType: "struct DeploymentParams",
            name: "params",
            type: "tuple",
          },
        ],
        internalType: "struct ConfigurationParams",
        name: "config",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "contract IAsset[]",
            name: "assets",
            type: "address[]",
          },
          {
            internalType: "contract ICollateral[]",
            name: "primaryBasket",
            type: "address[]",
          },
          {
            internalType: "uint192[]",
            name: "weights",
            type: "uint192[]",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "backupUnit",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "diversityFactor",
                type: "uint256",
              },
              {
                internalType: "contract ICollateral[]",
                name: "backupCollateral",
                type: "address[]",
              },
            ],
            internalType: "struct BackupInfo[]",
            name: "backups",
            type: "tuple[]",
          },
        ],
        internalType: "struct SetupParams",
        name: "setup",
        type: "tuple",
      },
    ],
    name: "deployRToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deployer",
    outputs: [
      {
        internalType: "contract IDeployer",
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
        internalType: "contract IRToken",
        name: "rToken",
        type: "address",
      },
      {
        internalType: "bool",
        name: "deployGovernance",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "unfreeze",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "votingDelay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "votingPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "proposalThresholdAsMicroPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quorumPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minDelay",
            type: "uint256",
          },
        ],
        internalType: "struct GovernanceParams",
        name: "govParams",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "freezer",
        type: "address",
      },
      {
        internalType: "address",
        name: "pauser",
        type: "address",
      },
    ],
    name: "setupGovernance",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class FacadeWrite__factory {
  static readonly abi = _abi;
  static createInterface(): FacadeWriteInterface {
    return new utils.Interface(_abi) as FacadeWriteInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FacadeWrite {
    return new Contract(address, _abi, signerOrProvider) as FacadeWrite;
  }
}
