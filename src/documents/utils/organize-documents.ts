import { Document } from '../entities/document.entity';

export function groupDocumentsBySection(documents: Document[]) {
  // Creamos un objeto para almacenar las secciones agrupadas
  // const groupedBySection: { [key: string]: any } = {};
  // documents.forEach((doc) => {
  //   const sectionId = doc.sectionTypeDocument.section.id;
  //   const sectionName = doc.sectionTypeDocument.section.sectionName;
  //   const typeDocumentName = doc.sectionTypeDocument.typeDocument.name;
  //   // Si la sección aún no existe en el objeto agrupado, la inicializamos
  //   if (!groupedBySection[sectionId]) {
  //     groupedBySection[sectionId] = {
  //       sectionName: sectionName,
  //       documents: [],
  //     };
  //   }
  //   // Añadimos el documento a la lista de documentos de esa sección
  //   groupedBySection[sectionId].documents.push({
  //     id: doc.id,
  //     fileUrl: doc.fileUrl,
  //     status: doc.status,
  //     typeDocument: typeDocumentName,
  //   });
  // });
  // // Convertimos el objeto agrupado a un array si se necesita un formato más accesible
  // return Object.values(groupedBySection);
}
