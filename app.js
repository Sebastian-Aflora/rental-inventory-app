no let role = "staff";

function login() {
  const pin = document.getElementById("pin").value;

  if (pin === "1234") role = "admin";
  else role = "staff";

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  loadItems();
}

const defaultItems = [
  {room:"Living Room", name:"Sofa"},
  {room:"Kitchen", name:"Plates"},
  {room:"Bedroom", name:"Bed"},
  {room:"Bathroom", name:"Towels"}
];

function loadItems() {
  const apt = document.getElementById("apartment").value;

  db.collection("inventory").doc(apt).onSnapshot(doc => {
    const data = doc.data()?.items || defaultItems;
    render(data);
  });
}

function render(data) {
  const container = document.getElementById("items");
  container.innerHTML = "";

  data.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "item " + (item.status || "");

    div.innerHTML = `
      <b>${item.room}</b><br>
      ${item.name}<br>

      <button onclick="setStatus(${i}, 'ok')">OK</button>
      <button onclick="setStatus(${i}, 'missing')">Missing</button>
      <button onclick="setStatus(${i}, 'damaged')">Damaged</button>

      <input placeholder="Notes" value="${item.notes || ''}" 
      onchange="saveNote(${i}, this.value)">
      
      <button onclick="translateNote(this)">🌍 Translate</button>

      <input type="file" accept="image/*" capture="environment"
      onchange="uploadPhoto(${i}, this.files[0])">

      ${item.photo ? `<img src="${item.photo}">` : ""}
    `;

    container.appendChild(div);
  });
}

function setStatus(i, status) {
  updateItem(i, { status, time: new Date().toLocaleString() });
}

function saveNote(i, notes) {
  updateItem(i, { notes });
}

function uploadPhoto(i, file) {
  const ref = storage.ref("photos/" + Date.now());

  ref.put(file).then(() => {
    ref.getDownloadURL().then(url => {
      updateItem(i, { photo: url });
    });
  });
}

function updateItem(i, changes) {
  const apt = document.getElementById("apartment").value;

  db.collection("inventory").doc(apt).get().then(doc => {
    let items = doc.data()?.items || defaultItems;

    items[i] = { ...items[i], ...changes };

    db.collection("inventory").doc(apt).set({ items });
  });
}

function resetData() {
  if (role !== "admin") return alert("Admin only");

  const apt = document.getElementById("apartment").value;

  db.collection("inventory").doc(apt).set({ items: defaultItems });
}
  
  
function translateNote(btn) {
  const text = btn.previousElementSibling.value;
  const url = "https://translate.google.com/?sl=auto&tl=en&text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}
}