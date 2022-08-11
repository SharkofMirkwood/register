/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export type TradingRangeStruct = { min: BigNumberish; max: BigNumberish };

export type TradingRangeStructOutput = [BigNumber, BigNumber] & {
  min: BigNumber;
  max: BigNumber;
};

export type RevenueShareStruct = {
  rTokenDist: BigNumberish;
  rsrDist: BigNumberish;
};

export type RevenueShareStructOutput = [number, number] & {
  rTokenDist: number;
  rsrDist: number;
};

export type DeploymentParamsStruct = {
  freezeDuration: BigNumberish;
  tradingRange: TradingRangeStruct;
  dist: RevenueShareStruct;
  rewardPeriod: BigNumberish;
  rewardRatio: BigNumberish;
  unstakingDelay: BigNumberish;
  tradingDelay: BigNumberish;
  auctionLength: BigNumberish;
  backingBuffer: BigNumberish;
  maxTradeSlippage: BigNumberish;
  issuanceRate: BigNumberish;
};

export type DeploymentParamsStructOutput = [
  number,
  TradingRangeStructOutput,
  RevenueShareStructOutput,
  number,
  BigNumber,
  number,
  number,
  number,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  freezeDuration: number;
  tradingRange: TradingRangeStructOutput;
  dist: RevenueShareStructOutput;
  rewardPeriod: number;
  rewardRatio: BigNumber;
  unstakingDelay: number;
  tradingDelay: number;
  auctionLength: number;
  backingBuffer: BigNumber;
  maxTradeSlippage: BigNumber;
  issuanceRate: BigNumber;
};

export type ConfigurationParamsStruct = {
  name: string;
  symbol: string;
  manifestoURI: string;
  params: DeploymentParamsStruct;
};

export type ConfigurationParamsStructOutput = [
  string,
  string,
  string,
  DeploymentParamsStructOutput
] & {
  name: string;
  symbol: string;
  manifestoURI: string;
  params: DeploymentParamsStructOutput;
};

export type BackupInfoStruct = {
  backupUnit: BytesLike;
  diversityFactor: BigNumberish;
  backupCollateral: string[];
};

export type BackupInfoStructOutput = [string, BigNumber, string[]] & {
  backupUnit: string;
  diversityFactor: BigNumber;
  backupCollateral: string[];
};

export type SetupParamsStruct = {
  assets: string[];
  primaryBasket: string[];
  weights: BigNumberish[];
  backups: BackupInfoStruct[];
};

export type SetupParamsStructOutput = [
  string[],
  string[],
  BigNumber[],
  BackupInfoStructOutput[]
] & {
  assets: string[];
  primaryBasket: string[];
  weights: BigNumber[];
  backups: BackupInfoStructOutput[];
};

export type GovernanceParamsStruct = {
  votingDelay: BigNumberish;
  votingPeriod: BigNumberish;
  proposalThresholdAsMicroPercent: BigNumberish;
  quorumPercent: BigNumberish;
  minDelay: BigNumberish;
};

export type GovernanceParamsStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  votingDelay: BigNumber;
  votingPeriod: BigNumber;
  proposalThresholdAsMicroPercent: BigNumber;
  quorumPercent: BigNumber;
  minDelay: BigNumber;
};

export interface FacadeWriteInterface extends utils.Interface {
  functions: {
    "deployRToken((string,string,string,(uint32,(uint192,uint192),(uint16,uint16),uint32,uint192,uint32,uint32,uint32,uint192,uint192,uint192)),(address[],address[],uint192[],(bytes32,uint256,address[])[]))": FunctionFragment;
    "deployer()": FunctionFragment;
    "setupGovernance(address,bool,bool,(uint256,uint256,uint256,uint256,uint256),address,address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "deployRToken" | "deployer" | "setupGovernance"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "deployRToken",
    values: [ConfigurationParamsStruct, SetupParamsStruct]
  ): string;
  encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setupGovernance",
    values: [
      string,
      boolean,
      boolean,
      GovernanceParamsStruct,
      string,
      string,
      string
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "deployRToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setupGovernance",
    data: BytesLike
  ): Result;

  events: {
    "GovernanceCreated(address,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "GovernanceCreated"): EventFragment;
}

export interface GovernanceCreatedEventObject {
  rToken: string;
  governance: string;
  timelock: string;
}
export type GovernanceCreatedEvent = TypedEvent<
  [string, string, string],
  GovernanceCreatedEventObject
>;

export type GovernanceCreatedEventFilter =
  TypedEventFilter<GovernanceCreatedEvent>;

export interface FacadeWrite extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FacadeWriteInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    deployRToken(
      config: ConfigurationParamsStruct,
      setup: SetupParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deployer(overrides?: CallOverrides): Promise<[string]>;

    setupGovernance(
      rToken: string,
      deployGovernance: boolean,
      unfreeze: boolean,
      govParams: GovernanceParamsStruct,
      owner: string,
      guardian: string,
      pauser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  deployRToken(
    config: ConfigurationParamsStruct,
    setup: SetupParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deployer(overrides?: CallOverrides): Promise<string>;

  setupGovernance(
    rToken: string,
    deployGovernance: boolean,
    unfreeze: boolean,
    govParams: GovernanceParamsStruct,
    owner: string,
    guardian: string,
    pauser: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    deployRToken(
      config: ConfigurationParamsStruct,
      setup: SetupParamsStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    deployer(overrides?: CallOverrides): Promise<string>;

    setupGovernance(
      rToken: string,
      deployGovernance: boolean,
      unfreeze: boolean,
      govParams: GovernanceParamsStruct,
      owner: string,
      guardian: string,
      pauser: string,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "GovernanceCreated(address,address,address)"(
      rToken?: string | null,
      governance?: string | null,
      timelock?: string | null
    ): GovernanceCreatedEventFilter;
    GovernanceCreated(
      rToken?: string | null,
      governance?: string | null,
      timelock?: string | null
    ): GovernanceCreatedEventFilter;
  };

  estimateGas: {
    deployRToken(
      config: ConfigurationParamsStruct,
      setup: SetupParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deployer(overrides?: CallOverrides): Promise<BigNumber>;

    setupGovernance(
      rToken: string,
      deployGovernance: boolean,
      unfreeze: boolean,
      govParams: GovernanceParamsStruct,
      owner: string,
      guardian: string,
      pauser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    deployRToken(
      config: ConfigurationParamsStruct,
      setup: SetupParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setupGovernance(
      rToken: string,
      deployGovernance: boolean,
      unfreeze: boolean,
      govParams: GovernanceParamsStruct,
      owner: string,
      guardian: string,
      pauser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
