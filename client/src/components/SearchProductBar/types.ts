import { IProduct } from "../../containers/Products/types";

export interface ISearchProductBar {
  onProductClick?: (product: IProduct) => void;
}
