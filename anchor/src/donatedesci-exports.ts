// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DonatedesciIDL from '../target/idl/donatedesci.json'
import type { Donatedesci } from '../target/types/donatedesci'

// Re-export the generated IDL and type
export { Donatedesci, DonatedesciIDL }

// The programId is imported from the program IDL.
export const DONATEDESCI_PROGRAM_ID = new PublicKey(DonatedesciIDL.address)

// This is a helper function to get the Donatedesci Anchor program.
export function getDonatedesciProgram(provider: AnchorProvider) {
  return new Program(DonatedesciIDL as Donatedesci, provider)
}

// This is a helper function to get the program ID for the Donatedesci program depending on the cluster.
export function getDonatedesciProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Donatedesci program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return DONATEDESCI_PROGRAM_ID
  }
}
