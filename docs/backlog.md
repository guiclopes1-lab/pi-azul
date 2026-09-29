# Backlog do Projeto PI-Azul

## Funcionalidades Implementadas

### Alteração de Foto de Perfil (`src/telas/Perfil.jsx`)
- **Ref e Input de Arquivo:** Adicionado `useRef` (`fileInputRef`) e um `<input type="file" accept="image/*" style={{ display: "none" }} />` invisível. O botão `.btn-change-photo` dispara a abertura do seletor de arquivos via `fileInputRef.current.click()`.
- **Upload para Supabase Storage:** A função `handleAvatarUpload(event)` faz o upload da imagem selecionada para o bucket `'avatars'` no Supabase Storage (`supabase.storage.from('avatars').upload(...)`), obtém a URL pública permanente gerada com `getPublicUrl(fileName)` e atualiza a coluna `avatar_url` na tabela `'usuarios'` filtrando por `usuarioAtual.id`.
- **Atualização do Estado Local:** O estado `usuarioAtual` é atualizado imediatamente após o upload, refletindo a nova imagem na tela sem necessidade de recarregar a página (F5).
- **Fallback Estático:** A imagem aleatória `"https://picsum.photos/200"` foi substituída por uma imagem SVG de avatar estática (`DEFAULT_AVATAR`), garantindo estabilidade visual quando o usuário não possui avatar cadastrado.

### Edição de Perfil de Usuário (`src/telas/Perfil.jsx`)
- **Carregamento Seguro de Dados:** Ajustado o método `carregaDados()` para localizar o usuário na tabela `public.usuarios` priorizando a busca por e-mail (`.eq('email', authUser.email).maybeSingle()`) ou por ID numérico/compatível. Isso evita falhas de conversão entre o UUID do Auth e a chave primária `bigint` da tabela `usuarios`.
- **Persistência no Banco (`handleSalvarPerfil`):** A função de salvamento executa `.from('usuarios').update(payload).eq('id', usuarioAtual.id).select()`, enviando os campos `nome_usuario`, `email` e condicionalmente `senha`.
- **Logs de Erro e Tratamento de RLS:** Adicionados logs detalhados com `console.error` ao capturar falhas de API ou quando nenhuma linha for afetada (por exemplo, devido a políticas RLS ativas sem permissão de `UPDATE`).
- **Atualização de Interface:** Em caso de sucesso, o estado local `usuarioAtual` é atualizado com o objeto retornado do Supabase, fechando o modal e refletindo o novo nome e e-mail imediatamente na tela.
