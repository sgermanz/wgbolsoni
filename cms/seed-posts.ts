import type { Payload } from "payload";
import sharp from "sharp";

import {
  buildLexical,
  lexBulletList,
  lexHeading,
  lexParagraph,
} from "@/lib/lexical";

/**
 * One-time blog seed: 10 matérias cobrindo as frentes do grupo, com SEO
 * (meta title/description/keyword), GEO (FAQ → FAQPage JSON-LD) e capas
 * genéricas geradas em tons da marca (o editor troca depois no admin).
 *
 * Idempotente: só roda quando a coleção `posts` está totalmente vazia
 * (rascunhos incluídos), então nunca duplica nem ressuscita matérias
 * apagadas individualmente. Autor: primeiro usuário cujo nome contém
 * "Wilton" (fallback: primeiro usuário) — em produção, o usuário
 * "Wilton G Bolsoni" já existe.
 */

type SeedPost = {
  title: string;
  slug: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  faq: { question: string; answer: string }[];
  /** Cover gradient (dark → light) in brand tones, varies by theme. */
  gradient: [string, string];
  body: unknown[];
};

const POSTS: SeedPost[] = [
  {
    title:
      "O que faz uma holding de participações — e por que governança importa",
    slug: "o-que-faz-uma-holding-de-participacoes",
    excerpt:
      "Capital é só o começo. Entenda como uma holding de participações combina alocação de recursos, governança e visão de longo prazo para construir negócios — do agro à indústria.",
    categories: ["institucional", "mercado"],
    tags: ["holding", "governança", "investimentos"],
    publishedAt: "2026-04-06T09:00:00.000-03:00",
    metaTitle: "Holding de participações: o que é e como funciona",
    metaDescription:
      "Entenda o papel de uma holding de participações: alocação de capital, governança e visão de longo prazo aplicadas a negócios do agro à indústria.",
    focusKeyword: "holding de participações",
    faq: [
      {
        question: "O que é uma holding de participações?",
        answer:
          "É uma empresa criada para deter participações societárias em outros negócios, orientando estratégia, capital e governança — sem necessariamente operar o dia a dia de cada empresa.",
      },
      {
        question: "Qual a diferença entre holding e fundo de investimento?",
        answer:
          "O fundo compra e vende ativos com horizonte definido; a holding é sócia de longo prazo, participa da governança e constrói valor junto com a operação.",
      },
      {
        question: "Como a WG Bolsoni escolhe onde investir?",
        answer:
          "Investimos onde nossa visão setorial, rede de relacionamento e capacidade de execução criam vantagem competitiva real — e onde a sustentabilidade é parte do modelo de negócio, não um anexo.",
      },
    ],
    gradient: ["#143620", "#45453f"],
    body: [
      lexParagraph(
        "Quando se fala em investimento, a imagem que vem à cabeça costuma ser a do mercado financeiro: telas, cotações, compra e venda. Uma holding de participações opera em outra frequência. Ela não gira posições — constrói posições. Entra como sócia, permanece por ciclos longos e trabalha para que cada negócio investido valha mais amanhã do que vale hoje.",
      ),
      lexParagraph(
        "Na prática, isso muda tudo: o critério de entrada, o papel exercido depois do aporte e, principalmente, o horizonte de tempo das decisões.",
      ),
      lexHeading("Capital com sobrenome"),
      lexParagraph(
        "Dinheiro é commodity; o que diferencia uma holding é o que ela agrega além do capital. Na WG Bolsoni, cada participação carrega o nome do grupo junto — o que significa colocar à mesa rede de relacionamento, leitura setorial e experiência de execução acumulada em frentes que vão do agronegócio à indústria de base.",
      ),
      lexBulletList([
        [
          { text: "Estratégia.", bold: true },
          {
            text: " Tese clara de onde o negócio pode chegar e quais movimentos levam até lá.",
          },
        ],
        [
          { text: "Governança.", bold: true },
          {
            text: " Ritos de decisão, prestação de contas e clareza de papéis entre sócios e gestão.",
          },
        ],
        [
          { text: "Rede.", bold: true },
          {
            text: " Acesso a parceiros, clientes e fornecedores que aceleram o que levaria anos para construir sozinho.",
          },
        ],
      ]),
      lexHeading("Governança não é burocracia — é ativo"),
      lexParagraph(
        "Negócio que cresce sem governança cresce até o dia em que o próprio crescimento vira risco. Conselhos funcionais, segregação de funções, disciplina financeira e tratamento transparente de conflitos de interesse não deixam a operação mais lenta: deixam a operação mais vendável, mais financiável e mais resiliente a crises.",
      ),
      lexHeading("O longo prazo como disciplina"),
      lexParagraph(
        "Plantar uma floresta, montar uma cadeia de proteína ou estruturar um título lastreado em conservação ambiental são apostas de anos, não de semestres. É por isso que privilegiamos teses estruturais a modas passageiras: o tempo é o insumo mais barato de quem tem convicção — e o mais caro de quem não tem.",
      ),
    ],
  },
  {
    title: "Fibras celulósicas: a indústria que nasce da floresta plantada",
    slug: "fibras-celulosicas-industria-que-nasce-da-floresta",
    excerpt:
      "Do viveiro de mudas à bobina de papel: como as florestas plantadas abastecem a cadeia de celulose no Brasil — e por que a fibra de ciclo curto virou vantagem competitiva global.",
    categories: ["industria"],
    tags: ["celulose", "papel", "floresta plantada"],
    publishedAt: "2026-04-14T09:00:00.000-03:00",
    metaTitle: "Fibras celulósicas: da floresta plantada ao papel",
    metaDescription:
      "Como florestas plantadas abastecem a cadeia de celulose e papel no Brasil — e por que a fibra de ciclo curto virou vantagem competitiva global.",
    focusKeyword: "fibras celulósicas",
    faq: [
      {
        question: "De onde vem a celulose brasileira?",
        answer:
          "Essencialmente de florestas plantadas — eucalipto e pinus cultivados especificamente para uso industrial, e não de mata nativa.",
      },
      {
        question: "Por que o Brasil é competitivo em celulose?",
        answer:
          "Clima e solo permitem ciclos de crescimento muito mais curtos que os do hemisfério norte, o que reduz o custo e o prazo de produção da fibra.",
      },
      {
        question: "Papel é inimigo do meio ambiente?",
        answer:
          "Quando a origem é floresta plantada manejada corretamente, a cadeia é renovável: novas árvores substituem as colhidas e estocam carbono enquanto crescem.",
      },
    ],
    gradient: ["#1d5230", "#62625a"],
    body: [
      lexParagraph(
        "Existe uma indústria inteira que começa num viveiro de mudas. A cadeia de fibras celulósicas — celulose, papéis, embalagens, tissue — é abastecida no Brasil por florestas plantadas, cultivadas com a mesma lógica de qualquer cultura agrícola: plantar, manejar, colher e replantar.",
      ),
      lexHeading("A vantagem do ciclo curto"),
      lexParagraph(
        "Enquanto uma floresta de coníferas no hemisfério norte pode levar décadas até o corte, o eucalipto brasileiro atinge o ponto de colheita em poucos anos. Esse diferencial de ciclo se traduz diretamente em custo, giro de capital e capacidade de resposta à demanda global — e explica por que o Brasil se tornou protagonista mundial na produção de celulose de fibra curta.",
      ),
      lexHeading("Muito além do papel de imprimir"),
      lexParagraph(
        "A fibra celulósica está no papel-cartão da embalagem, no papel higiênico, no filtro, no copo que substitui o plástico descartável. À medida que o mundo pressiona por materiais renováveis e biodegradáveis, a demanda migra na direção de tudo aquilo que a floresta plantada consegue entregar.",
      ),
      lexBulletList([
        [
          { text: "Embalagens.", bold: true },
          {
            text: " O comércio eletrônico e a substituição do plástico puxam o consumo de papéis de embalagem.",
          },
        ],
        [
          { text: "Tissue.", bold: true },
          {
            text: " Papéis sanitários acompanham renda e urbanização — demanda estrutural, não cíclica.",
          },
        ],
        [
          { text: "Novos materiais.", bold: true },
          {
            text: " Da lignina às fibras têxteis de base florestal, a árvore vira plataforma química renovável.",
          },
        ],
      ]),
      lexHeading("Uma cadeia que se replanta"),
      lexParagraph(
        "O ativo florestal bem manejado é um dos poucos que se reconstrói sozinho: colheu, replantou, e o ciclo recomeça — estocando carbono a cada rotação. Para quem investe com horizonte longo, é a combinação rara de demanda global crescente com base produtiva renovável.",
      ),
    ],
  },
  {
    title:
      "Incorporações imobiliárias: onde a visão de longo prazo encontra o território",
    slug: "incorporacoes-imobiliarias-visao-de-longo-prazo",
    excerpt:
      "Incorporação não é especulação: é leitura de território, disciplina financeira e a paciência de entregar o produto certo, no lugar certo, na hora certa.",
    categories: ["mercado"],
    tags: ["imobiliário", "incorporação", "cidades"],
    publishedAt: "2026-04-22T09:00:00.000-03:00",
    metaTitle: "Incorporação imobiliária com visão de longo prazo",
    metaDescription:
      "Por que incorporação imobiliária é tese de ciclo longo: leitura de território, disciplina financeira e o produto certo no lugar certo, na hora certa.",
    focusKeyword: "incorporação imobiliária",
    faq: [
      {
        question: "O que faz uma incorporadora?",
        answer:
          "A incorporadora identifica o terreno, estrutura juridicamente o empreendimento, viabiliza o financiamento, coordena o projeto e a obra e responde pela entrega das unidades aos compradores.",
      },
      {
        question: "Qual é o maior risco da incorporação imobiliária?",
        answer:
          "O descasamento de ciclo: decisões tomadas hoje só viram receita anos depois. Errar a leitura de demanda ou a disciplina de custos no início compromete todo o empreendimento.",
      },
      {
        question: "Por que uma holding investe em incorporação?",
        answer:
          "Porque é um negócio de capital intensivo e ciclo longo, em que governança, disciplina financeira e paciência — características de holding — fazem diferença direta no resultado.",
      },
    ],
    gradient: ["#2f2f2b", "#c2611f"],
    body: [
      lexParagraph(
        "Todo empreendimento imobiliário é uma aposta sobre o futuro de um pedaço de cidade. Quando a incorporadora compra um terreno, ela está comprando uma hipótese: de que ali, dali a alguns anos, haverá demanda por um produto específico — moradia, comércio, logística — a um preço que remunere o risco de carregar essa hipótese até a entrega das chaves.",
      ),
      lexHeading("O ciclo é longo — e isso é filtro"),
      lexParagraph(
        "Entre a compra do terreno e a entrega, passam-se anos: aprovação, projeto, lançamento, obra, repasse. Esse prazo elimina os apressados e premia quem tem estrutura de capital para atravessar ciclos sem vender ativo bom em momento ruim. É exatamente o tipo de assimetria que favorece o investidor de longo prazo.",
      ),
      lexHeading("Leitura de território"),
      lexParagraph(
        "Os melhores negócios imobiliários nascem antes do óbvio: onde a infraestrutura vai chegar, para onde a cidade cresce, o que o novo perfil demográfico da região vai demandar. Essa leitura não sai de planilha — sai de presença, relacionamento local e repertório de quem já viu ciclos anteriores.",
      ),
      lexHeading("Disciplina financeira como fundação"),
      lexParagraph(
        "Na incorporação, a margem se decide muito antes do lançamento: no preço do terreno, na engenharia financeira, no orçamento de obra e no controle de custo durante a execução. Governança e disciplina — mais do que ousadia — são o que separa empreendimentos que atravessam crises daqueles que viram passivo.",
      ),
    ],
  },
  {
    title: "Alcoolquímica: do etanol à química verde",
    slug: "alcoolquimica-do-etanol-a-quimica-verde",
    excerpt:
      "O etanol brasileiro vale muito além do tanque de combustível: a alcoolquímica o transforma em solventes, polímeros e insumos industriais de base renovável.",
    categories: ["industria", "energia"],
    tags: ["etanol", "alcoolquímica", "química verde"],
    publishedAt: "2026-04-30T09:00:00.000-03:00",
    metaTitle: "Alcoolquímica: o etanol além do tanque de combustível",
    metaDescription:
      "A alcoolquímica transforma etanol em insumo industrial — solventes, polímeros e química de base renovável a partir da biomassa brasileira.",
    focusKeyword: "alcoolquímica",
    faq: [
      {
        question: "O que é alcoolquímica?",
        answer:
          "É o ramo da química que usa o etanol como matéria-prima para produzir insumos industriais — solventes, eteno, polímeros e derivados — substituindo rotas de origem fóssil.",
      },
      {
        question: "Qual a vantagem da alcoolquímica sobre a petroquímica?",
        answer:
          "A matéria-prima é renovável e de baixo carbono: a cana absorve CO2 durante o crescimento, o que reduz a pegada dos produtos em relação aos equivalentes fósseis.",
      },
      {
        question: "O Brasil tem vantagem competitiva nessa rota?",
        answer:
          "Sim. O país combina a maior indústria de etanol de cana do mundo, logística consolidada e décadas de domínio tecnológico do ciclo da biomassa.",
      },
    ],
    gradient: ["#236639", "#e07a35"],
    body: [
      lexParagraph(
        "O mundo conheceu o etanol brasileiro pelo tanque do carro. Mas uma molécula de etanol não sabe se vai virar combustível ou matéria-prima — e é nessa segunda vida que mora uma das fronteiras industriais mais interessantes do país: a alcoolquímica.",
      ),
      lexHeading("A mesma molécula, outra cadeia de valor"),
      lexParagraph(
        "A partir do etanol é possível produzir eteno — e, dele, polietileno e uma família inteira de plásticos e químicos que hoje o mundo fabrica majoritariamente a partir do petróleo. Também saem da rota alcoolquímica solventes, acetatos e insumos para tintas, cosméticos, fármacos e alimentos. Cada tonelada produzida por essa via carrega uma história de carbono diferente: a matéria-prima cresceu absorvendo CO2 em vez de sair de um poço.",
      ),
      lexHeading("Por que agora"),
      lexParagraph(
        "Grandes consumidores globais assumiram metas de descarbonização que não se resolvem apenas com energia limpa — é preciso descarbonizar o material dos produtos. Química de base renovável deixou de ser nicho de marketing para virar exigência de cadeia de suprimentos, com prêmio de preço e contratos de longo prazo para quem consegue entregar escala e rastreabilidade.",
      ),
      lexHeading("A posição do Brasil"),
      lexParagraph(
        "Nenhum outro país combina, no mesmo território, biomassa abundante, indústria de etanol madura, energia elétrica renovável e mercado interno relevante. A alcoolquímica é o ponto onde o agro brasileiro encontra a indústria química global — e onde o custo de oportunidade de não investir cresce a cada ano.",
      ),
    ],
  },
  {
    title: "Gaseificação de resíduos: energia do que iria para o aterro",
    slug: "gaseificacao-de-residuos-energia-do-que-seria-lixo",
    excerpt:
      "A gaseificação converte resíduos em gás de síntese para gerar energia e insumos industriais — fechando o ciclo da economia circular e aliviando os aterros.",
    categories: ["energia", "industria"],
    tags: ["resíduos", "gaseificação", "economia circular"],
    publishedAt: "2026-05-08T09:00:00.000-03:00",
    metaTitle: "Gaseificação de resíduos: como funciona e por que importa",
    metaDescription:
      "Gaseificação converte resíduos em gás de síntese para energia e indústria, reduzindo aterros e emissões — entenda a rota tecnológica.",
    focusKeyword: "gaseificação de resíduos",
    faq: [
      {
        question: "O que é gaseificação de resíduos?",
        answer:
          "É um processo termoquímico que converte resíduos sólidos em gás de síntese (syngas) em ambiente controlado com pouco oxigênio — diferente da incineração, que apenas queima o material.",
      },
      {
        question: "O que se faz com o gás de síntese?",
        answer:
          "O syngas pode gerar energia elétrica e térmica ou servir de matéria-prima para combustíveis e produtos químicos, dependendo da configuração da planta.",
      },
      {
        question: "Gaseificação é melhor que aterro sanitário?",
        answer:
          "Para a fração não reciclável dos resíduos, sim: recupera energia, reduz drasticamente o volume aterrado e evita as emissões de metano da decomposição no aterro.",
      },
    ],
    gradient: ["#194227", "#8a8a80"],
    body: [
      lexParagraph(
        "Toda cidade produz, diariamente, uma montanha de resíduos que não têm rota de reciclagem viável. O destino tradicional é o aterro — onde essa matéria orgânica e esses materiais mistos passam décadas se decompondo e emitindo metano. A gaseificação propõe outro final para essa história: transformar o resíduo em energia e insumo industrial.",
      ),
      lexHeading("O que acontece dentro do gaseificador"),
      lexParagraph(
        "Em vez de queimar o resíduo ao ar livre como uma incineração comum, a gaseificação o submete a alta temperatura em ambiente com oxigênio controlado. O resultado não é cinza e fumaça, mas um gás combustível — o gás de síntese — composto principalmente de hidrogênio e monóxido de carbono, que pode ser limpo, medido e aproveitado.",
      ),
      lexHeading("Da tonelada de lixo ao megawatt"),
      lexBulletList([
        [
          { text: "Energia.", bold: true },
          {
            text: " O syngas alimenta motores e turbinas, gerando eletricidade e calor de processo.",
          },
        ],
        [
          { text: "Química.", bold: true },
          {
            text: " Purificado, vira matéria-prima para combustíveis sintéticos e produtos químicos.",
          },
        ],
        [
          { text: "Volume.", bold: true },
          {
            text: " O que sobra do processo é uma fração mínima do volume original que iria para o aterro.",
          },
        ],
      ]),
      lexHeading("Economia circular de verdade"),
      lexParagraph(
        "A gaseificação não compete com a reciclagem — completa. Ela dá destino produtivo justamente à fração que a reciclagem não alcança, transformando um passivo urbano crescente em ativo energético. Para municípios e indústrias pressionados por custo de destinação e metas ambientais, a rota deixou de ser exótica para se tornar alternativa concreta de infraestrutura.",
      ),
    ],
  },
  {
    title: "Energia renovável no agronegócio: da fazenda à matriz elétrica",
    slug: "energia-renovavel-no-agronegocio",
    excerpt:
      "Biomassa, biogás e sol: o agro brasileiro deixou de ser apenas consumidor de energia e virou gerador — transformando custo fixo em nova linha de receita.",
    categories: ["energia", "agro"],
    tags: ["energia renovável", "biomassa", "biogás"],
    publishedAt: "2026-05-16T09:00:00.000-03:00",
    metaTitle: "Energia renovável no agro: biomassa, biogás e sol",
    metaDescription:
      "O agro brasileiro deixou de ser só consumidor e virou gerador de energia: biomassa, biogás e solar transformam custo em receita na porteira.",
    focusKeyword: "energia renovável no agronegócio",
    faq: [
      {
        question: "Como o agronegócio gera energia renovável?",
        answer:
          "Pelas rotas da biomassa (queima de bagaço, cavaco e resíduos de colheita), do biogás (dejetos animais e vinhaça em biodigestores) e da geração solar em áreas e telhados rurais.",
      },
      {
        question: "O que é feito com o biogás da fazenda?",
        answer:
          "Ele pode gerar eletricidade no próprio empreendimento, virar biometano para substituir diesel e gás natural, ou ser vendido, criando nova receita a partir de um resíduo.",
      },
      {
        question: "Energia própria compensa para o produtor?",
        answer:
          "Em geral sim: reduz uma das maiores despesas da operação, protege contra oscilações tarifárias e ainda pode gerar créditos e receitas adicionais.",
      },
    ],
    gradient: ["#2f8049", "#f4a259"],
    body: [
      lexParagraph(
        "Durante décadas, energia foi apenas uma linha de custo na planilha do produtor rural. Essa lógica está sendo invertida: a mesma operação que consome eletricidade e diesel senta em cima de sol abundante, resíduos orgânicos e biomassa — os três principais insumos da geração renovável descentralizada.",
      ),
      lexHeading("Três rotas, um mesmo movimento"),
      lexBulletList([
        [
          { text: "Biomassa.", bold: true },
          {
            text: " Bagaço, cavaco e resíduos de colheita viram vapor e eletricidade — a agroindústria como usina.",
          },
        ],
        [
          { text: "Biogás.", bold: true },
          {
            text: " Dejetos e vinhaça, antes passivo ambiental, alimentam biodigestores e viram biometano.",
          },
        ],
        [
          { text: "Solar.", bold: true },
          {
            text: " Telhados de galpão e áreas de baixa aptidão agrícola geram energia onde ela é consumida.",
          },
        ],
      ]),
      lexHeading("De custo a receita"),
      lexParagraph(
        "O primeiro efeito é defensivo: reduzir a conta de energia e a exposição ao diesel. O segundo é ofensivo: excedentes viram receita — venda de energia, biometano substituindo combustível fóssil na frota, créditos associados à descarbonização. A porteira, que só via caminhão de insumo entrar, passa a ver energia sair.",
      ),
      lexHeading("O agro como parte da matriz"),
      lexParagraph(
        "Num país que precisa crescer sua oferta elétrica sem sujar a matriz, a geração distribuída no campo é vetor estratégico: está perto da carga, usa resíduo local e dá estabilidade de renda ao produtor. É a convergência ambiental e produtiva acontecendo na prática — geração de valor que também é agenda climática.",
      ),
    ],
  },
  {
    title: "Biocombustíveis: o atalho brasileiro para a descarbonização",
    slug: "biocombustiveis-brasil-rota-descarbonizacao",
    excerpt:
      "Etanol, biodiesel e as novas rotas como o combustível sustentável de aviação: por que o Brasil tem a matriz e o know-how para liderar a transição energética dos transportes.",
    categories: ["energia", "meio-ambiente"],
    tags: ["biocombustíveis", "etanol", "SAF"],
    publishedAt: "2026-05-24T09:00:00.000-03:00",
    metaTitle: "Biocombustíveis e descarbonização: a vantagem do Brasil",
    metaDescription:
      "Etanol, biodiesel e novas rotas como o SAF colocam o Brasil na dianteira da transição energética dos transportes — entenda a oportunidade.",
    focusKeyword: "biocombustíveis",
    faq: [
      {
        question: "Por que biocombustíveis descarbonizam o transporte?",
        answer:
          "Porque o carbono emitido na queima foi absorvido da atmosfera pela planta durante o crescimento, fechando um ciclo — diferente do fóssil, que adiciona carbono novo ao sistema.",
      },
      {
        question: "O que é SAF?",
        answer:
          "SAF é o combustível sustentável de aviação: um querosene produzido a partir de fontes renováveis, capaz de reduzir substancialmente as emissões dos voos sem trocar as aeronaves.",
      },
      {
        question: "Qual a vantagem do Brasil nessa corrida?",
        answer:
          "Décadas de experiência com etanol e biodiesel, biomassa abundante e uma matriz agrícola capaz de escalar produção sem abrir novas fronteiras sobre vegetação nativa.",
      },
    ],
    gradient: ["#1d5230", "#e07a35"],
    body: [
      lexParagraph(
        "Enquanto boa parte do mundo discute como descarbonizar o transporte a partir do zero, o Brasil resolve esse problema há décadas. A frota nacional roda com mistura relevante de renovável no tanque — uma infraestrutura física, agrícola e regulatória que nenhum outro país construiu na mesma escala.",
      ),
      lexHeading("O ciclo do carbono a favor"),
      lexParagraph(
        "A diferença conceitual é simples: o combustível fóssil transfere para a atmosfera um carbono que estava estocado há milhões de anos; o biocombustível devolve um carbono que a planta acabou de capturar. É essa contabilidade que faz o etanol e o biodiesel reduzirem drasticamente as emissões do quilômetro rodado — hoje, com motor e posto que já existem.",
      ),
      lexHeading("A próxima fronteira voa"),
      lexParagraph(
        "A aviação é o segmento mais difícil de eletrificar — baterias não embarcam em voos longos. Por isso o combustível sustentável de aviação (SAF) virou prioridade global, com mandatos de mistura se espalhando pelos grandes mercados. Produzir SAF exige biomassa, tecnologia de conversão e logística: exatamente o tripé em que o Brasil já opera com vantagem.",
      ),
      lexHeading("Oportunidade estrutural, não moda"),
      lexParagraph(
        "Metas corporativas e regulatórias de descarbonização criaram demanda firme e de longo prazo por moléculas renováveis. Para quem enxerga o setor como tese estrutural — terra, biomassa, indústria e distribuição integradas —, os biocombustíveis são talvez o exemplo mais claro de convergência entre agenda ambiental e geração de valor.",
      ),
    ],
  },
  {
    title: "Florestas plantadas e biomassa: energia que se planta",
    slug: "florestas-plantadas-biomassa-energia-que-se-planta",
    excerpt:
      "Floresta plantada de ciclo curto é fábrica de energia renovável: lenha industrial, cavaco e vapor para uma indústria que precisa descarbonizar o calor de processo.",
    categories: ["agro", "energia"],
    tags: ["floresta plantada", "biomassa", "eucalipto"],
    publishedAt: "2026-06-01T09:00:00.000-03:00",
    metaTitle: "Biomassa florestal: a energia que se planta e se colhe",
    metaDescription:
      "Florestas plantadas de ciclo curto viram lenha industrial, cavaco e vapor: a biomassa florestal como base renovável da matriz energética.",
    focusKeyword: "biomassa florestal",
    faq: [
      {
        question: "O que é biomassa florestal?",
        answer:
          "É a matéria orgânica de origem florestal — lenha, cavaco, resíduos de colheita e de serraria — usada como fonte de energia térmica e elétrica.",
      },
      {
        question: "Usar lenha industrial não desmata?",
        answer:
          "Não quando a origem é floresta plantada: as árvores são cultivadas para esse fim e replantadas após a colheita, num ciclo contínuo que ainda estoca carbono durante o crescimento.",
      },
      {
        question: "Quem consome biomassa florestal no Brasil?",
        answer:
          "Indústrias que dependem de calor de processo — alimentos, cerâmica, secagem de grãos, siderurgia a carvão vegetal — além da geração elétrica em termelétricas a biomassa.",
      },
    ],
    gradient: ["#143620", "#71be83"],
    body: [
      lexParagraph(
        "Há uma parte da transição energética que não aparece nos anúncios de carros elétricos: o calor industrial. Fornos, caldeiras e secadores movem boa parte da economia real — e majoritariamente ainda queimam combustível fóssil. A resposta renovável mais madura para esse problema cresce em talhões: a floresta plantada energética.",
      ),
      lexHeading("Uma cultura agrícola chamada floresta"),
      lexParagraph(
        "O florestamento comercial trata a árvore como cultura de ciclo: mudas melhoradas, plantio planejado, manejo técnico e colheita programada em poucos anos. O produto — lenha industrial, cavaco, torete — abastece contratos de fornecimento de energia térmica com previsibilidade que nenhum resíduo avulso oferece.",
      ),
      lexHeading("Por que a indústria procura biomassa"),
      lexBulletList([
        [
          { text: "Preço e previsibilidade.", bold: true },
          {
            text: " Contratos longos de biomassa protegem a indústria da volatilidade do gás e do óleo.",
          },
        ],
        [
          { text: "Descarbonização.", bold: true },
          {
            text: " Trocar fóssil por biomassa plantada reduz emissões líquidas do calor de processo.",
          },
        ],
        [
          { text: "Origem rastreável.", bold: true },
          {
            text: " Floresta própria ou de fomento documenta a cadeia — exigência crescente de clientes e financiadores.",
          },
        ],
      ]),
      lexHeading("O ativo que trabalha enquanto cresce"),
      lexParagraph(
        "Entre o plantio e a colheita, a floresta valoriza, estoca carbono e protege solo e água. Colhida, vira energia; replantada, recomeça. Poucos ativos reais combinam renda recorrente, lastro físico e contribuição ambiental mensurável — e é por isso que o florestamento segue no centro da nossa tese de longo prazo.",
      ),
    ],
  },
  {
    title: "Proteína de alto valor biológico: a nova fronteira nutricional",
    slug: "proteina-de-alto-valor-biologico-nova-fronteira",
    excerpt:
      "O mundo não busca apenas mais comida — busca nutrição melhor. Entenda por que a proteína de alto valor biológico virou ativo estratégico global e onde o Brasil entra nessa cadeia.",
    categories: ["agro", "mercado"],
    tags: ["proteína", "nutrição", "segurança alimentar"],
    publishedAt: "2026-06-10T09:00:00.000-03:00",
    metaTitle: "Proteína de alto valor biológico: por que o mundo busca",
    metaDescription:
      "Segurança alimentar e nutrição de precisão: por que a proteína de alto valor biológico virou ativo estratégico global — e onde o Brasil entra.",
    focusKeyword: "proteína de alto valor biológico",
    faq: [
      {
        question: "O que é proteína de alto valor biológico?",
        answer:
          "É a proteína que contém todos os aminoácidos essenciais em proporções que o corpo humano absorve e aproveita com eficiência — caso típico das proteínas de origem animal, como frango e ovos.",
      },
      {
        question: "Por que a demanda global por proteína cresce?",
        answer:
          "Crescimento populacional, urbanização e aumento de renda em mercados emergentes elevam o consumo — somados ao envelhecimento da população, que exige mais proteína por razões de saúde.",
      },
      {
        question: "Qual o papel do Brasil nessa cadeia?",
        answer:
          "O Brasil é um dos maiores produtores e exportadores mundiais de proteína animal, com custo competitivo, sanidade reconhecida e capacidade de escala que poucos países possuem.",
      },
    ],
    gradient: ["#236639", "#f4a259"],
    body: [
      lexParagraph(
        "A conversa global sobre alimentação mudou de assunto. Durante décadas, o desafio era calorias — produzir comida suficiente. O desafio da próxima geração é qualidade nutricional: entregar proteína completa, segura e acessível para uma população que cresce, envelhece e enriquece ao mesmo tempo.",
      ),
      lexHeading("O que 'alto valor biológico' significa"),
      lexParagraph(
        "Nem toda proteína é igual. O valor biológico mede o quanto do que se come o corpo de fato aproveita — e proteínas com todos os aminoácidos essenciais, em proporção adequada, ficam no topo dessa régua. É o território das proteínas animais: frango, ovos, leite. Para atletas, idosos, crianças e sistemas públicos de saúde, essa diferença não é detalhe técnico; é resultado clínico.",
      ),
      lexHeading("Uma demanda com três motores"),
      lexBulletList([
        [
          { text: "Demografia.", bold: true },
          {
            text: " Mais gente, mais urbana e com mais renda: o consumo per capita de proteína sobe junto.",
          },
        ],
        [
          { text: "Envelhecimento.", bold: true },
          {
            text: " Populações mais velhas precisam de mais proteína de qualidade para preservar saúde e autonomia.",
          },
        ],
        [
          { text: "Segurança alimentar.", bold: true },
          {
            text: " Países que não produzem o suficiente tratam proteína como questão estratégica de Estado.",
          },
        ],
      ]),
      lexHeading("O Brasil na mesa do mundo"),
      lexParagraph(
        "Poucos países reúnem grão, espaço, sanidade, tecnologia e escala industrial para atender esse crescimento. O Brasil é um deles — e é nessa convicção que estruturamos nossa atuação na frente de proteína, conectando a capacidade produtiva brasileira a mercados que precisam dela, com marca, rastreabilidade e padrão internacional.",
      ),
    ],
  },
  {
    title: "CPR Verde: o título que transforma conservação em ativo financeiro",
    slug: "cpr-verde-o-titulo-que-remunera-conservacao",
    excerpt:
      "Da Lei 8.929/1994 ao Decreto 10.828/2021: a CPR Verde permite remunerar quem preserva, dando lastro jurídico e financeiro aos serviços ambientais do produtor rural.",
    categories: ["meio-ambiente", "agro"],
    tags: ["CPR Verde", "ativos ambientais", "conservação"],
    publishedAt: "2026-06-18T09:00:00.000-03:00",
    metaTitle: "CPR Verde: como funciona o título verde do agro",
    metaDescription:
      "Da Lei 8.929/1994 ao Decreto 10.828/2021: como a CPR Verde permite remunerar quem preserva — e por que está no centro da agenda ambiental.",
    focusKeyword: "CPR Verde",
    faq: [
      {
        question: "O que é a CPR Verde?",
        answer:
          "É a Cédula de Produto Rural emitida sobre atividades de conservação e serviços ambientais — um título que permite ao produtor captar recursos tendo a preservação como lastro.",
      },
      {
        question: "Qual a base legal da CPR Verde?",
        answer:
          "A CPR foi criada pela Lei 8.929/1994, modernizada pela Lei 13.986/2020 (Lei do Agro) e a vertente verde foi regulamentada pelo Decreto 10.828/2021.",
      },
      {
        question: "Quem pode se beneficiar da CPR Verde?",
        answer:
          "Produtores e empreendimentos rurais que conservam vegetação nativa ou prestam serviços ambientais, e investidores que buscam ativos com lastro ambiental verificável.",
      },
    ],
    gradient: ["#194227", "#2f8049"],
    body: [
      lexParagraph(
        "Por décadas, a floresta em pé foi tratada pela economia como ausência de receita: valia o que renderia se fosse convertida. A CPR Verde inverte esse cálculo — cria um instrumento financeiro em que a conservação é o próprio lastro, permitindo que o produtor capte recursos justamente porque preserva.",
      ),
      lexHeading("De onde vem o instrumento"),
      lexParagraph(
        "A Cédula de Produto Rural nasceu com a Lei 8.929/1994 como promessa de entrega de produção agrícola. A Lei 13.986/2020, a Lei do Agro, modernizou o título; e o Decreto 10.828/2021 deu o passo conceitual: reconheceu atividades de conservação de vegetação nativa e serviços ambientais como lastro legítimo de uma CPR. O mesmo papel que financiava a saca de soja passou a poder financiar o hectare preservado.",
      ),
      lexHeading("Como funciona na prática"),
      lexBulletList([
        [
          { text: "Lastro.", bold: true },
          {
            text: " Área conservada ou serviço ambiental mensurável — carbono, água, biodiversidade.",
          },
        ],
        [
          { text: "Verificação.", bold: true },
          {
            text: " Medição e monitoramento independentes dão segurança a emissor e investidor.",
          },
        ],
        [
          { text: "Captação.", bold: true },
          {
            text: " O produtor antecipa recursos; o investidor carrega um ativo com lastro ambiental real.",
          },
        ],
      ]),
      lexHeading("Por que está no centro da nossa agenda"),
      lexParagraph(
        "A CPR Verde é o exemplo mais concreto da tese que orienta o grupo: sustentabilidade como modelo de negócio, não como discurso. Estruturar ativos ambientais com segurança jurídica é o elo que faltava entre o capital que busca impacto verificável e o território que pode entregá-lo — e o Brasil tem, de longe, o maior estoque desse ativo no mundo.",
      ),
    ],
  },
  {
    title: "Mídias sociais e reputação: o ativo invisível dos negócios",
    slug: "midias-sociais-reputacao-ativo-invisivel",
    excerpt:
      "Presença digital deixou de ser vitrine para virar infraestrutura de confiança: como marcas do agro e da indústria constroem reputação — e por que isso vale dinheiro.",
    categories: ["mercado", "institucional"],
    tags: ["mídias sociais", "reputação", "marca"],
    publishedAt: "2026-06-26T09:00:00.000-03:00",
    metaTitle: "Mídias sociais e reputação: o ativo invisível",
    metaDescription:
      "Presença digital virou infraestrutura de confiança: como marcas do agro e da indústria constroem reputação nas mídias sociais — e por que isso vale dinheiro.",
    focusKeyword: "reputação digital",
    faq: [
      {
        question: "Por que empresas B2B precisam de mídias sociais?",
        answer:
          "Porque a diligência de clientes, parceiros, talentos e financiadores começa online: quem não conta a própria história deixa que terceiros a contem.",
      },
      {
        question: "Reputação digital afeta o valor de um negócio?",
        answer:
          "Sim. Confiança reduz atrito comercial, atrai talentos e parceiros e pesa em decisões de crédito e investimento — efeitos que aparecem no resultado e no múltiplo.",
      },
      {
        question: "Qual o erro mais comum das empresas nas redes?",
        answer:
          "Tratar o canal como panfleto: só falar de si, sem constância e sem gerar valor real para a audiência — o que corrói exatamente a credibilidade que se busca construir.",
      },
    ],
    gradient: ["#2c2c28", "#469c5d"],
    body: [
      lexParagraph(
        "Antes de qualquer reunião importante, existe uma busca no Google e uma olhada nas redes. Vale para o cliente avaliando fornecedor, para o talento avaliando empregador, para o banco avaliando crédito e para o investidor avaliando sócio. A presença digital deixou de ser vitrine de marketing: virou a primeira camada da diligência.",
      ),
      lexHeading("Reputação é ativo — e se constrói como um"),
      lexParagraph(
        "Ativos se constroem com consistência, tempo e manutenção. Reputação digital segue a mesma regra: constância de publicação, coerência entre discurso e prática e resposta rápida quando algo sai do roteiro. O efeito composto é silencioso, mas real — cada conteúdo útil publicado hoje continua respondendo perguntas e abrindo portas anos depois.",
      ),
      lexHeading("O que muda para negócios de economia real"),
      lexParagraph(
        "No agro e na indústria, a comunicação digital tem um papel a mais: traduzir operações complexas — uma floresta plantada, uma planta de gaseificação, um título verde — para os públicos que decidem sobre elas sem nunca visitá-las. Quem explica bem o próprio negócio reduz o custo de confiança de toda a cadeia ao redor.",
      ),
      lexHeading("A régua do longo prazo"),
      lexParagraph(
        "Seguidor é métrica de vaidade; confiança é métrica de negócio. A pergunta certa não é quantas curtidas um post teve, e sim se a marca ficou mais fácil de contratar, de financiar e de defender. É com essa régua — a mesma de qualquer investimento do grupo — que tratamos a frente de mídias sociais: um ativo de longo prazo, construído com a paciência que ativos exigem.",
      ),
    ],
  },
];

