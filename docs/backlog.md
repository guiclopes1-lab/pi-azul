# Backlog do Projeto PI-Azul

## Funcionalidades Implementadas

### Alteração de Foto de Perfil (`src/telas/Perfil.jsx`)
- **Ref e Input de Arquivo:** Adicionado `useRef` (`fileInputRef`) e um `<input type="file" accept="image/*" style={{ display: "none" }} />` invisível. O botão `.btn-change-photo` dispara a abertura do seletor de arquivos via `fileInputRef.current.click()`.
- **Upload para Supabase Storage:** A função `handleAvatarUpload(event)` faz o upload da imagem selecionada para o bucket `'avatars'` no Supabase Storage (`supabase.storage.from('avatars').upload(...)`), obtém a URL pública permanente gerada com `getPublicUrl(fileName)` e atualiza a coluna `avatar_url` na tabela `'usuarios'` filtrando por `usuarioAtual.id`.
- **Atualização do Estado Local:** O estado `usuarioAtual` é atualizado imediatamente após o upload, refletindo a nova imagem na tela sem necessidade de recarregar a página (F5).
- **Fallback Estático:** A imagem aleatória `"https://picsum.photos/200"` foi substituída por uma imagem SVG de avatar estática (`DEFAULT_AVATAR`), garantindo estabilidade visual quando o usuário não possui avatar cadastrado.
