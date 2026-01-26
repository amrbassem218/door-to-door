import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Review from "@/components/ui/review";
import { supabase } from "@/supabase/supabaseClient";
import { Product, ReviewType } from "@/types/types";
import { camel } from "@/utilities";
import * as React from "react";
import { useEffect, useState } from "react";
import { FaAngleRight, FaChevronDown } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";
interface ProductReviewSectionProps {
  product: Product;
  ref: React.RefObject<HTMLElement>;
}

const ProductReviewSection: React.FunctionComponent<
  ProductReviewSectionProps
> = ({ ref, product }) => {
  const sortingTypes = [
    "Most relevant",
    "Latest",
    "Oldest",
    "Low to High",
    "High to low",
  ];

  const [reviewSort, setReviewSort] = useState("Most relevant");
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  useEffect(() => {
    const getReviews = async () => {
      const { data: productReviews, error } = await supabase
        .from("reviews")
        .select("*, profiles(*)")
        .eq("product_id", product.id);
      if (error) {
        console.log("couldn't get product reviews");
        console.error(error);
      } else if (productReviews) {
        setReviews(camel(productReviews));
        console.log(productReviews);
        console.log("id: ", product.id);
      }
    };
    getReviews();
  }, [product]);
  return (
    <section
      ref={ref}
      className="w-full  py-2 px-3 sm:p-0 bg-background sm:space-y-3"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex gap-1 items-center justify-between ">
          <h1 className="text-2xl sm:text-xl font-bold">Reviews</h1>
          <div className="flex gap-1 text-sm items-center">
            <p>See all </p>
            <FaAngleRight className="text-muted " size={12} />
          </div>
        </div>

        {/* Rating */}
        <div className="flex container w-fit items-end">
          <div className="flex container items-center gap-1">
            <p className="text-2xl font-semibold ">{product.rating}</p>
            <Rating
              readonly
              initialValue={product.rating}
              size={20}
              SVGstyle={{ display: "inline-block" }}
              allowFraction
              fillColor=" oklch(0.56 0.14 35)"
              className=""
            />
          </div>
          <p className="text-muted-foreground text-sm">({product.reviewCount})</p>
        </div>

        {/* Sort */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex gap-1 items-center">
                <p className="text-sm">
                  Sort by{" "}
                  <span className="hover:text-secondary font-semibold">
                    {reviewSort}
                  </span>
                </p>
                <FaChevronDown size={12} className="" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortingTypes.map((e) => (
                <DropdownMenuItem onClick={() => setReviewSort(e)}>
                  {e}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Reviews content */}
      <div className="space-y-3">
        {reviews?.map((review) => (
          <Review review={review} />
        ))}
      </div>
    </section>
  );
};

export default ProductReviewSection;
