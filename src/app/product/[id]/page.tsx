"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CartSheet from "@/components/ui/cartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductHighLight from "@/components/ui/productHighlightSection";
import ProductSideBar from "@/components/ui/productSideBar";
import Review from "@/components/ui/review";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SimialrProducts from "@/components/ui/similarProducts";
import { useCurrencyRates } from "@/getRates";
import { supabase } from "@/supabase/supabaseClient";
import type { Product, ReviewType } from "@/types/types";
import { getProfile } from "@/userContext";
import { camel, measurements, newPrice, unitChange } from "@/utilities";
import { getProduct } from "@/utils/products-utils";
import Link from "next/link";
import * as React from "react";
import { use, useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaAngleRight, FaLocationDot } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { Rating } from "react-simple-star-rating";
import Error from "../../error/page";

interface IProductProps {
  params: Promise<{
    id: string;
  }>;
}

const ProductListing: React.FunctionComponent<IProductProps> = ({ params }) => {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("Customer Reviews");
  const [reviewSort, setReviewSort] = useState("Most relevant");
  const [product, setProduct] = useState<Product>();
  const [measurement, setMeasurement] = useState(measurements[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const [isCrop, setIsCrop] = useState(false);
  const { rates, loading } = useCurrencyRates();
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewType[]>();

  const reviewsRef = useRef<HTMLElement>(null);
  const specificationsRef = useRef<HTMLElement>(null);
  const descriptionRef = useRef<HTMLElement>(null);
  const storeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setUserCurrency(userProfile?.userProfile?.currencies.currencyCode ?? "USD");
  }, [userProfile?.userProfile?.currencies.currencyCode]);
  useEffect(() => {
    if (product) {
      setMeasurement(
        localStorage.getItem(`${product.id}_measurement`) ?? measurements[0]
      );
      console.log("ma ho by7sl");
      if (localStorage.getItem(`${product?.id}_quantity`)) {
        setQuantity(
          Number(localStorage.getItem(`${product?.id}_quantity`)) ??
            product?.minOrder ??
            1
        );
      }

      const getReviews = async () => {
        const { data: productReviews, error } = await supabase
          .from("reviews")
          .select("*, profiles(*)")
          .eq("product_id", id);
        if (error) {
          console.log("couldn't get product reviews");
          console.error(error);
        } else if (productReviews) {
          setReviews(camel(productReviews));
          console.log(productReviews);
          console.log("id: ", id);
        }
      };
      getReviews();
    }
  }, [product]);

  useEffect(() => {
    if (product && quantity) {
      localStorage.setItem(`${product?.id}_quantity`, quantity.toString());
    }
  }, [quantity]);

  useEffect(() => {
    if (product && measurement) {
      localStorage.setItem(`${product?.id}_measurement`, measurement);
    }
  }, [measurement]);

  const sortingTypes = [
    "Most relevant",
    "Latest",
    "Oldest",
    "Low to High",
    "High to low",
  ];
  const handleMeasurementChange = (mes: string) => {
    const converted = unitChange(quantity, measurement, mes);
    const minOrderOfNewUnit = unitChange(product?.minOrder ?? 0, "kg", mes);
    // if(converted < minOrderOfNewUnit){
    //     converted = minOrderOfNewUnit;
    // }
    setQuantity(Number(converted));
    setMeasurement(mes);
  };

  const handleQuantityChange = (type: string) => {
    if (type == "plus") {
      setQuantity(quantity + 1);
    } else if (type == "minus") {
      setQuantity(quantity - 1);
    } else {
      setQuantity(Number(type));
    }
  };

  useEffect(() => {
    if (id) {
      const handleGetProduct = async () => {
        let productInfo = await getProduct(Number(id));
        productInfo = camel(productInfo);
        setProduct(productInfo);
        setIsCrop(productInfo.tags?.includes("crops"));
        setQuantity(productInfo?.minOrder ?? 1);
      };
      handleGetProduct();
    }
  }, [id]);
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);

    // Calculate header height dynamically
    const headerElement =
      document.querySelector("header") ||
      document.querySelector('[class*="fixed"][class*="top-0"]');
    if (headerElement) {
      setHeaderHeight(headerElement.getBoundingClientRect().height);
    }
  }, [product]);

  // Also update header height on window resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement =
        document.querySelector("header") ||
        document.querySelector('[class*="fixed"][class*="top-0"]');
      if (headerElement) {
        setHeaderHeight(headerElement.getBoundingClientRect().height);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Add scroll listener for tab activation
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { name: "Customer Reviews", ref: reviewsRef },
        { name: "Specifications", ref: specificationsRef },
        { name: "Full Description", ref: descriptionRef },
        { name: "About Store", ref: storeRef },
      ];

      const scrollPosition = window.scrollY + headerHeight + 60; // Add offset for sticky nav

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveTab(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerHeight]);

  // Add click handler for tab navigation
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);

    const sectionRefs = {
      "Customer Reviews": reviewsRef,
      Specifications: specificationsRef,
      "Full Description": descriptionRef,
      "About Store": storeRef,
    };

    const targetRef = sectionRefs[tabName as keyof typeof sectionRefs];
    if (targetRef.current) {
      const offsetTop = targetRef.current.offsetTop - headerHeight - 10;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  if (!product) {
    return <Error />;
  }

  if (loading) return <p>loading...</p>;
  return (
    <div className="grid grid-cols-32 w-full sm:px-5 sm:py-5">
      <div className="bg-gray-100 sm:bg-background flex flex-col gap-2 sm:mb-0 sm:col-span-25 col-span-32 relative px-2">
        {/* Main description of prod */}
        <div className="gap-10 flex flex-col bg-background">
          {/* Product Main */}
          <div className="flex flex-col sm:flex-row gap-5 border-b-1 px-3">
            {/* Images */}
            <div className="gap-2 sm:flex hidden">
              {/* Images sideBar */}
              <ScrollArea className="w-20 h-90 ">
                <div className="flex flex-col gap-1">
                  {product.images.map((image, i) => (
                    <div
                      key={i}
                      className={`w-20 h-20 border-1 flex justify-center items-center ${
                        currentImage == i && "border-primary"
                      } cursor-pointer`}
                      onClick={() => setCurrentImage(i)}
                    >
                      <img
                        loading="lazy"
                        src={`${image}`}
                        alt=""
                        className="object-contain h-full max-w-full "
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {/* Main image */}
              <div className="w-90 h-90 border-1 flex justify-center items-center ">
                <img
                  loading="lazy"
                  src={`${product.images[currentImage]}`}
                  alt=""
                  className="object-contain h-full max-w-full "
                />
              </div>
            </div>

            {/* Images for phone */}
            <div className="">
              <Carousel className="w-full h-70 border-1 sm:hidden overflow-visible">
                <CarouselContent className="flex gap-2">
                  {product.images.map((image, i) => (
                    <CarouselItem
                      key={i}
                      className="basis-[80%] h-70 shrink-0 flex items-center justify-center"
                    >
                      <img
                        loading="lazy"
                        src={image}
                        alt=""
                        className="object-contain max-w-full h-full rounded-md"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Product Main Description */}
            <div className="">
              <div className="mb-2">
                <h1 className="text-xl font-semibold">{product.name}</h1>
                {/* Rating and Stock */}
                <div className="flex items-end gap-1">
                  <Rating
                    readonly
                    initialValue={product.rating}
                    size={25}
                    SVGstyle={{ display: "inline-block" }}
                    allowFraction // allows values like 3.5 stars
                  />
                  <p className="text-md font-normal text-gray-600">
                    ({product?.reviewCount ?? 0}) reviews |{" "}
                  </p>
                  <p
                    className={`text-md font-normal ${
                      product?.stockCount || isCrop
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product?.stockCount || isCrop
                      ? "In stock"
                      : "Out of stock"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {!isCrop && (
                  <h1 className="text-2xl">
                    {newPrice(product, userCurrency, rates, 1, measurement)}{" "}
                    {userCurrency}{" "}
                    <span className="text-muted text-sm">
                      (per {measurement})
                    </span>
                  </h1>
                )}
                <p>{product.description}</p>
              </div>
              <div className="mt-2 border-b-2"></div>
            </div>
          </div>
        </div>

        {/* Bottom bar for mobile */}
        <div className="sm:hidden fixed bottom-0 left-0 h-12 border-t-1 w-full bg-background flex items-center gap-4 px-2 z-10 ">
          <div className="flex  gap-2">
            <Link href={"/cart"}>
              <LuShoppingCart className="text-muted text-2xl" />
            </Link>
          </div>
          <div className="flex gap-2 w-full">
            <CartSheet product={product} quantity={quantity} styles="w-30" />
            {isCrop ? (
              <Button className="m-auto flex-1 border-1 ">
                Contact Seller
              </Button>
            ) : (
              <Button className="m-auto flex-1 border-1 ">Buy Now</Button>
            )}
          </div>
        </div>
        {/* Tabs for pc */}
        <nav
          className="hidden sm:flex items-center bg-background sm:mt-5 sticky z-40 h-10  "
          style={{ top: `${headerHeight}px` }}
        >
          <ul className="flex gap-4 text-muted cursor-pointer mx-5 sm:mx-0 text-sm">
            {[
              "Customer Reviews",
              "Specifications",
              "Full Description",
              "About Store",
            ].map((e, i) => {
              return e == activeTab ? (
                <li key={i} className="flex items-center text-black font-bold ">
                  <FaLocationDot size={15} />
                  {e}
                </li>
              ) : (
                <li
                  key={i}
                  onClick={() => handleTabClick(e)}
                  className="hover:text-secondary transition-colors"
                >
                  {e}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Review Section*/}
        <section
          ref={reviewsRef}
          className="w-full h-50 sm:h-150 py-2 px-3 sm:p-0 bg-background sm:space-y-3"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="flex gap-1 items-center justify-between ">
              <h1 className="text-lg sm:text-xl font-normal">Reviews</h1>
              <div className="flex gap-1 text-sm items-center">
                <p>See all </p>
                <FaAngleRight className="text-muted " size={12} />
              </div>
            </div>

            {/* Rating */}
            <div className="flex container items-center gap-1">
              <p className="text-2xl font-bold ">{product.rating}</p>
              <Rating
                readonly
                initialValue={product.rating}
                size={20}
                SVGstyle={{ display: "inline-block" }}
                allowFraction
                className=""
              />
              <p>({product.reviewCount})</p>
            </div>

            {/* Sort */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex gap-1 items-center">
                    <p className="text-sm">
                      Sort by{" "}
                      <span className="hover:text-secondary">{reviewSort}</span>
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

        <Separator />

        {/* Specification Section */}
        <section
          ref={specificationsRef}
          className="w-full flex flex-col h-62 py-2 px-3 sm:px-0 bg-background space-y-2"
        >
          {/* Header */}
          <div className="flex gap-1 items-center justify-between ">
            <h1 className="text-lg sm:text-xl font-normal">Specifications</h1>
            <FaAngleRight className="text-muted " size={12} />
          </div>

          {/* Specification Content */}
          <div className="w-full flex-1 bg-gray-100"></div>
        </section>

        <Separator />

        {/* Full Description Section */}
        {/* <section ref={descriptionRef} className='w-full flex flex-col py-2 px-3 sm:px-0 bg-background space-y-2'>
                <div className='flex gap-1 items-center justify-between '>
                    <h1 className='text-lg sm:text-xl font-normal'>Full Description</h1>
                    <FaAngleRight className='text-muted ' size={12}/>
                </div>

                <div className='w-full bg-gray-100 p-4'>
                    <p>{product.description}</p>
                </div>
            </section>
             */}
        <Separator />

        {/* About Store Section */}
        <section
          ref={storeRef}
          className="w-full flex flex-col py-2 px-3 sm:px-0 bg-background space-y-2"
        >
          {/* Header */}
          <div className="flex gap-1 items-center justify-between ">
            <h1 className="text-lg sm:text-xl font-normal">About Store</h1>
            <FaAngleRight className="text-muted " size={12} />
          </div>

          {/* Store Content */}
          <div className="w-full bg-gray-100 p-4">
            {/* Add store information content here */}
            <p>Store information and details...</p>
          </div>
        </section>

        <Separator />

        {/* Highlights Section */}
        <section className="w-full flex flex-col  py-2 px-3 sm:px-0 bg-background space-y-2">
          {/* Header */}
          <div className="flex gap-1 items-center justify-between ">
            <h1 className="text-lg sm:text-xl font-normal">Highlights</h1>
            {/* <FaAngleRight className='text-muted ' size={12}/> */}
          </div>

          {/* Highlights Content */}
          <div className="">
            <ProductHighLight
              text={
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore sunt veritatis repellendus tempore accusantium consequuntur enim ducimus quo cum minima quibusdam odit deleniti excepturi quaerat possimus aspernatur ullam, beatae omnis quia mollitia inventore voluptate quos laborum! Cumque quae eos eligendi tempore laudantium quidem, voluptates natus accusantium iure dicta maiores totam molestias illum adipisci earum sapiente quibusdam libero excepturi animi fugit cupiditate nihil quas deleniti blanditiis! Facilis, voluptates rem ut, maxime, quo omnis ea repellat fuga dicta at perspiciatis quibusdam! Quae, inventore amet? Hic dolor voluptates unde odio sapiente dolore, aperiam sunt nostrum distinctio ex maxime beatae provident deleniti natus error."
              }
            />
          </div>
        </section>

        <Separator />

        <div>
          <SimialrProducts product={product} />
        </div>
      </div>
      {/* Right sideBar for pc*/}
      <div className="hidden sm:block sm:col-span-7">
        <ProductSideBar
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          measurement={measurement}
          setMeasurement={setMeasurement}
          handleMeasurementChange={handleMeasurementChange}
          handleQuantityChange={handleQuantityChange}
          headerHeight={headerHeight}
        />
      </div>
    </div>
  );
};

export default ProductListing;
