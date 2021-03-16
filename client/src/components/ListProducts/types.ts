import { IProduct } from "../../containers/Products/types";

export interface IListProductsProps {
  products: IProduct[] | IProduct[];
  onProductAdd?: (product: IProduct) => void;
  onProductRemove?: (index: number) => void;
  removeProduct?: (product_id: any) => void;
}
