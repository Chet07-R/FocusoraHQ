function uploadNotesFile() {
  const fileInput = document.getElementById('uploadNotes');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file to upload.');
    return;
  }

  const list = document.getElementById('uploaded-notes-list');

  // Create a new list item with file name and download link
  const li = document.createElement('li');
  li.className = "hover:text-blue-700 cursor-pointer truncate";
  li.textContent = file.name;

//   Optional: If you want download link for demo purposes
//   const url = URL.createObjectURL(file);
//   li.innerHTML = `<a href="${url}" download>${file.name}</a>`;

  list.appendChild(li);

  // Clear input
  fileInput.value = '';
}
