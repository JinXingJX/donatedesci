'use client'

import {getDonatedesciProgram, getDonatedesciProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useDonatedesciProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getDonatedesciProgramId(cluster.network as Cluster), [cluster])
  const program = getDonatedesciProgram(provider)

  const accounts = useQuery({
    queryKey: ['donatedesci', 'all', { cluster }],
    queryFn: () => program.account.donatedesci.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['donatedesci', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ donatedesci: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useDonatedesciProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useDonatedesciProgram()

  const accountQuery = useQuery({
    queryKey: ['donatedesci', 'fetch', { cluster, account }],
    queryFn: () => program.account.donatedesci.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['donatedesci', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ donatedesci: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['donatedesci', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ donatedesci: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['donatedesci', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ donatedesci: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['donatedesci', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ donatedesci: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
