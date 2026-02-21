let config, db;
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

async function init() {
  config = await fetch("../config.json").then(r=>r.json());
  db = await fetch("../data/database.json").then(r=>r.json());

  carregarLoja();
  renderProdutos();
  carregarBairros();
  atualizarContador();
  verificarHorario();
}

function carregarLoja() {
  const loja = config.lojas[config.lojaAtiva];
  document.getElementById("nomeLoja").innerText = loja.nome;
  document.getElementById("slogan").innerText = loja.slogan;
  document.getElementById("desde").innerText = "Desde " + loja.desde;
}

function verificarHorario(){
  const loja = config.lojas[config.lojaAtiva];
  const agora = new Date();
  const horaAtual = agora.getHours() + ":" + agora.getMinutes();

  if(horaAtual < loja.horario.abre || horaAtual > loja.horario.fecha){
    alert("Loja fechada no momento.");
  }
}

function renderProdutos(){
  const container = document.getElementById("produtos");
  db.produtos.forEach(p=>{
    let html = `<div class="card">
    <img src="${p.imagem}">
    <h3>${p.nome}</h3>
    <p>${p.descricao}</p>`;
    p.variacoes.forEach(v=>{
      html += `<button onclick="add('${p.id}','${v.nome}',${v.preco})">
      ${v.nome} - R$ ${v.preco}
      </button>`;
    });
    html += "</div>";
    container.innerHTML += html;
  });
}

function add(id,varNome,preco){
  carrinho.push({id,varNome,preco});
  salvar();
  atualizarContador();
}

function salvar(){
  localStorage.setItem("carrinho",JSON.stringify(carrinho));
}

function atualizarContador(){
  document.getElementById("contador").innerText = carrinho.length;
}

function abrirCarrinho(){
  document.getElementById("modal").style.display="flex";
  renderCarrinho();
}

function fechar(){
  document.getElementById("modal").style.display="none";
}

function limpar(){
  carrinho=[];
  salvar();
  renderCarrinho();
  atualizarContador();
}

function renderCarrinho(){
  let total=0;
  let html="";
  carrinho.forEach((i,index)=>{
    total+=i.preco;
    html+=`${i.varNome} - R$${i.preco}
    <button onclick="remover(${index})">X</button><br>`;
  });

  const taxa = calcularTaxa();
  const totalFinal = total + taxa;

  html+=`<hr>Subtotal: R$${total}
  <br>Taxa: R$${taxa}
  <br><strong>Total: R$${totalFinal}</strong>`;

  document.getElementById("itens").innerHTML=html;
}

function remover(index){
  carrinho.splice(index,1);
  salvar();
  renderCarrinho();
  atualizarContador();
}

function calcularTaxa(){
  const tipo = document.getElementById("tipoEntrega").value;
  if(tipo==="retirada") return 0;
  const bairro = document.getElementById("bairro").value;
  const b = db.bairros.find(x=>x.nome===bairro);
  return b?b.taxa:0;
}

function carregarBairros(){
  const select=document.getElementById("bairro");
  db.bairros.forEach(b=>{
    select.innerHTML+=`<option>${b.nome}</option>`;
  });
}

function finalizar(){
  const loja = config.lojas[config.lojaAtiva];
  let mensagem="Pedido MORAESS GRILL\n\n";
  let total=0;

  carrinho.forEach(i=>{
    mensagem+=`${i.varNome} - R$${i.preco}\n`;
    total+=i.preco;
  });

  const taxa = calcularTaxa();
  total+=taxa;

  mensagem+=`\nTaxa: R$${taxa}
  \nTotal: R$${total}`;

  window.open(`https://wa.me/${loja.telefone}?text=${encodeURIComponent(mensagem)}`);
}

init();
