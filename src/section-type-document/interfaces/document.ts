interface TypeDocument {
    id: string;
    name: string;
    sectionTypeId: string;
  }
  
  export interface SectionType {
    sectionId: string;
    sectionName: string;
    sectionSlug: string;
    typedocument: TypeDocument[];
  }
  
  