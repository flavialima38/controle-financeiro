import type { Pessoa, FormaPagamento, MktCategory } from "./types";

export const MESES: readonly string[] = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
] as const;

export const META_CONTRIBUICAO = 1000;

export const PESSOAS: readonly Pessoa[] = [
  { nome: "Flavia", cor: "#6c8fff", ini: "FL", recebeDia: "5º dia útil (máx dia 10)" },
  { nome: "Igor", cor: "#ff7eb3", ini: "IG", recebeDia: "Dia 30 ou 31" },
  { nome: "Luli", cor: "#4ade80", ini: "LU", recebeDia: "Dia 31" },
  { nome: "Daniel", cor: "#fbbf24", ini: "DN", recebeDia: "Dia 05" },
] as const;

export const FORMAS: readonly FormaPagamento[] = [
  { val: "", lab: "Forma de pagamento" },
  { val: "pix", lab: "⚡ Pix" },
  { val: "credito", lab: "💳 Crédito" },
  { val: "banco", lab: "🏦 Transferência" },
  { val: "dinheiro", lab: "💵 Dinheiro" },
] as const;

export const DESPESA_ICONS = ["💧", "⚡", "🔥", "🛒", "🍽️", "🧹", "💊", "🎉", "📦", "🚿", "🧴", "🧺"];

export const MKT_DEFAULT: readonly MktCategory[] = [
  { cat: "🍚 Alimentos Básicos", items: [
    { n: "Arroz", q: "8-10 pct/20kg" }, { n: "Feijão", q: "8-10 pct/10kg" },
    { n: "Macarrão", q: "12-15 pct" }, { n: "Cuscuz", q: "3 pct" },
    { n: "Tapioca", q: "2 pct" }, { n: "Farinha de trigo", q: "2 kg" },
    { n: "Farinha de mandioca", q: "1 kg" }, { n: "Açúcar", q: "4 kg" },
    { n: "Sal", q: "1 kg" }, { n: "Óleo", q: "4 un (900ml)" },
    { n: "Molho de tomate", q: "8-10 un" }, { n: "Milho (lata)", q: "8 un" },
    { n: "Azeitona", q: "6 un" }, { n: "Creme de leite", q: "a gosto" },
    { n: "Leite condensado", q: "a gosto" }, { n: "Leite em pó", q: "1 lata" },
  ]},
  { cat: "🍗 Proteínas", tip: "~300g/pessoa/dia", items: [
    { n: "Peito de frango", q: "4 kg" }, { n: "Frango (geral)", q: "10-12 kg/mês" },
    { n: "Alcatra/Coxão mole", q: "4 kg" }, { n: "Acém (pressão)", q: "4 kg" },
    { n: "Carne moída", q: "3 kg" }, { n: "Linguiça", q: "2 kg" },
    { n: "Hambúrguer", q: "1 cx" }, { n: "Salsicha", q: "2 kg" },
    { n: "Nuggets", q: "30 un" }, { n: "Ovos", q: "8-10 dúzias" },
    { n: "Sardinha/Atum", q: "8-12 latas" },
  ]},
  { cat: "🥛 Laticínios", items: [
    { n: "Leite zero lactose", q: "40-50 litros" }, { n: "Queijo", q: "1,5 kg" },
    { n: "Presunto", q: "1 kg" }, { n: "Iogurte", q: "20-30 un" },
    { n: "Margarina", q: "4 un" }, { n: "Manteiga", q: "1 un" },
  ]},
  { cat: "🍞 Café da Manhã", tip: "Essencial pelas crianças", items: [
    { n: "Pão de forma", q: "3 pct" }, { n: "Pão francês", q: "ao longo do mês" },
    { n: "Biscoito Cream Cracker", q: "2 pct" }, { n: "Bolacha/Biscoito", q: "10-15 pct" },
    { n: "Achocolatado", q: "1-2 kg" }, { n: "Cereais", q: "2 caixas" },
    { n: "Requeijão/Geleia", q: "2-3 un" }, { n: "Suco (pacotinho)", q: "15-20 un" },
    { n: "Filtro de Café", q: "2 un" },
  ]},
  { cat: "🍎 Frutas", tip: "Repor semanalmente", items: [
    { n: "Banana", q: "6-8 kg" }, { n: "Maçã", q: "5 kg" },
    { n: "Laranja", q: "5 kg" }, { n: "Mamão/Melancia", q: "4-6 un" },
  ]},
  { cat: "🥕 Legumes e Verduras", tip: "Comprar semanalmente", items: [
    { n: "Batata inglesa", q: "8 kg" }, { n: "Batata doce", q: "a gosto" },
    { n: "Cenoura", q: "4 kg" }, { n: "Beterraba", q: "a gosto" },
    { n: "Tomate", q: "4 un/5kg mês" }, { n: "Cebola", q: "10 un" },
    { n: "Alho", q: "500g" }, { n: "Pimentão", q: "2 un" },
    { n: "Cheiro verde", q: "2 maços" }, { n: "Alface americano", q: "a gosto" },
    { n: "Verduras (couve...)", q: "8-12 maços" },
  ]},
  { cat: "🧂 Temperos e Molhos", items: [
    { n: "Sazon ⚠️ (sempre marca Sazon!)", q: "4 un" },
    { n: "Páprica doce e picante", q: "2 un" }, { n: "Chimichurri", q: "2 un" },
    { n: "Colorau", q: "1 un" }, { n: "Pimenta do reino", q: "1 un" },
    { n: "Molho Shoyu", q: "1 un" }, { n: "Ketchup", q: "1-2 un" },
    { n: "Maionese", q: "1-2 un" }, { n: "Mostarda ⚠️ (nunca Kosumo!)", q: "1 un" },
    { n: "Vinagre", q: "1 frasco" },
  ]},
  { cat: "🧃 Bebidas", items: [
    { n: "Café em pó", q: "3 pct de 500g" }, { n: "Chá Matte", q: "1 caixa" },
    { n: "Água (galão)", q: "se usar" }, { n: "Refrigerante", q: "4-8 garrafas" },
  ]},
  { cat: "🧼 Limpeza", items: [
    { n: "Detergente", q: "12-16 un" }, { n: "Sabão em pó", q: "5-6 kg" },
    { n: "Amaciante", q: "2 litros" }, { n: "Água sanitária", q: "2 litros" },
    { n: "Desinfetante", q: "2 litros" }, { n: "Veja", q: "1 un" },
    { n: "Bombril", q: "1 pct" }, { n: "Esponja", q: "3-4 un" },
    { n: "Saco de lixo", q: "2-3 pct" }, { n: "Papel filme", q: "1 un" },
    { n: "Papel alumínio", q: "1 un" },
  ]},
  { cat: "🧴 Higiene Pessoal", items: [
    { n: "Papel higiênico", q: "36 rolos (3 pct)" }, { n: "Sabonete", q: "12-18 un" },
    { n: "Shampoo", q: "2-3 frascos" }, { n: "Condicionador", q: "2 frascos" },
    { n: "Creme dental", q: "3-4 un" },
  ]},
];

export const MKT_DICAS: readonly string[] = [
  "🥩 Congele carnes em porções → facilita o dia a dia",
  "🥬 Hortifruti comprar semanalmente → evita desperdício",
  "👧🧑 Adolescente e criança comem mais fora de hora → mantenha sempre pão, frutas e iogurte",
  "💰 Para economizar: compre marcas de atacado e substitua parte da carne por ovos e frango",
  "🧂 Sazon: SEMPRE da marca Sazon — nunca substituir por outra!",
  "🍋 Mostarda: NUNCA comprar da marca Kosumo!",
];

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
