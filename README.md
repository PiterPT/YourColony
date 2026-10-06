# YourColony

> **Visão Geral:** O *YourColony* é um projeto de simulação e gestão de colónias focado na sobrevivência, expansão estratégica, automação e bem-estar dos colonos num ambiente hostil e dinâmico.

---

## 1. Visão e Proposta de Valor

- **Género:** Simulação / Estratégia de Gestão (*Colony Sim*).
- **Público-Alvo:** Fãs de jogos como *RimWorld*, *Frostpunk*, *Surviving Mars* e *Oxygen Not Included*.
- **Conceito Principal:** O jogador assume a liderança de um grupo de pioneiros num território inexplorado (planeta distante, ambiente pós-apocalíptico ou subterrâneo), tendo de balancear extração de recursos, necessidades humanas e ameaças externas.

---

## 2. Mecânicas Principais (Core Loops)

### 2.1. Ciclo de Sobrevivência e Necessidades
- **Recursos Vitais:** Oxigénio, água potável, comida, calor/energia.
- **Saúde e Moral dos Colonos:**
  - Sistema de humor com impactos diretos na produtividade (motivação vs. esgotamento/revolta).
  - Traços de personalidade únicos, habilidades (construção, medicina, ciência, agricultura) e compatibilidades interpessoais.

### 2.2. Construção e Infraestrutura
- **Planeamento de Base:** Construção modular de estruturas (dormitórios, estufas, laboratórios, estações de energia).
- **Redes de Utilidade:** Linhas elétricas, canalizações de líquidos/gases e isolamento térmico.
- **Automação Logística:** Linhas de transporte, armazéns inteligentes e drones auxiliares.

### 2.3. Investigação e Desenvolvimento (Tech Tree)
- **Árvore Tecnológica:**
  - *Sobrevivência Básica:* Purificação de água, estufas hidropónicas.
  - *Industrialização:* Mineração pesada, energias renováveis e reatores nucleares.
  - *Sociedade Avançada:* Clonagem, terraformação, exploração orbital.

### 2.4. Eventos e Ameaças
- **Desafios Climáticos:** Tempestades de poeira/gelo, secas severas, picos de radiação.
- **Ameaças Biológicas/Invasões:** Fauna nativa agressiva, piratas, falhas de contenção biológica.
- **Dilemas Éticos e Narrativos:** Encontros com refugiados, epidemias com quarentenas difíceis e decisões de racionamento.

---

## 3. Arquitetura e Stack Tecnológica Sugerida

| Componente | Opção Recomendada | Alternativa |
| :--- | :--- | :--- |
| **Engine** | Godot 4 (C# ou GDScript) / Unity | Unreal Engine 5 |
| **Padrão Arquitetural** | ECS (Entity Component System) | Component-Based Clássico |
| **Geração de Terreno** | Procedural (Perlin/Simplex Noise) | Mapas pré-construídos por blocos |
| **Persistência de Dados** | SQLite / JSON serializado para Saves | Protocol Buffers |
| **UI/UX** | Interface minimalista orientada a dashboards | Menus radiais contextuais |

---

## 4. Fases de Desenvolvimento (Roadmap)

### Fase 1: Protótipo Mínimo Viável (MVP)
- [ ] Geração de grelha/mapa 2D ou 3D isométrico.
- [ ] Implementação de 2 colonos com pathfinding (A*) e ciclo de trabalho.
- [ ] Cadeia de sobrevivência básica: recolher madeira/minério $\rightarrow$ construir abrigo $\rightarrow$ alimentar-se.

### Fase 2: Simulação de Sistemas
- [ ] Redes de energia e distribuição de oxigénio/água.
- [ ] Sistema de inventário e armazenamento.
- [ ] Painel de estatísticas vitais e moral dos colonos.

### Fase 3: Conteúdo e Eventos
- [ ] Árvore tecnológica funcional.
- [ ] Sistema de eventos aleatórios (desastres e visitas).
- [ ] Melhorias no ciclo de áudio e efeitos visuais.

### Fase 4: Polimento e Lançamento
- [ ] Balanceamento económico e de recursos.
- [ ] Sistema robusto de gravação/carregamento (*Save/Load*).
- [ ] Suporte a Mods e traduções comunitárias.

---

## 5. Próximos Passos Imediatos
1. Definir o estilo visual (Pixel art, 2D vetorial, 3D Low-Poly ou estilizado).
2. Escolher a engine de desenvolvimento principal.
3. Criar o primeiro protótipo de navegação dos colonos.
