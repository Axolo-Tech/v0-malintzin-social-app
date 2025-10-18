use anchor_lang::prelude::*;

declare_id!("REPLACE_WITH_PROGRAM_ID"); // Reemplaza tras desplegar

#[program]
pub mod v0_malintzin {
    use super::*;

    pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
        let post = &mut ctx.accounts.post;
        let author = &ctx.accounts.author;
        post.author = *author.key;
        let content_max = 1024usize;
        require!(content.len() <= content_max, CustomError::ContentTooLarge);
        post.content = content;
        post.timestamp = Clock::get()?.unix_timestamp;
        post.likes = 0;
        Ok(())
    }

    pub fn update_post(ctx: Context<UpdatePost>, new_content: String) -> Result<()> {
        let post = &mut ctx.accounts.post;
        require!(post.author == *ctx.accounts.author.key, CustomError::Unauthorized);
        let content_max = 1024usize;
        require!(new_content.len() <= content_max, CustomError::ContentTooLarge);
        post.content = new_content;
        Ok(())
    }

    pub fn like_post(ctx: Context<LikePost>) -> Result<()> {
        let post = &mut ctx.accounts.post;
        post.likes = post.likes.checked_add(1).ok_or(CustomError::Overflow)?;
        Ok(())
    }
}

#[account]
pub struct Post {
    pub author: Pubkey,
    pub content: String,
    pub timestamp: i64,
    pub likes: u64,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(init, payer = author, space = 8 + 32 + 4 + 1024 + 8 + 8)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(mut)]
    pub post: Account<'info, Post>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct LikePost<'info> {
    #[account(mut)]
    pub post: Account<'info, Post>,
}

#[error_code]
pub enum CustomError {
    #[msg("Content exceeds maximum allowed length")]
    ContentTooLarge,
    #[msg("Unauthorized: only the author may update this post")]
    Unauthorized,
    #[msg("Math overflow")]
    Overflow,
}