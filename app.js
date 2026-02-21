let dados;
let carrinho = [];

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    dados = json;
    renderCategorias();
    renderProdutos();
  });

function renderCategorias() {
  const container = document.getElementById("categorias");
  dados.categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.nome;
    btn.onclick = () => renderProdutos(cat.id);
    container.appendChild(btn);
  });
}

function renderProdutos(categoria = null) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  dados.produtos
    .filter(p => p.disponivel)
    .filter(p => !categoria || p.categoria === categoria)
    .forEach(prod => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${prod.imagem}">
        <div class="card-body">
          <h3>${prod.nome}</h3>
          <p>${prod.descricao}</p>
          <strong>${prod.modoVenda === "peso" ? "R$ " + prod.precoKg + "/kg" : "R$ " + prod.preco.toFixed(2)}</strong>
          <button onclick="adicionar('${prod.id}')">Adicionar</button>
        </div>
      `;

      container.appendChild(card);
    });
}

function adicionar(id) {
  const produto = dados.produtos.find(p => p.id === id);

  let quantidade = 1;

  if (produto.modoVenda === "peso") {
    const peso = prompt("Digite o peso em KG (ex: 1 ou 0.5):");
    if (!peso) return;
    quantidade = parseFloat(peso);
  }

  carrinho.push({ ...produto, quantidade });
  atualizarCarrinho();
}

function atualizarCarrinho() {
  document.getElementById("contador").textContent = carrinho.length;
}

function abrirCarrinho() {
  const modal = document.getElementById("carrinhoModal");
  const itensDiv = document.getElementById("itensCarrinho");
  itensDiv.innerHTML = "";

  let total = 0;

  carrinho.forEach(item => {
    const valor = item.modoVenda === "peso"
      ? item.precoKg * item.quantidade
      : item.preco * item.quantidade;

    total += valor;

    itensDiv.innerHTML += `
      <p>${item.quantidade}x ${item.nome} - R$ ${valor.toFixed(2)}</p>
    `;
  });

  document.getElementById("resumoPedido").innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
  modal.style.display = "flex";
}

function finalizarPedido() {
  let mensagem = "🍖 Pedido - Moraes’s Grill\n\n";

  let total = 0;

  carrinho.forEach(item => {
    const valor = item.modoVenda === "peso"
      ? item.precoKg * item.quantidade
      : item.preco * item.quantidade;

    total += valor;
    mensagem += `${item.quantidade}x ${item.nome} - R$ ${valor.toFixed(2)}\n`;
  });

  mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

  const numero = dados.unidades[0].whatsapp;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}
function scrollCardapio() {
  document.getElementById("produtos").scrollIntoView({
    behavior: "smooth"
  });
}
