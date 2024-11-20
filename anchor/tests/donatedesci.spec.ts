import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Donatedesci} from '../target/types/donatedesci'

describe('donatedesci', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Donatedesci as Program<Donatedesci>

  const donatedesciKeypair = Keypair.generate()

  it('Initialize Donatedesci', async () => {
    await program.methods
      .initialize()
      .accounts({
        donatedesci: donatedesciKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([donatedesciKeypair])
      .rpc()

    const currentCount = await program.account.donatedesci.fetch(donatedesciKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Donatedesci', async () => {
    await program.methods.increment().accounts({ donatedesci: donatedesciKeypair.publicKey }).rpc()

    const currentCount = await program.account.donatedesci.fetch(donatedesciKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Donatedesci Again', async () => {
    await program.methods.increment().accounts({ donatedesci: donatedesciKeypair.publicKey }).rpc()

    const currentCount = await program.account.donatedesci.fetch(donatedesciKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Donatedesci', async () => {
    await program.methods.decrement().accounts({ donatedesci: donatedesciKeypair.publicKey }).rpc()

    const currentCount = await program.account.donatedesci.fetch(donatedesciKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set donatedesci value', async () => {
    await program.methods.set(42).accounts({ donatedesci: donatedesciKeypair.publicKey }).rpc()

    const currentCount = await program.account.donatedesci.fetch(donatedesciKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the donatedesci account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        donatedesci: donatedesciKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.donatedesci.fetchNullable(donatedesciKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
