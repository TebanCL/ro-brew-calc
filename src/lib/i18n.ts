export type Lang = "en" | "es" | "pt";

export const LANG_LOCALES: Record<Lang, string> = { en: "en-US", es: "es-CL", pt: "pt-BR" };

export const ITEM_NAMES: Record<string, { es: string; pt: string }> = {
  // Materials (NPC & ingredients)
  "Red Herb":                   { es: "Hierba Roja",                     pt: "Erva Vermelha" },
  "Yellow Herb":                { es: "Hierba Amarilla",                  pt: "Erva Amarela" },
  "White Herb":                 { es: "Hierba Blanca",                    pt: "Erva Branca" },
  "Blue Herb":                  { es: "Hierba Azul",                      pt: "Erva Azul" },
  "Green Herb":                 { es: "Hierba Verde",                     pt: "Erva Verde" },
  "Empty Potion Bottle":        { es: "Botella para pociones vacía",      pt: "Garrafa de Poção" },
  "Empty Test Tube":            { es: "Tubo de ensayo vacío",             pt: "Tubo de Ensaio" },
  "Empty Bottle":               { es: "Botella vacía",                    pt: "Garrafa Vazia" },
  "Medicine Bowl":              { es: "Cuenco para medicina",             pt: "Vasilha de Mistura" },
  "Scell":                      { es: "Scell",                            pt: "Scell" },
  "Glass Tube":                 { es: "Tubo de vidrio",                   pt: "Cápsula da Criação" },
  "Morning Dew of Yggdrasil":   { es: "Rocío matutino de Yggdrasil",     pt: "Orvalho da Yggdrasil" },
  "Seed of Life":               { es: "Semilla de vida",                  pt: "Semente da Vida" },
  "Red Potion":                 { es: "Poción Roja",                      pt: "Poção Vermelha" },
  "Yellow Potion":              { es: "Poción Amarilla",                  pt: "Poção Amarela" },
  "White Potion":               { es: "Poción Blanca",                    pt: "Poção Branca" },
  "Concentration Potion":       { es: "Poción de Concentración",          pt: "Poção da Concentração" },
  "Awakening Potion":           { es: "Poción para Despertar",            pt: "Poção do Despertar" },
  "Spicy Sauce":                { es: "Salsa picante",                    pt: "Molho Picante" },
  "Sweet Sauce":                { es: "Salsa dulce",                      pt: "Molho Doce" },
  "Holy Water":                 { es: "Agua Bendita",                     pt: "Água Benta" },
  "Monster Feed":               { es: "Comida para monstruos",            pt: "Ração para Monstros" },
  "Panacea":                    { es: "Panacea",                          pt: "Panaceia" },
  "Yellow Syrup":               { es: "Jarabe amarillo",                  pt: "Xarope Amarelo" },
  "White Syrup":                { es: "Jarabe blanco",                    pt: "Xarope Branco" },
  "Stem":                       { es: "Tallo",                            pt: "Caule" },
  "Poison Spore":               { es: "Espora venenosa",                  pt: "Esporo Venenoso" },
  "Fabric":                     { es: "Tela",                             pt: "Tecido" },
  "Immortal Heart":             { es: "Corazón inmortal",                 pt: "Coração Imortal" },
  "Maneater Blossom":           { es: "Flor carnívora",                   pt: "Flor de Planta Carnívora" },
  "Tendon":                     { es: "Tendón",                           pt: "Tendões" },
  "Detonator":                  { es: "Detonador",                        pt: "Neurônio" },
  "Cactus Needle":              { es: "Espina de Cactus",                 pt: "Espinho de Cacto" },
  "Witch Starsand":             { es: "Arena Estelar de Bruja",           pt: "Areia Estelar de Bruxa" },
  "Ment":                       { es: "Menta",                            pt: "Menta" },
  "Honey":                      { es: "Miel",                             pt: "Mel" },
  "Zenorc Fang":                { es: "Colmillo de Zenorc",               pt: "Presa de Zenorc" },
  "Mole Whiskers":              { es: "Bigotes de topo",                  pt: "Bigodes de Toupeira" },
  "Prickly Fruit":              { es: "Fruta del cactus",                 pt: "Fruta Espinhosa" },
  "Maneater Root":              { es: "Raíz carnívora",                   pt: "Raiz de Planta Carnívora" },
  "Mushroom Spore":             { es: "Espora de hongo",                  pt: "Esporo de Cogumelo" },
  "Gun Powder":                 { es: "Pólvora",                          pt: "Mistura de Pólvora" },
  "Alcohol":                    { es: "Alcohol",                          pt: "Álcool" },
  "Grape":                      { es: "Uva",                              pt: "Uvas" },
  "Mastela Fruit":              { es: "Fruta de Mastela",                 pt: "Mastela" },
  "Yggdrasil Leaf":             { es: "Hoja de Yggdrasil",               pt: "Folha de Yggdrasil" },
  "Lemon":                      { es: "Limón",                            pt: "Limão" },
  "Royal Jelly":                { es: "Jalea real",                       pt: "Geleia Real" },
  "Red Syrup":                  { es: "Jarabe rojo",                      pt: "Xarope Vermelho" },
  "Blue Syrup":                 { es: "Jarabe azul",                      pt: "Xarope Azul" },
  "Yggdrasil Seed":             { es: "Semilla de Yggdrasil",             pt: "Semente de Yggdrasil" },
  "Yggdrasil Berry":            { es: "Baya de Yggdrasil",               pt: "Fruto de Yggdrasil" },
  "Gold":                       { es: "Oro",                              pt: "Ouro" },
  // Recipe outputs
  "Blue Potion":                { es: "Poción Azul",                      pt: "Poção Azul" },
  "Bottle Grenade":             { es: "Botella de granada",               pt: "Frasco de Fogo Grego" },
  "Acid Bottle":                { es: "Botella de Ácido",                 pt: "Frasco de Ácido" },
  "Plant Bottle":               { es: "Botella de planta",                pt: "Frasco de Planta" },
  "Marine Sphere Bottle":       { es: "Botella de Esfera marina",         pt: "Frasco de Esfera Marinha" },
  "Condensed Yellow Potion":    { es: "Poción amarilla condensada",       pt: "Poção Amarela Compacta" },
  "Condensed White Potion":     { es: "Poción blanca condensada",         pt: "Poção Branca Compacta" },
  "Anodyne":                    { es: "Analgésico",                       pt: "Analgésico" },
  "Aloevera":                   { es: "Aloe Vera",                        pt: "Aloe Vera" },
  "Glistening Coat":            { es: "Capa reluciente",                  pt: "Frasco de Revestimento" },
  "Red Slim Potion":            { es: "Poción roja condensada",           pt: "Poção Vermelha Compacta" },
  "Yellow Slim Potion":         { es: "Poción amarilla condensada",       pt: "Poção Amarela Compacta" },
  "White Slim Potion":          { es: "Poción blanca condensada",         pt: "Poção Branca Compacta" },
  "Embryo":                     { es: "Embrión",                          pt: "Embrião" },
  "Thorn Plant Seed":           { es: "Semilla de planta espinosa",       pt: "Semente de Planta Selvagem" },
  "Blood Sucker Seed":          { es: "Semilla de planta chupasangre",    pt: "Semente de Planta Sanguessuga" },
  "Bomb Mushroom Spore":        { es: "Espora de seta bomba",             pt: "Esporo de Cogumelo Explosivo" },
  "Enriched White PotionZ":     { es: "Poción blanca enriquecida",        pt: "Poção Branca Especial" },
  "Vitata500":                  { es: "Vitata 500",                       pt: "Poção Vitata 500" },
  "Enrich Celermine Juice":     { es: "Zumo enriquecido de celermina",    pt: "Suco Celular Enriquecido" },
  "Cure Free":                  { es: "Curación",                         pt: "Poção de Recuperação" },
  "HP Increase Potion (S)":     { es: "Poción de aumento de HP (S)",      pt: "Poção Pequena de HP" },
  "HP Increase Potion (M)":     { es: "Poción de aumento de HP (M)",      pt: "Poção Média de HP" },
  "HP Increase Potion (L)":     { es: "Poción de aumento de HP (L)",      pt: "Poção Grande de HP" },
  "SP Increase Potion (S)":     { es: "Poción de aumento de SP (S)",      pt: "Poção Pequena de SP" },
  "SP Increase Potion (M)":     { es: "Poción de aumento de SP (M)",      pt: "Poção Média de SP" },
  "SP Increase Potion (L)":     { es: "Poción de aumento de SP (L)",      pt: "Poção Grande de SP" },
  "Concentrated Red Syrup":     { es: "Poción de Jarabe Rojo",            pt: "Elixir Vermelho" },
  "Concentrated Blue Syrup":    { es: "Poción de Jarabe Azul",            pt: "Elixir Azul" },
  "Concentrated Golden Syrup":  { es: "Poción de Jarabe Dorado",          pt: "Elixir Dourado" },
  "Red Herb Activator":         { es: "Activador de Hierba Roja",         pt: "Energético Físico" },
  "Blue Herb Activator":        { es: "Activador de Hierbas Azules",      pt: "Energético Mágico" },
  "Golden X Potion":            { es: "Poción X",                         pt: "Poção X" },
};

