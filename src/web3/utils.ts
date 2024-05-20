import {Contract, Web3} from 'web3';
import ERC20ELFABI from '../web3/eth/abi/ERC20-ELF.json';
import BigNumber from 'bignumber.js';

// import AElf from 'aelf-sdk';
const  AElf = require('aelf-sdk');

export const aelfNodeRpcUrl = {
  aelf: 'https://aelf-public-node.aelf.io',
  tdvv: 'https://tdvv-public-node.aelf.io'
}

export const tokenContractAddress = {
  aelf: 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF',
  tdvv: 'ELF_7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX_tDVV',
  eth: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e',
  bsc: '0xa3f020a5c92e15be13caf0ee5c95cf79585eecc9',
}

export const TOKEN_SYMBOL = 'ELF';
export const ORGANIZATION_ADDRESS_AELF = 'ELF_25CuX2FXDvhaj7etTpezDQDunk5xGhytxE68yTYJJfMkQwvj5p_AELF';

export const ELF_DECIMALS_EVM = 18;
export const defaultPrivateKey
  = '0000000000000000000000000000000000000000000000000000000000000001';

export const ETH_DESTROY_ADDRESSES = [
  '0x0000000000000000000000000000000000aedead',
  '0x3213b78de00CB85302aE5a5e05e80b24B39BD7Dd',
  '0xae3F5961937CB0171F127075A99550978b31ACA1',
  '0x384Cc0b3a514216627F7054B30ea4e7d5F54EEa9',
  '0xEA1bb5B01bFE95e0cff237C9b9126526CB12a768',
  '0xffe79ac093e5aafD35B5e118c58dbcEe06250749',
  '0xC7a6c4d547C1b1098Eb3C01F1dd3f25E1d4c4FE4',
  '0xd3199DB5B7d94596546276c4A63D3dF6b84854f7',
];
export const BSC_DESTROY_ADDRESSES = [
  '0x0000000000000000000000000000000000aedead',
  '0x3213b78de00CB85302aE5a5e05e80b24B39BD7Dd',
];
export async function getBalanceOfELFERC20(addresses: string[], tokenContract: Contract<any>) {
  const balancePromises = addresses.map(address => tokenContract.methods.balanceOf(address).call());
  return Promise.all(balancePromises);
}

const Wallet = AElf.wallet;
export const commonWalletOnAelf = Wallet.getWalletByPrivateKey(defaultPrivateKey);

export const web3 = new Web3('https://eth.llamarpc.com');
export const elfTokenContractETH: Contract<any> = new web3.eth.Contract(ERC20ELFABI, tokenContractAddress.eth);

export const web3BSC = new Web3('https://bsc-dataseed3.ninicoin.io/');
export const elfTokenContractBSC: Contract<any> = new web3BSC.eth.Contract(ERC20ELFABI, tokenContractAddress.bsc);

const contracts = {};
export async function getContracts(): Promise<any> {
  Object.keys(aelfNodeRpcUrl).map(key => {
    if (!contracts[key]) {
      const aelf = new AElf(new AElf.providers.HttpProvider(aelfNodeRpcUrl[key])); // 主网
      const contractAddress = tokenContractAddress[key];
      const contract = aelf.chain.contractAt(contractAddress, commonWalletOnAelf, { sync: true });
      contracts[key] = contract;
    }
  });
  return contracts;
}
export function getTotalBalance(balanceList: any[], decimals: number = 18) {
  return balanceList.reduce((prev, curr) => {
    const current = new BigNumber(curr).div(10 ** decimals);
    return new BigNumber(prev).plus(current)
  }, new BigNumber(0));
}

export function getBalanceString(balance: string, decimals: number) {
  return new BigNumber(balance).div(10 ** decimals).toString();
}
