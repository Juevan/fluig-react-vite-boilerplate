export enum ConstraintType {
  MUST = 1,
  SHOULD = 2,
  MUST_NOT = 3
}

export interface DatasetConstraint {
  _field: string;
  _initialValue: string;
  _finalValue: string;
  _type: ConstraintType;
  _likeSearch: boolean;
}

export interface DatasetRequest {
  datasetId: string;
  limit?: number;
  fields?: string[];
  searchField?: string;
  searchValue?: string;
  constraints?: DatasetConstraint[];
  sortingFields?: string[];
}

/** Consome um Dataset do Fluig usando a API REST */
export const getDataset = async <T = any>(options: DatasetRequest): Promise<T[]> => {
  const payload = {
    name: options.datasetId,
    fields: options.fields || [],
    constraints: options.constraints || [],
    order: options.sortingFields || []
  };

  const res = await fetch('/api/public/ecm/dataset/datasets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Status ${res.status}`);
  
  const data = await res.json();
  if (data.message && data.message.trim() !== 'OK') throw new Error(data.message);

  // Fluig retorna em formatos diferentes dependendo da versão
  if (Array.isArray(data.content)) return data.content;
  if (data.content && Array.isArray((data.content as any).values)) return (data.content as any).values;
  if (Array.isArray((data as any).values)) return (data as any).values;
  
  return [];
};

/** Helper prático para gerar filtros do Dataset */
export const createConstraint = (
  field: string,
  initialValue: string,
  finalValue: string = initialValue,
  type: ConstraintType = ConstraintType.MUST,
  likeSearch = false
): DatasetConstraint => ({
  _field: field,
  _initialValue: initialValue,
  _finalValue: finalValue,
  _type: type,
  _likeSearch: likeSearch,
});
