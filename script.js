const products = [
  {
    name: "Copper Building Wire",
    category: "building",
    tag: "Residential",
    icon: "plug-zap",
    description: "PVC insulated single-core copper wire for lighting, sockets, DB wiring, and everyday electrical installation.",
    specs: ["1.0-16mm", "PVC", "Coils"]
  },
  {
    name: "Flexible Copper Cable",
    category: "building",
    tag: "Contractor favourite",
    icon: "route",
    description: "Fine-stranded flexible cable for appliances, control panels, extensions, and tight routing conditions.",
    specs: ["2-5 core", "Flexible", "Copper"]
  },
  {
    name: "Armoured Power Cable",
    category: "power",
    tag: "Heavy duty",
    icon: "shield",
    description: "XLPE/PVC insulated armoured cables for main feeders, underground runs, and industrial distribution.",
    specs: ["600V-33kV", "SWA", "Drums"]
  },
  {
    name: "Solar DC Cable",
    category: "power",
    tag: "Energy",
    icon: "sun",
    description: "UV-resistant DC cable for solar panels, inverters, combiner boxes, and outdoor rooftop installations.",
    specs: ["UV rated", "DC", "Red/Black"]
  },
  {
    name: "Control Cable",
    category: "industrial",
    tag: "Automation",
    icon: "sliders-horizontal",
    description: "Multi-core control cable for machine panels, instrumentation, signals, and factory automation circuits.",
    specs: ["Multi-core", "Numbered", "Shielded"]
  },
  {
    name: "Bare Copper Conductor",
    category: "industrial",
    tag: "Earthing",
    icon: "waves",
    description: "Bare copper conductor for grounding, bonding, lightning protection, and electrical infrastructure work.",
    specs: ["Annealed", "Stranded", "Earth"]
  },
  {
    name: "Cat6 Network Cable",
    category: "data",
    tag: "Data",
    icon: "network",
    description: "Structured cabling for offices, CCTV networks, routers, access points, and high-speed LAN installations.",
    specs: ["Cat6", "UTP/STP", "305m"]
  },
  {
    name: "Coaxial Cable",
    category: "data",
    tag: "Signal",
    icon: "radio",
    description: "Coaxial cable for CCTV, RF, television distribution, and low-loss signal transmission projects.",
    specs: ["RG types", "Shielded", "CCTV"]
  },
  {
    name: "Fire Resistant Cable",
    category: "industrial",
    tag: "Safety",
    icon: "flame-kindling",
    description: "Circuit integrity cable options for emergency lighting, alarms, public buildings, and critical services.",
    specs: ["LSZH", "FR", "Emergency"]
  }
];

const productGrid = document.querySelector("[data-product-grid]");
const filterButtons = document.querySelectorAll("[data-filter]");
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-contact-form]");
const statusEl = document.querySelector("[data-form-status]");

function renderProducts(category = "all") {
  const visibleProducts = category === "all"
    ? products
    : products.filter((product) => product.category === category);

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-top">
        <span class="product-icon"><i data-lucide="${product.icon}"></i></span>
        <span class="tag">${product.tag}</span>
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-specs">
        ${product.specs.map((spec) => `<span>${spec}</span>`).join("")}
      </div>
    </article>
  `).join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.filter);
  });
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader);
updateHeader();

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  header.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    header.classList.remove("open");
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Sending enquiry...";
  statusEl.className = "form-status";

  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to submit enquiry.");
    }

    form.reset();
    statusEl.textContent = `Thanks. Your enquiry was saved with ID ${result.enquiryId}.`;
    statusEl.classList.add("success");
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.classList.add("error");
  }
});

renderProducts();

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
