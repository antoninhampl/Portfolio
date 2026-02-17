import { db, storage, auth } from "./firebase.js";

import { signInWithEmailAndPassword, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { addDoc, collection, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let coverFile = null;
let galleryFiles = [];

const coverDrop = document.getElementById("coverDrop");
const galleryDrop = document.getElementById("galleryDrop");

function setupDropZone(element, multiple = false) {
  element.addEventListener("dragover", e => {
    e.preventDefault();
    element.classList.add("dragover");
  });

  element.addEventListener("dragleave", () => {
    element.classList.remove("dragover");
  });

  element.addEventListener("drop", e => {
    e.preventDefault();
    element.classList.remove("dragover");

    const files = Array.from(e.dataTransfer.files);

    if (multiple) {
      galleryFiles = files;
      element.textContent = `${files.length} file(s) selected`;
    } else {
      coverFile = files[0];
      element.textContent = coverFile.name;
    }
  });
}

setupDropZone(coverDrop, false);
setupDropZone(galleryDrop, true);

/* Auth */

document.getElementById("loginBtn").onclick = async () => {
  const email = email.value;
  const password = password.value;
  await signInWithEmailAndPassword(auth, email, password);
  login.style.display = "none";
  adminPanel.style.display = "block";
};

document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  location.reload();
};

/* Add Project */

document.getElementById("addBtn").onclick = async () => {

  const title = titleInput.value;
  const description = descInput.value;

  const timestamp = Date.now();

  const coverRef = ref(storage, `projects/${timestamp}_${coverFile.name}`);
  await uploadBytes(coverRef, coverFile);
  const coverURL = await getDownloadURL(coverRef);

  const imageURLs = [];

  for (let file of galleryFiles) {
    const imageRef = ref(storage, `projects/${timestamp}_${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    imageURLs.push(url);
  }

  await addDoc(collection(db, "projects"), {
    title,
    description,
    coverImage: coverURL,
    images: imageURLs,
    createdAt: serverTimestamp()
  });

  alert("Project added.");
  location.reload();
};
