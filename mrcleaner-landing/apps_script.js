function doPost(e) {
  // Configuração: Configurar cabeçalhos CORS (embora os Web Apps do GAS resolvam na maioria das vezes, retornamos header de permissão)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // 1. Receber os dados do Frontend (enviados como raw string)
    let body = "";
    if (e.postData && e.postData.contents) {
      body = e.postData.contents;
    } else {
      return ContentService.createTextOutput(JSON.stringify({ error: "Nenhum dado recebido" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(body);
    let photoUrl = "Sem foto";

    // 2. Se houver uma foto (Base64), salvar no Google Drive
    if (data.photoData && data.photoName && data.photoMimeType) {
      const folderId = "1TptjEIEJGu7NJMrZLgLO7BfobPXr5Hl7"; // ID da Pasta fornecido
      const folder = DriveApp.getFolderById(folderId);
      
      // Decodificar Base64
      const decodedData = Utilities.base64Decode(data.photoData);
      const blob = Utilities.newBlob(decodedData, data.photoMimeType, data.firstName + "_" + data.photoName);
      
      // Criar o arquivo
      const file = folder.createFile(blob);
      
      // Obter o link de compartilhamento público
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      photoUrl = file.getUrl();
    }

    // 3. Salvar os dados na Planilha
    const sheetId = "1b-Y3kkaCfHnoilc9ODEK9G-JULwAPrrtzZpLiwK4FMA"; // ID da Planilha fornecido
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    
    // Pega a primeira aba da planilha ou defina pelo nome ex: spreadsheet.getSheetByName("Página1")
    const sheet = spreadsheet.getSheets()[0]; 
    
    // Adiciona uma nova linha com os dados
    sheet.appendRow([
      new Date(),       // A: Data/Hora
      data.firstName,   // B: Nome
      data.lastName,    // C: Sobrenome
      data.whatsapp,    // D: WhatsApp
      data.email,       // E: E-mail
      data.type,        // F: Tipo (Tapete ou Estofado)
      data.length,      // G: Comprimento
      data.width,       // H: Largura
      data.cep,         // I: CEP
      photoUrl          // J: Link da Foto
    ]);

    // Retorna mensagem de Sucesso
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Dados salvos com sucesso!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Retorna mensagem de Erro
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Necessário para requisições de Preflight CORS (OPTIONS)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
