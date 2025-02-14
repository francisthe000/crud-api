const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Matriz");

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

// Função para pegar todos os itens
function getItems() {
  const data = sheet.getDataRange().getValues();
  const items = [];
  for (let i = 1; i < data.length; i++) {
    items.push({
      id: data[i][0],
      piso: data[i][1],
      codigo: data[i][2],
      corredor: data[i][3],
      prateleira: data[i][4],
      data: data[i][5]
    });
  }
  return items;
}

// Função para pegar um item específico
function getItem(id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      return {
        id: data[i][0],
        piso: data[i][1],
        codigo: data[i][2],
        corredor: data[i][3],
        prateleira: data[i][4],
        data: data[i][5]
      };
    }
  }
  return null;
}

// Função para adicionar um novo item
function addItem(id, piso, codigo, corredor, prateleira, data) {
  sheet.appendRow([id, piso, codigo, corredor, prateleira, data]);
}

// Função para excluir um item
function deleteItem(id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);  // Deleta a linha
      break;
    }
  }
}

// Função para atualizar um item existente
function updateItem(id, piso, codigo, corredor, prateleira, data) {
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] == id) {  // Encontramos o item com o ID correspondente
      // Atualiza os valores na linha correta
      sheet.getRange(i + 1, 2).setValue(piso);
      sheet.getRange(i + 1, 3).setValue(codigo);
      sheet.getRange(i + 1, 4).setValue(corredor);
      sheet.getRange(i + 1, 5).setValue(prateleira);
      sheet.getRange(i + 1, 6).setValue(data);
      break;
    }
  }
}
