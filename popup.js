const storage = chrome.storage.sync;

// Load saved links
function loadLinks() {
  storage.get({ links: {} }, (data) => {
    const links = data.links;
    const linksDiv = document.getElementById("links");
    linksDiv.innerHTML = "";

    for (let platform in links) {
      const url = links[platform];

      const row = document.createElement("div");
      row.className = "link-row";

      const span = document.createElement("span");
      span.textContent = platform;

      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(url);
        alert(`${platform} link copied!`);
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => {
        delete links[platform];
        storage.set({ links }, loadLinks);
      };

      row.appendChild(span);
      row.appendChild(copyBtn);
      row.appendChild(delBtn);
      linksDiv.appendChild(row);
    }
  });
}

// Add new link
document.getElementById("addForm").onsubmit = (e) => {
  e.preventDefault();
  const platform = document.getElementById("platform").value.trim();
  const url = document.getElementById("url").value.trim();

  if (!platform || !url) return;

  storage.get({ links: {} }, (data) => {
    const links = data.links;
    links[platform] = url;
    storage.set({ links }, () => {
      document.getElementById("platform").value = "";
      document.getElementById("url").value = "";
      loadLinks();
    });
  });
};

// Load on startup
loadLinks();
