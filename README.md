# v0-malintzin — Anchor program (ejemplo mínimo)

Contenido:
- Anchor.toml
- Cargo.toml (workspace)
- programs/v0-malintzin/Cargo.toml
- programs/v0-malintzin/src/lib.rs

Descripción
Este programa Anchor permite crear posts, editarlos (solo autor) y dar "like". Es un ejemplo mínimo pensado para desplegar en Devnet.

Cómo desplegar (resumen)
1. Instala Rust, Solana CLI y Anchor en tu máquina (o usa Codespace/Gitpod).
2. Configura Solana para Devnet:
   solana config set --url https://api.devnet.solana.com
3. Airdrop a tu wallet:
   solana airdrop 2 <TU_PUBKEY> --url https://api.devnet.solana.com
4. En el proyecto, compila:
   anchor build
5. Despliega:
   anchor deploy
   - anchor deploy devolverá el Program ID y creará el keypair del programa.
6. Actualiza `programs/v0-malintzin/src/lib.rs` cambiando `REPLACE_WITH_PROGRAM_ID` por el Program ID resultante (o actualiza Anchor.toml).
7. Vuelve a `anchor build` si modificas declare_id.

Ejemplo rápido con Anchor JS
```js
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.V0Malintzin;

const postKeypair = anchor.web3.Keypair.generate();

await program.rpc.createPost("Hola desde Devnet!", {
  accounts: {
    post: postKeypair.publicKey,
    author: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  },
  signers: [postKeypair],
  instructions: [
    await program.account.post.createInstruction(postKeypair),
  ],
});

await program.rpc.likePost({
  accounts: { post: postKeypair.publicKey },
});

await program.rpc.updatePost("Contenido nuevo", {
  accounts: { post: postKeypair.publicKey, author: provider.wallet.publicKey },
});
```

Notas
- Ajusta el espacio de la cuenta Post si necesitas más contenido.
- En producción: validaciones, manejo de lamports/close accounts y límites más precisos.