/** Render a tasteful branded gradient placeholder (1600×900 JPEG). */
async function makeCover(
  payload: Payload,
  slug: string,
  alt: string,
  [from, to]: [string, string],
): Promise<string | number> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.14">
    <circle cx="1290" cy="250" r="150" stroke-width="42"/>
    <circle cx="1290" cy="250" r="260" stroke-width="24"/>
    <circle cx="1290" cy="250" r="360" stroke-width="10"/>
  </g>
  <rect x="90" y="740" width="220" height="10" rx="5" fill="#ffffff" fill-opacity="0.35"/>
</svg>`;
  const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer();
  const media = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: buffer,
      mimetype: "image/jpeg",
      name: `blog-${slug}.jpg`,
      size: buffer.length,
    },
  });
  return media.id as string | number;
}

export async function seedBlogPosts(payload: Payload): Promise<void> {
  const existing = await payload.find({
    collection: "posts",
    limit: 1,
    pagination: false,
  });
  if (existing.docs.length > 0) {
    payload.logger.info("[seed] posts: 1+ already present — skipping");
    return;
  }

  const users = await payload.find({ collection: "users", limit: 20 });
  if (users.docs.length === 0) {
    payload.logger.warn("[seed] posts: no users yet — skipping (needs author)");
    return;
  }
  const author =
    (users.docs as { id: string | number; name?: string | null }[]).find((u) =>
      /wilton/i.test(u.name ?? ""),
    ) ?? (users.docs[0] as { id: string | number });

  for (const p of POSTS) {
    const coverId = await makeCover(
      payload,
      p.slug,
      `Imagem ilustrativa — ${p.title}`,
      p.gradient,
    );
    await payload.create({
      collection: "posts",
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImage: coverId,
        body: buildLexical(p.body),
        author: author.id,
        categories: p.categories,
        tags: p.tags,
        publishedAt: p.publishedAt,
        seo: {
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          ogImage: coverId,
          focusKeyword: p.focusKeyword,
        },
        geo: { faq: p.faq },
        _status: "published",
      } as never,
    });
  }

  payload.logger.info(`[seed] posts: created ${POSTS.length} matérias`);
}
