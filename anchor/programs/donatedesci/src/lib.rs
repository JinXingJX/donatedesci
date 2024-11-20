#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod donatedesci {
    use super::*;

  pub fn close(_ctx: Context<CloseDonatedesci>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.donatedesci.count = ctx.accounts.donatedesci.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.donatedesci.count = ctx.accounts.donatedesci.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDonatedesci>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.donatedesci.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDonatedesci<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Donatedesci::INIT_SPACE,
  payer = payer
  )]
  pub donatedesci: Account<'info, Donatedesci>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDonatedesci<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub donatedesci: Account<'info, Donatedesci>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub donatedesci: Account<'info, Donatedesci>,
}

#[account]
#[derive(InitSpace)]
pub struct Donatedesci {
  count: u8,
}
