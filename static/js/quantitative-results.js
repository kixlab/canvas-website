function addQuantitativeTableListeners() {
  var quantTaskButtons = document.querySelectorAll(
    '.quant-task-button[data-task="replication"], .quant-task-button[data-task="modification"]',
  );
  var replicationTable = document.getElementById("replication-table");
  var modificationTable = document.getElementById("modification-table");

  if (!quantTaskButtons.length || !replicationTable || !modificationTable)
    return;

  quantTaskButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var task = this.getAttribute("data-task");

      quantTaskButtons.forEach(function (btn) {
        btn.classList.remove("is-primary");
      });

      this.classList.add("is-primary");

      if (task === "replication") {
        replicationTable.style.display = "block";
        modificationTable.style.display = "none";
      } else if (task === "modification") {
        replicationTable.style.display = "none";
        modificationTable.style.display = "block";
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addQuantitativeTableListeners);
} else {
  addQuantitativeTableListeners();
}
