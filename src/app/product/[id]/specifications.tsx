import { Product } from "@/types/types";
import * as React from "react";
import { FaAngleRight } from "react-icons/fa";

interface IProductSpeceficationsSectionProps {
  product: Product;
  ref: React.RefObject<HTMLElement>;
}

const ProductSpeceficationsSection: React.FunctionComponent<
  IProductSpeceficationsSectionProps
> = ({ ref, product }) => {
  return (
    <section
      ref={ref}
      className="w-full flex flex-col py-2 px-3 sm:px-0 bg-background space-y-2"
    >
      {/* Header */}
      <div className="flex gap-1 items-center justify-between ">
        <h1 className="text-2xl sm:text-xl font-bold">Specifications</h1>
        <FaAngleRight className="text-muted " size={12} />
      </div>

      {/* Specification Content */}
      <div className="w-full ">
        <div>
          <div className="border-y-border w-full border-y-1 grid grid-cols-2">
            {product?.specifications &&
              Object.keys(product.specifications).length > 0 &&
              Object.keys(product.specifications).map((key) => (
                <div
                  className="cols-span-1 grid grid-cols-12 border-b-1 border-border"
                  key={key}
                >
                  <div className="col-span-3 bg-secondary/20 p-5">
                    <span className="font-semibold">{key}</span>
                  </div>
                  <div className="col-span-9 p-5">
                    <span className="text-muted">
                      {product.specifications[key]}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSpeceficationsSection;
