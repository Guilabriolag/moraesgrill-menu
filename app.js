let totalClicks = 0;

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const menu = document.getElementById("menu");
    const whatsappNumber = data.whatsapp;

    data.categories.forEach(category => {
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "category";

      const title = document.createElement("h2");
      title.innerText = category.name;
      categoryDiv.appendChild(title);

      category.products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";

        productDiv.innerHTML = `
          <h3>${product.name}</h3>
          <p class="price">R$ ${product.price.toFixed(2)}</p>
          <button onclick="order('${product.name}', ${product.price}, '${whatsappNumber}')">Pedir</button>
        `;

        categoryDiv.appendChild(productDiv);
      });

      menu.appendChild(categoryDiv);
    });
  });

function order(name, price, number) {
  totalClicks++;
  const message = `Olá! Gostaria de pedir: ${name} - R$ ${price.toFixed(2)}`;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
