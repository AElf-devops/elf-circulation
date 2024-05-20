export interface ITokenInfo {
  calculate?: {
    [key: string]: string
  }
  supply: ISupply
  // destroy: IDestroy
  organization: IOrganizationBalance
}

export type ChainType = 'aelf' | 'tvv' | 'eth' | 'bsc';
type ChainTypeAsKeyInterface = {
  [key in ChainType]?: {
    [key: string]: string | number
  }
};
export interface ISupply extends ChainTypeAsKeyInterface{}

// export interface IDestroy extends ChainTypeAsKeyInterface{}

export type OrganizationBalanceType = 'all' | 'notConvert' | 'foundation' | 'toBridgeDapp';

type OrganizationBalanceInterface = {
  [key in ChainType]?: {
    [key in OrganizationBalanceType]?: string
  }
}
export interface IOrganizationBalance extends OrganizationBalanceInterface{}
