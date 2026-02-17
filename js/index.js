import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const grid = document.querySelector(".grid");

const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
const snapshot = await getDocs(q);

snapshot.forEach(doc => {
  const data = doc.data();

  const card = document.createElement("a");
  card.href = `project.html?id=${doc.id}`;
  card.className = "project-card";

  card.innerHTML = `
    <div class="square">
      <img src="${data.coverImage}">
    </div>
    <div class="project-title">${data.title}</div>
  `;

  grid.appendChild(card);
});