export interface UiStrings {
  subtitle: string;
  tabs: [string, string, string];
  levels: string;
  skills: string;
  stats: string;
  pcBaseRate: string;
  spCreationAvg: string;
  spSpecificVal: string;
  spMax: string;
  discount: string;
  materialPrices: string;
  priceSubtitle: (rate: number) => string;
  resetPrices: string;
  pcTitle: string;
  pcSubtitle: string;
  spTitle: string;
  spSubtitle: string;
  colPotion: string;
  colCost: string;
  colRate: string;
  colSell: string;
  colProfit: string;
  colQty: string;
  colCpu: string;
  colSellU: string;
  detail: string;
  itemRate: string;
  difficulty: string;
  totalCost: string;
  sellPerUnit: string;
  pessimistic: string;
  expected: string;
  optimistic: string;
  creationValue: string;
  qtyProduced: string;
  batchProfit: string;
  successRate: string;
  costPerSuccess: string;
  netProfit: string;
  potionRate: string;
  footer: string;
  formulaTitle: string;
  formulaWithStats: string;
  formulaSource: string;
  formulaClamp: string;
  formulaQtyTable: string;
}

export const UI: Record<Lang, UiStrings> = {
  en: {
    subtitle: "Server: Ragnarok Latinoamérica",
    tabs: ["Prices", "Potion Creation", "Special Pharmacy"],
    levels: "Levels",
    skills: "Skills",
    stats: "Stats (Base + Bonus)",
    pcBaseRate: "PC Base Rate",
    spCreationAvg: "SP Creation(avg)",
    spSpecificVal: "SP Specific Val",
    spMax: "SP Max",
    discount: "Discount",
    materialPrices: "Material Prices",
    priceSubtitle: (r) => `NPC items with Discount ${r}%. Override if buying from market.`,
    resetPrices: "Reset to NPC Prices with Discount",
    pcTitle: "Potion Creation (Pharmacy)",
    pcSubtitle: "1 craft = 1 unit. Cost/success accounts for failures.",
    spTitle: "Special Pharmacy (Geneticist)",
    spSubtitle: "1 craft consumes 1 set → produces multiple units.",
    colPotion: "Potion",
    colCost: "Cost",
    colRate: "Rate%",
    colSell: "Sell",
    colProfit: "Profit",
    colQty: "Qty",
    colCpu: "$/u",
    colSellU: "Sell/u",
    detail: "Detail",
    itemRate: "Item Rate",
    difficulty: "Difficulty",
    totalCost: "Total cost",
    sellPerUnit: "Sell price/u:",
    pessimistic: "Pessimistic",
    expected: "Expected",
    optimistic: "Optimistic",
    creationValue: "Creation Value",
    qtyProduced: "Quantity produced",
    batchProfit: "Batch profit",
    successRate: "Success Rate %",
    costPerSuccess: "Cost per success",
    netProfit: "Net profit",
    potionRate: "Potion Rate",
    footer: "RO Potion Calculator — Formulas: iRO Wiki. Item Rates: browiki.org. Values may vary by server.",
    formulaTitle: "Formula",
    formulaWithStats: "With your stats:",
    formulaSource: "Source: iRO Wiki / browiki.org",
    formulaClamp: "Clamped to [0%, 100%]",
    formulaQtyTable: "Quantity by Creation − Difficulty delta:",
  },
  es: {
    subtitle: "Servidor: Ragnarok Latinoamérica",
    tabs: ["Precios", "Potion Creation", "Special Pharmacy"],
    levels: "Niveles",
    skills: "Habilidades",
    stats: "Stats (Base + Bono)",
    pcBaseRate: "Tasa base PC",
    spCreationAvg: "Creación SP(prom)",
    spSpecificVal: "Val. Específico SP",
    spMax: "SP Max",
    discount: "Descuento",
    materialPrices: "Precios de Materiales",
    priceSubtitle: (r) => `Items NPC con Descuento ${r}%. Modifica si compras en mercado.`,
    resetPrices: "Resetear a precios NPC con Descuento",
    pcTitle: "Potion Creation (Pharmacy)",
    pcSubtitle: "1 craft = 1 unidad. Costo/éxito considera fallos.",
    spTitle: "Special Pharmacy (Geneticist)",
    spSubtitle: "1 craft consume 1 set → produce múltiples unidades.",
    colPotion: "Poción",
    colCost: "Costo",
    colRate: "Tasa%",
    colSell: "Venta",
    colProfit: "Ganancia",
    colQty: "Cant",
    colCpu: "$/u",
    colSellU: "Venta/u",
    detail: "Detalle",
    itemRate: "Item Rate",
    difficulty: "Dificultad",
    totalCost: "Costo total",
    sellPerUnit: "Precio venta/u:",
    pessimistic: "Pesimista",
    expected: "Esperado",
    optimistic: "Optimista",
    creationValue: "Valor de Creación",
    qtyProduced: "Cantidad producida",
    batchProfit: "Ganancia por lote",
    successRate: "Tasa de éxito %",
    costPerSuccess: "Costo por éxito",
    netProfit: "Ganancia neta",
    potionRate: "Potion Rate",
    footer: "RO Potion Calculator — Fórmulas: iRO Wiki. Item Rates: browiki.org. Los valores pueden variar por servidor.",
    formulaTitle: "Fórmula",
    formulaWithStats: "Con tus stats:",
    formulaSource: "Fuente: iRO Wiki / browiki.org",
    formulaClamp: "Limitado a [0%, 100%]",
    formulaQtyTable: "Cantidad según delta Creación − Dificultad:",
  },
  pt: {
    subtitle: "Servidor: Ragnarok Latinoamérica",
    tabs: ["Preços", "Potion Creation", "Special Pharmacy"],
    levels: "Níveis",
    skills: "Habilidades",
    stats: "Stats (Base + Bônus)",
    pcBaseRate: "Taxa Base PC",
    spCreationAvg: "Criação SP(méd)",
    spSpecificVal: "Val. Específico SP",
    spMax: "SP Máx",
    discount: "Desconto",
    materialPrices: "Preços dos Materiais",
    priceSubtitle: (r) => `Itens NPC com Desconto ${r}%. Altere se comprar no mercado.`,
    resetPrices: "Resetar para preços NPC com Desconto",
    pcTitle: "Potion Creation (Pharmacy)",
    pcSubtitle: "1 craft = 1 unidade. Custo/sucesso considera falhas.",
    spTitle: "Special Pharmacy (Geneticist)",
    spSubtitle: "1 craft consome 1 set → produz múltiplas unidades.",
    colPotion: "Poção",
    colCost: "Custo",
    colRate: "Taxa%",
    colSell: "Venda",
    colProfit: "Lucro",
    colQty: "Qtd",
    colCpu: "$/u",
    colSellU: "Venda/u",
    detail: "Detalhes",
    itemRate: "Item Rate",
    difficulty: "Dificuldade",
    totalCost: "Custo total",
    sellPerUnit: "Preço de venda/u:",
    pessimistic: "Pessimista",
    expected: "Esperado",
    optimistic: "Otimista",
    creationValue: "Valor de Criação",
    qtyProduced: "Quantidade produzida",
    batchProfit: "Lucro por lote",
    successRate: "Taxa de Sucesso %",
    costPerSuccess: "Custo por sucesso",
    netProfit: "Lucro líquido",
    potionRate: "Potion Rate",
    footer: "RO Potion Calculator — Fórmulas: iRO Wiki. Item Rates: browiki.org. Os valores podem variar por servidor.",
    formulaTitle: "Fórmula",
    formulaWithStats: "Com seus stats:",
    formulaSource: "Fonte: iRO Wiki / browiki.org",
    formulaClamp: "Limitado a [0%, 100%]",
    formulaQtyTable: "Quantidade pelo delta Criação − Dificuldade:",
  },
};
