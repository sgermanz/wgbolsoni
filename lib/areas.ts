// Áreas de atuação da WG Bolsoni — fonte única de verdade.
//
// Mudanças obrigatórias frente ao site original:
//  • "Fertilizantes Organominerais" foi removida e substituída por "Proteína"
//    (links MPA Foods + Chicken HPC 85).
//  • "Biomassa" virou subproduto INTERNO de "Florestamentos" (não é mais
//    uma área separada).
//  • "Meio Ambiente" recebeu um texto NOVO sobre CPR Verde.

export type AreaLink = { label: string; href: string; external?: boolean };

export type Area = {
  slug: string;
  title: string;
  // Resumo curto (cards da home).
  short: string;
  // Parágrafos do corpo da página interna.
  body: string[];
  // Links externos relacionados (parceiros etc.).
  links?: AreaLink[];
  // Itens/subprodutos internos (caso de Florestamentos → Biomassa).
  subitems?: { title: string; body: string }[];
  // Tag pequena exibida no card.
  tag?: string;
};

export const AREAS: Area[] = [
  {
    slug: "proteina",
    title: "Proteína",
    tag: "Nova frente",
    short:
      "Proteína de alto valor biológico — a base da vida e da performance. Em conexão com a MPA Multibrand Foods e a Chicken HPC 85.",
    body: [
      "A proteína é o macronutriente estrutural do organismo — matéria-prima de músculos, pele, enzimas, hormônios e da resposta imunológica. Diferente de outras fontes de energia, os aminoácidos essenciais só são obtidos pela alimentação, o que torna a qualidade da proteína consumida um fator decisivo para saúde, longevidade e desempenho.",
      "Nesse cenário, proteínas de alto valor biológico — que entregam a cadeia completa de aminoácidos essenciais — ganham protagonismo. É uma agenda que conecta nutrição, indústria de alimentos e mercados globais.",
      "A WG Bolsoni atua nessa frente em conexão com a MPA Multibrand Foods, especializada na comercialização de proteína animal e vegetal para o mercado global, e com a Chicken HPC 85, proteína concentrada de peito de frango (85% de teor) produzida por liofilização — processo que preserva nutrientes, sabor e textura, sem aditivos químicos.",
    ],
    links: [
      { label: "MPA Multibrand Foods", href: "https://mpafoods.com/", external: true },
      { label: "Chicken HPC 85", href: "https://chickenhpc85.com.br/", external: true },
    ],
  },
  {
    slug: "florestamentos",
    title: "Florestamentos",
    tag: "Inclui Biomassa",
    short:
      "Produção florestal sustentável como base de geração de renda e ativos ambientais — e a biomassa como subproduto de valor.",
    body: [
      "O florestamento é a espinha dorsal desta frente: produção sustentável que sequestra carbono, recupera áreas degradadas e gera valor econômico ao longo de todo o ciclo da floresta — da muda à colheita planejada.",
      "Conduzimos plantios com manejo técnico e visão de longo prazo, integrando ganhos ambientais (estoque de carbono, recuperação de bacias, biodiversidade) à viabilidade econômica do produtor e à demanda industrial por madeira e celulose.",
    ],
    subitems: [
      {
        title: "Biomassa (subproduto)",
        body:
          "A biomassa florestal é um subproduto de valor econômico e energético do florestamento: aproveita resíduos lenhosos, cascas e galhos que sobram do manejo para gerar energia limpa e calor industrial — sem competir com a floresta em pé e fechando o ciclo com baixa emissão líquida de carbono.",
      },
    ],
  },
  {
    slug: "meio-ambiente",
    title: "Meio Ambiente",
    tag: "CPR Verde",
    short:
      "Conservar pode gerar valor: a CPR Verde transforma floresta em pé em ativo financeiro negociável.",
    body: [
      "A Cédula de Produto Rural Verde (CPR Verde) é um título financeiro que permite ao produtor rural captar recursos lastreados em serviços ambientais — conservação e recuperação de florestas nativas, estoque de carbono da vegetação e demais benefícios ecossistêmicos. Na prática, é o \"pagamento pela floresta em pé\": em vez de prometer a entrega de uma safra futura, o emissor se compromete a manter e recuperar áreas preservadas, e recebe por isso.",
      "O instrumento nasce da modernização da Cédula de Produto Rural (Lei nº 8.929/1994) trazida pela Lei nº 13.986/2020 (Lei do Agro) e regulamentada pelo Decreto nº 10.828/2021, que autorizou a emissão lastreada em ativos ambientais, com certificação por terceira parte e registro em entidade autorizada pelo Banco Central.",
      "A CPR Verde conecta empresas com agenda ESG e investidores a produtores dispostos a conservar — transformando reserva legal, APPs e florestas nativas em ativos ambientais negociáveis. No portfólio da WG Bolsoni, o florestamento e seu subproduto, a biomassa, integram essa mesma lógica de valor: produção sustentável, geração de renda e contribuição efetiva para a redução de emissões.",
      "Mais do que um instrumento financeiro, a CPR Verde sinaliza uma mudança de paradigma: o agro brasileiro deixa de ser visto apenas como produtor de commodities e passa a ser remunerado também pelos serviços ambientais que entrega ao planeta.",
    ],
  },
  {
    slug: "alcoolquimica",
    title: "Alcoolquímica",
    short:
      "A química do etanol como plataforma para insumos renováveis — solventes, polímeros e especialidades de origem vegetal.",
    body: [
      "A alcoolquímica transforma o etanol — energia renovável já produzida em escala no Brasil — em insumos químicos de maior valor agregado: solventes, polímeros, especialidades e blocos de construção para a indústria.",
      "É a ponte natural entre o agronegócio canavieiro e a indústria química descarbonizada — e uma frente estratégica para o país capturar valor adicional na cadeia que já lidera mundialmente.",
    ],
  },
  {
    slug: "energia",
    title: "Energia",
    short:
      "Geração distribuída e fontes renováveis — do plantio energético à entrega de eletricidade limpa para indústria e mercado livre.",
    body: [
      "Atuamos no elo entre fontes renováveis (biomassa florestal, solar, biogás) e a demanda industrial por energia firme e descarbonizada. A pauta combina segurança energética, redução de emissões e geração de renda para o produtor rural.",
      "A diversificação da matriz brasileira, somada à abertura do mercado livre de energia, abre uma janela de oportunidades para projetos integrados de geração distribuída com lastro ambiental.",
    ],
  },
  {
    slug: "gaseificacao-de-residuos",
    title: "Gaseificação de Resíduos",
    short:
      "Resíduos sólidos viram gás de síntese, energia e químicos — tecnologia de transição com forte ganho ambiental.",
    body: [
      "A gaseificação converte resíduos sólidos urbanos, agroindustriais e florestais em gás de síntese — usado para gerar eletricidade, calor industrial ou como matéria-prima petroquímica de origem renovável.",
      "É uma alternativa de alta eficiência aos aterros: reduz volume, neutraliza patógenos, captura carbono e transforma passivo ambiental em fluxo de receita.",
    ],
  },
  {
    slug: "biocombustiveis",
    title: "Biocombustíveis",
    short:
      "Etanol, biodiesel, biometano e SAF — combustíveis renováveis para descarbonizar transporte, indústria e aviação.",
    body: [
      "Os biocombustíveis são a peça mais madura do mosaico renovável brasileiro. Etanol da cana e do milho, biodiesel da soja, biometano de resíduos e SAF (combustível sustentável de aviação) compõem uma agenda de descarbonização com cadeia produtiva já instalada no país.",
      "O RenovaBio e os mandatos crescentes de mistura nos combustíveis fósseis criam um mercado regulado de longo prazo, com CBIOs como instrumento de monetização do desempenho ambiental.",
    ],
  },
  {
    slug: "fibras-celulosicas-papeis",
    title: "Fibras Celulósicas / Papéis",
    short:
      "Da floresta plantada à celulose e ao papel — base de cadeias industriais que o Brasil lidera no mundo.",
    body: [
      "O Brasil é líder global em produtividade florestal e na produção de celulose de eucalipto. As fibras celulósicas alimentam papéis gráficos, embalagens, tissue e, cada vez mais, biomateriais — alternativa renovável a plásticos de origem fóssil.",
      "A integração de florestas plantadas, indústria e logística de exportação consolida o país como referência mundial em bioeconomia baseada em fibras.",
    ],
  },
  {
    slug: "incorporacoes-imobiliarias",
    title: "Incorporações Imobiliárias",
    short:
      "Desenvolvimento imobiliário com olhar de holding — seleção de ativos, estruturação de projetos e gestão patrimonial.",
    body: [
      "Atuamos na originação, estruturação e participação em projetos imobiliários selecionados, com foco em ativos cuja localização, uso e potencial de valorização façam sentido dentro da carteira de longo prazo do grupo.",
    ],
  },
  {
    slug: "midias-sociais",
    title: "Mídias Sociais",
    short:
      "Negócios digitais, criadores e plataformas — a economia da atenção como nova fronteira de investimento.",
    body: [
      "As mídias sociais e a economia de criadores reconfiguraram a forma como marcas, pessoas e capital se relacionam. Acompanhamos essa frente como plataforma de comunicação institucional do grupo e como vetor de oportunidades de investimento em negócios digitais.",
    ],
  },
  {
    slug: "participacoes-investimentos",
    title: "Participações & Investimentos",
    short:
      "Holding de participações: investimos onde nossa convicção setorial, rede de relacionamento e capacidade de execução criam valor.",
    body: [
      "A WG Bolsoni atua como holding de participações, com investimentos diretos e indiretos em empresas dos setores em que enxergamos vantagem competitiva — agronegócio, energia, meio ambiente, indústria e tecnologia.",
      "Mais do que aportar capital, contribuímos com governança, visão setorial e rede de relacionamento para acelerar empresas em estágios e tamanhos diferentes.",
    ],
  },
];

export const areaBySlug = (slug: string) =>
  AREAS.find((a) => a.slug === slug);
