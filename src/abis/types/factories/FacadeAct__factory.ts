/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { FacadeAct, FacadeActInterface } from "../FacadeAct";

const _abi = [
  {
    inputs: [],
    name: "UIntOutOfBounds",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract RTokenP1",
        name: "rToken",
        type: "address",
      },
    ],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract RTokenP1",
        name: "rToken",
        type: "address",
      },
    ],
    name: "getActCalldata",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class FacadeAct__factory {
  static readonly abi = _abi;
  static createInterface(): FacadeActInterface {
    return new utils.Interface(_abi) as FacadeActInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FacadeAct {
    return new Contract(address, _abi, signerOrProvider) as FacadeAct;
  }
}