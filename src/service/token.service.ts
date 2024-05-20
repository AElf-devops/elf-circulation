import { Provide } from '@midwayjs/core';
import BigNumber from 'bignumber.js';
import {
  BSC_DESTROY_ADDRESSES,
  ELF_DECIMALS_EVM,
  ETH_DESTROY_ADDRESSES,
  getBalanceOfELFERC20,
  getBalanceString,
  getTotalBalance,
  elfTokenContractETH, TOKEN_SYMBOL,
  elfTokenContractBSC, getContracts, ORGANIZATION_ADDRESS_AELF
} from '../web3/utils';
import {ITokenInfo} from '../interface/token.interface';

@Provide()
export class TokenService {
  async getTokenInfo(symbol?: string, cal = ''): Promise<any> {
    const decimalsOnAelf = 8;
    const contracts = await getContracts();

    const timeTag = new Date().getTime();
    console.log('token info request start');
    const tokenInfos: any = await Promise.all([
      contracts.aelf.GetTokenInfo.call({symbol: TOKEN_SYMBOL}),
      contracts.tdvv.GetTokenInfo.call({symbol: TOKEN_SYMBOL}),
      contracts.aelf.GetBalance.call({
        symbol: TOKEN_SYMBOL,
        owner: ORGANIZATION_ADDRESS_AELF
      }),
      elfTokenContractETH.methods.totalSupply().call(),
      getBalanceOfELFERC20(ETH_DESTROY_ADDRESSES, elfTokenContractETH),
      getBalanceOfELFERC20(BSC_DESTROY_ADDRESSES, elfTokenContractBSC)
    ]);
    console.log('token info request end', new Date().getTime() - timeTag);

    const [tokenInfoAelf, tokenInfoTdvv, organizationBalanceAll, supplyETH, destroyETH, destroyBSC] = tokenInfos;

    const organizationBalanceBridge = new BigNumber(1750000);
    const organizationBalanceNotConvert = new BigNumber(137791835.04967)
      .minus(organizationBalanceBridge).plus('0.04812903'); //.plus(0.048129027859138629);

    const destroyETHTotal = getTotalBalance(destroyETH, ELF_DECIMALS_EVM);
    const destroyBSCTotal = getTotalBalance(destroyBSC, ELF_DECIMALS_EVM);
    console.log('supplyETH: ', supplyETH);
    console.log('destroyETH: ', destroyETH, destroyETHTotal);
    console.log('destroyBSC: ', destroyBSC, destroyBSCTotal);
    const balanceOrganizationFoundation
      = new BigNumber(organizationBalanceAll.balance).div(10 ** decimalsOnAelf).minus(organizationBalanceNotConvert);

    const supplyOnAelfWithDecimal = new BigNumber(tokenInfoAelf.supply).plus(tokenInfoTdvv.supply).div(10 ** decimalsOnAelf);
    const supplyOnEthWithDecimal = new BigNumber(supplyETH).div(10 ** ELF_DECIMALS_EVM);
    const destroyEVMTotal = new BigNumber(destroyETHTotal).plus(destroyBSCTotal);
    const calculateElfCirculatingSupply
      = supplyOnAelfWithDecimal.plus(supplyOnEthWithDecimal)
      .minus(organizationBalanceNotConvert).minus(organizationBalanceBridge)
      .minus(destroyEVMTotal);

    const output: ITokenInfo = {
      supply: {
        aelf: {
          aelf: getBalanceString(tokenInfoAelf.supply, decimalsOnAelf),
          tdvv: getBalanceString(tokenInfoTdvv.supply, decimalsOnAelf),
          all: supplyOnAelfWithDecimal.toString(),
        },
        eth: {
          eth: supplyOnEthWithDecimal.toString(),
          destroy: destroyETHTotal,
        },
        bsc: {
          destroy: destroyBSCTotal,
        }
      },
      organization: {
        aelf: {
          all: getBalanceString(organizationBalanceAll.balance, decimalsOnAelf),
          foundation: balanceOrganizationFoundation.toString(),
          notConvert: organizationBalanceNotConvert.toString(),
          toBridgeDapp: organizationBalanceBridge.toString(),
        }
      }
    };

    if (cal) {
      output.calculate = {
        supply: calculateElfCirculatingSupply.toString(),
        difference: calculateElfCirculatingSupply.minus(supplyOnAelfWithDecimal).toString(),
      }
    }

    return output;
  }
}
