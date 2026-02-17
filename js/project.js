import { db } from "./firebase.js";
import { doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const docRef = doc(db, "projects", id);
const snap = await getDoc(docRef);

if (snap.exists()) {
  const data = snap.data();

  document.getElementById("title").textContent = data.title;
  document.getElementById("description").textContent = data.description;

  const gallery = document.getElementById("gallery");

  data.images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    gallery.appendChild(img);
  });
}
