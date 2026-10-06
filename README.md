# YourColony: Império dos Insetos

> **Visão Geral:** *YourColony* é um simulador de estratégia e evolução focado no ecossistema e organização social dos insetos. O jogador começa com um formigueiro primitivo, gere recursos biológicos e desbloqueia ramificações evolutivas para fundar colónias de outros insetos (abelhas, térmitas, vespas e besouros), construindo um super-império subterrâneo e aéreo.

---

## 1. Visão e Proposta de Valor

* **Género:** Simulação de Colónia / Estratégia em Tempo Real / Árvore Evolutiva.
* **Inspirações:** *Empires of the Undergrowth*, *SimAnt*, *Spore* (fase criatura/tribo) e *Oxygen Not Included*.
* **Conceito Diferenciador:** O jogador não gere pessoas, mas sim feromonas, castas biológicas e redes de comunicação naturais. O progresso não é tecnológico no sentido mecânico, mas sim **genético e adaptativo**.

---

## 2. Tipos de Colónias e Progressão de Espécies

O jogador começa com uma espécie base e, à medida que recolhe biomassa e DNA, expande o controlo sobre outras espécies com dinâmicas de jogo distintas:

```
[Formigas Subterrâneas] (Início)
       │
       ├───> [Térmitas] (Engenharia de fungos e celulose)
       │
       ├───> [Abelhas] (Voo, polinização e gestão vertical/arbórea)
       │
       └───> [Predadores Especializados] (Vespas carnívoras, Louva-a-deus mercenários)
```

### 2.1. Formigueiro (A Fundação)
* **Ambiente:** Subterrâneo profundo e solo superficial.
* **Castas:** Obreiras, Soldados, Escavadoras, Ama-secas e Rainha.
* **Foco:** Túneis modulares, transporte em fila guiado por feromonas, estocagem de sementes e controlo térmico de câmaras de ovos.

### 2.2. Colmeia de Abelhas (Expansão Aérea)
* **Ambiente:** Troncos de árvores, ramos altos e flores.
* **Castas:** Forrageiras aéreas, Construtoras de cera, Guardiãs e Zangões.
* **Foco:** Navegação tridimensional, rota de vento e clima, recolha de néctar/pólen e produção de mel.

### 2.3. Termiteiro (Mestres da Construção)
* **Ambiente:** Montes de terra e madeira morta.
* **Foco:** Climatização passiva (torres de ventilação complexas) e cultivo industrial de fungos a partir de madeira.

---

## 3. Mecânicas Principais (Core Loops)

### 3.1. Gestão por Trilhas de Feromonas
* Em vez de controlo individual direto por unidade, o jogador desenha **rotas de feromonas**:
  * *Feromona de Forrageamento:* Atrai obreiras para recolha de recursos.
  * *Feromona de Alarme/Ataque:* Mobiliza soldados para repelir invasores.
  * *Feromona de Construção/Escavação:* Define áreas prioritárias de escavação e selagem de túneis.

### 3.2. Ciclo de Recursos Biológicos
* **Biomassa / Proteína:** Essencial para alimentar a Rainha e botar novos ovos.
* **Açúcares / Carboidratos:** Néctar, melada de pulgões e seiva para manter a estamina da colónia ativa.
* **Materiais Estruturais:** Terra compactada, pedrinhas, resina vegetal e cera.
* **Humidade e Temperatura:** Parâmetros críticos para a eclosão saudável de ovos e crescimento de fungos benéficos.

### 3.3. Árvore de Evolução e Genética (Evo-Tree)
A evolução substitui as pesquisas tecnológicas clássicas:
* **Adaptações Físicas:** Mandíbulas mais resistentes, ferrões venenosos, asas reforçadas, carapaças blindadas de quitina.
* **Simbioses Naturais:**
  * Domesticação de **Pulgões** (pastoreio para recolha contínua de melada).
  * Simbiose com **Fungos** em câmaras dedicadas.
* **Comportamento Social:** Feromonas de longo alcance, castas gigantes (*Super-majors*), divisão de tarefas aprimorada.

---

## 4. Ameaças e Dinâmica do Mundo

* **Predadores Naturais:** Aranhas, aves, sapos, centopeias gigantes e lagartos.
* **Colónias Rivais:** Guerras territoriais contra outros formigueiros por fontes de alimento abundantes.
* **Clima e Intempéries:**
  * **Chuvas Torrenciais:** Risco de inundação de galerias subterrâneas (necessidade de drenagem e barreiras).
  * **Ondas de Calor:** Ressecamento de larvas.
  * **Inverno / Queda de Temperatura:** Necessidade de agrupar a colónia em torno da rainha e entrar em dormência controlada.

---

## 5. Arquitetura e Estrutura Técnica

| Componente | Opção Recomendada | Justificação |
| :--- | :--- | :--- |
| **Engine** | Godot 4 ou Unity | Excelente suporte para simulação de milhares de agentes 2D/3D isométricos |
| **Simulação de Multidões** | *Flow Fields* + Algoritmos de Feromonas | Permite gerir centenas ou milhares de insetos sem perda severa de framerate |
| **Terreno** | Sistema de grelha destrutível (*Tile-based* / Celular) | Essencial para escavação livre e dinâmica de túneis |
| **Visual** | Perspectiva isométrica ou corte lateral (*Ant-farm view*) | Facilita a visualização do interior das galerias e do mundo exterior |

---

## 6. Roadmap Inicial (Do Protótipo à Expansão)

### Fase 1: O Formigueiro Básico (MVP)
- [ ] Grelha subterrânea escavável com corte lateral (*Ant-farm*).
- [ ] Ciclo de vida da Rainha: botar ovos $\rightarrow$ larva $\rightarrow$ pupa $\rightarrow$ formiga obreira.
- [ ] Movimento baseado em feromonas básicas (ir buscar comida e regressar ao ninho).

### Fase 2: Defesa e Ecossistema
- [ ] Adição da casta dos Soldados e combate contra predadores (ex.: escaravelhos e aranhas).
- [ ] Sistema de pastoreio de pulgões para produção passiva de açúcar.
- [ ] Efeitos de água/humidade nas câmaras.

### Fase 3: A Árvore Evolutiva e Novas Espécies
- [ ] Desbloqueio da colmeia de Abelhas e mecânicas de voo à superfície.
- [ ] Mutações genéticas (veneno, carapaça, ferrão).
- [ ] Relação entre espécies (comércio ou guerra entre o formigueiro e a colmeia).
