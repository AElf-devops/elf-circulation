export interface ITokenInfo {
  supply: ISupply
  destroy: IDestroy
  organizationBalance: IOrganizationBalance
}

export type ChainType = 'aelf' | 'tvv' | 'eth' | 'bsc';
type ChainTypeAsKeyInterface = {
  [key in ChainType]?: string
};
export interface ISupply extends ChainTypeAsKeyInterface{}

export interface IDestroy extends ChainTypeAsKeyInterface{}

export type OrganizationBalanceType = 'all' | 'notConvert' | 'foundation';

type OrganizationBalanceInterface = {
  [key in ChainType]?: {
    [key in OrganizationBalanceType]?: string
  }
}
export interface IOrganizationBalance extends OrganizationBalanceInterface{}
