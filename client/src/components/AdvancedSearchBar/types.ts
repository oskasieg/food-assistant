export interface IAdvancedSearchBarValues {
  value: string;
  type: string;
  options?: IFiltersOptions;
}

export interface IAdvancedSearchBarProps {
  changeMode: (mode: "default" | "products" | "recipes") => void;
  mode: "default" | "products" | "recipes";
}

export interface IFiltersProps {
  visible: boolean;
  changeVisible: () => void;
  mode: "default" | "products" | "recipes";
  onSubmit: (options: IFiltersOptions) => void;
}

export interface IFiltersOptions {
  types: string[];
  products?: string[];
  values?: IFilterValues;
  time?: number;
  portions?: number;
}

export interface IType {
  type: string;
  checked: boolean;
  value: string;
}

export interface IFilterValues {
  kcal: {
    min: number;
    max: number;
  };
  carbohydrates: {
    min: number;
    max: number;
  };
  protein: {
    min: number;
    max: number;
  };
  fat: {
    min: number;
    max: number;
  };
}
