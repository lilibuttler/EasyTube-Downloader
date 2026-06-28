# Contribuindo

## Padrão de Commits

Utilizamos o padrão Conventional Commits.

### Tipos

* feat
* fix
* refactor
* docs
* style
* chore

Exemplos:

```text
feat(us-008): adiciona botão abrir pasta

fix(download): corrige merge do ffmpeg

refactor(websocket): separa actions

docs: atualiza README
```

---

## Fluxo de Desenvolvimento

Toda alteração deve seguir a sequência:

1. Implementação
2. Testes
3. Atualização da documentação
4. Commit
5. Push

---

## Documentação

Sempre que necessário atualizar:

* README.md
* CHANGELOG.md
* ROADMAP.md
* ARCHITECTURE.md

---

## Convenções

* Backend em Node.js.
* Interface em HTML, CSS e JavaScript.
* Código-fonte em inglês.
* Interface em português.
* Uma responsabilidade por arquivo.
* Comunicação entre frontend e backend exclusivamente via WebSocket.

---

## Qualidade

Antes de realizar um commit:

* Validar funcionamento da funcionalidade.
* Garantir que não houve regressão.
* Revisar a documentação.
