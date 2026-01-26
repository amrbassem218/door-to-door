"use client";
import ListProd from "@/components/home/ListProds";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CartSheet from "@/components/ui/cartSheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ProductSideBar from "@/components/ui/productSideBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUserCurrencyCode } from "@/contexts/currencyContext";
import { useCurrencyRates } from "@/getRates";
import type { FullPrice, Product } from "@/types/types";
import {
  calcDiscount,
  camel,
  measurements,
  newPrice,
  price,
  unitChange,
} from "@/utilities";
import { getProduct } from "@/utils/products-utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { use, useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleRight, FaLocationDot, FaTicket } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { Rating } from "react-simple-star-rating";
import Error from "../../error/page";
import ProductReviewSection from "./reviews";
import ProductSpeceficationsSection from "./specifications";
interface IProductProps {
  params: Promise<{
    id: string;
  }>;
}

const ProductListing: React.FunctionComponent<IProductProps> = ({ params }) => {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("Customer Reviews");
  const [product, setProduct] = useState<Product>();
  const [measurement, setMeasurement] = useState(measurements[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isCrop, setIsCrop] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedFilters, setSelecetdFilters] = useState<
    Record<string, number>
  >({});
  const [productFullPrice, setProductFullPrice] = useState<FullPrice>({
    oldPrice: 0,
    newPrice: 0,
    discount: 0,
  });
  const { rates, loading } = useCurrencyRates();
  const userCurrencyCode = useUserCurrencyCode();

  const reviewsRef = useRef<HTMLElement>(null);
  const specificationsRef = useRef<HTMLElement>(null);
  const moreToLoveRef = useRef<HTMLElement>(null);
  const storeRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const sections = [
    { name: "Customer Reviews", ref: reviewsRef },
    { name: "Specifications", ref: specificationsRef },
    { name: "About Store", ref: storeRef },
    { name: "More to love", ref: moreToLoveRef },
  ];

  useEffect(() => {
    if (id) {
      const handleGetProduct = async () => {
        let productInfo = await getProduct(Number(id));
        productInfo = camel(productInfo);
        setProduct(productInfo);
        setIsCrop(productInfo.tags?.includes("crops"));
        setQuantity(productInfo?.minOrder ?? 1);
        setSelecetdFilters(product.filters);
      };
      handleGetProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const productOldPrice = price(
        product,
        userCurrencyCode,
        rates,
        1,
        measurement,
      );

      const productNewPrice = newPrice(
        product,
        userCurrencyCode,
        rates,
        1,
        measurement,
      );

      const productDiscount = calcDiscount(productOldPrice, productNewPrice);
      setProductFullPrice({
        oldPrice: productOldPrice,
        newPrice: productNewPrice,
        discount: productDiscount,
      });
    }
  }, [product, userCurrencyCode, rates, measurement]);
  useEffect(() => {
    if (product) {
      setMeasurement(
        localStorage.getItem(`${product.id}_measurement`) ?? measurements[0],
      );
      if (localStorage.getItem(`${product?.id}_quantity`)) {
        setQuantity(
          Number(localStorage.getItem(`${product?.id}_quantity`)) ??
            product?.minOrder ??
            1,
        );
      }
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

  // Add scroll listener for tab activation
  useEffect(() => {
    const handleScroll = () => {
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
      "More to love": moreToLoveRef,
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
    <div className="grid grid-cols-32 w-full sm:py-5 px-8 overflow-x-hidden gap-5 max-w-450 mx-auto ">
      <div className="bg-gray-100 sm:bg-background flex flex-col gap-2 sm:mb-0 col-span-32 sm:col-span-25 relative ">
        {/* Product Main */}
        {/* Main description */}
        <div className="flex flex-col sm:flex-row gap-5 ">
          {/* Images */}
          <div className="gap-3 hidden sm:flex">
            {/* Images sideBar */}
            <ScrollArea className="w-20 h-120 ">
              <div className="flex flex-col gap-4">
                {product.gallery.map((image, i) => (
                  <div
                    key={i}
                    className={`w-20 h-20  flex justify-center items-center ${
                      currentImage == i && "border-primary"
                    } cursor-pointer overflow-hidden border-1 `}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img
                      loading="lazy"
                      src={`${image}`}
                      alt=""
                      className="object-contain w-full"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
            {/* Main image */}
            <div className="w-120 h-120 flex justify-center items-center overflow-hidden">
              <img
                loading="lazy"
                src={`${product.gallery[currentImage]}`}
                alt=""
                className={`w-full h-full object-cover`}
              />
            </div>
          </div>

          {/* Images for phone */}
          <div className="sm:hidden">
            <Carousel className="w-full h-70 border-1 overflow-visible">
              <CarouselContent className="flex gap-2">
                {product.gallery.map((image, i) => (
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

          <div className="flex flex-col gap-4 min-w-0 flex-1">
            {/* Main product Info */}
            <div className="space-y-3">
              {/* Title and ratings */}
              <div className="">
                {/* Header */}
                <h1 className="text-2xl font-bold">{product.name}</h1>

                {/* Rating and Stock */}
                <div className="flex items-end gap-1">
                  <p className="text-md font-medium">
                    {product.rating.toFixed(1)}
                  </p>

                  <Rating
                    readonly
                    initialValue={product.rating}
                    size={18}
                    SVGstyle={{ display: "inline-block" }}
                    allowFraction // allows values like 3.5 stars
                    fillColor=" oklch(0.56 0.14 35)"
                  />
                  <p className="text-sm font-normal text-gray-600">
                    ({product?.reviewCount ?? 0}) reviews |{" "}
                  </p>
                  <p
                    className={`text-sm font-normal ${
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

              {/* Product Price */}
              <div className="space-y-2">
                {!isCrop && (
                  <div>
                    <p className="text-xl flex items-end gap-1">
                      {product.discount > 0 && (
                        <span className="text-secondary mr-1">
                          -{productFullPrice.discount}%
                        </span>
                      )}
                      <span className="font-bold ">
                        {userCurrencyCode} {productFullPrice.newPrice}{" "}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        (per {measurement})
                      </span>
                    </p>
                    <p className="text-muted-foreground flex gap-1">
                      Was:
                      <span className="line-through">
                        {userCurrencyCode} {product.priceBefore}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* VAT & Returns */}
              <div>
                {/* VAT */}
                <p className="text-muted-foreground text-sm font-medium">
                  All prices don’t include VAT
                </p>

                {/* Returns */}
                <Popover>
                  <PopoverTrigger>
                    <div className="text-primary text-left hover:underline decoration-1 cursor-pointer flex items-center gap-1">
                      International Returns
                      <FaAngleDown />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="space-y-1">
                    <h1 className="font-bold">Return this item </h1>
                    <p className="text-sm">
                      International returns are available for the shipping
                      address you chose. You can return the item for any reason
                      in new and unused condition: return shipping charges may
                      apply.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Coupon */}
              <div className="bg-secondary/20 w-full h-9 rounded-sm p-2 px-3 flex items-center justify-between text-secondary">
                {/* Left part */}
                <div className="flex items-center gap-2 ">
                  <FaTicket />
                  {/* TODO: Change with an actual copoun */}
                  <p>
                    {userCurrencyCode}100 off on {userCurrencyCode}800 order
                  </p>
                </div>
                <FaAngleRight />
              </div>
            </div>

            <Separator orientation="horizontal" className="w-full " />

            {/* (optional) Extra options and selling points */}
            <div>
              {/* TODO: Add actual filters */}

              {/* 1-2 Filters (color, size, model, material) */}
              <div>
                <div className="space-y-2">
                  {/* Filter header */}
                  <div className="flex items-center gap-1">
                    <h3 className="text-muted-foreground">Color: </h3>
                    <span className="text-text font-semibold">
                      Purple & White
                    </span>
                  </div>

                  {/* Choices */}
                  <div>
                    <div className="flex gap-4">
                      {product.gallery.map((image, i) => {
                        return (
                          i < 4 && (
                            <div
                              key={i}
                              // TODO: use actual filters
                              className={`w-20 h-20  flex justify-center items-center ${i == 0 && "border border-blue-500"} cursor-pointer overflow-hidden border-1 `}
                            >
                              <img
                                loading="lazy"
                                src={`${image}`}
                                alt=""
                                className="object-contain w-full"
                              />
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>

                  <Separator />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-7" />
        {/* Bottom bar for mobile */}
        <div className="sm:hidden fixed bottom-0 left-0 h-12 border-t-1 w-full bg-background flex items-center gap-4 px-2 z-10 ">
          <div className="flex  gap-2">
            <button onClick={() => router.push("/cart")}></button>
            <LuShoppingCart className="text-muted text-2xl" />
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

        {/* Prdouct further details (left side) */}
        <div className="space-y-5">
          {/* Related items */}
          <div>
            <section className="w-full space-y-5">
              <h1 className="text-2xl font-bold ">Related Items</h1>
              <ListProd size="small" limit={12} />
            </section>
          </div>

          {/* Tabs */}
          <div className="space-y-3">
            {/* Nav bar for pc */}
            <nav
              className="hidden sm:flex items-center bg-background sm:mt-5 sticky z-40 h-10  "
              style={{
                top: ` </span>
                    ${headerHeight}px`,
              }}
            >
              <ul className="flex gap-4 text-muted cursor-pointer mx-5 sm:mx-0 text-sm">
                {sections.map(({ name }, i) => {
                  return name == activeTab ? (
                    <li
                      key={i}
                      className="flex items-center text-black font-bold "
                    >
                      <FaLocationDot size={15} />
                      {name}
                    </li>
                  ) : (
                    <li
                      key={i}
                      onClick={() => handleTabClick(name)}
                      className="hover:text-secondary transition-colors"
                    >
                      {name}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Reviews */}
            <ProductReviewSection ref={reviewsRef} product={product} />

            <Separator className="my-4" />

            {/* Specefications */}
            <ProductSpeceficationsSection
              ref={specificationsRef}
              product={product}
            />

            <Separator className="my-4" />

            {/* About Store Section */}
            <section
              ref={storeRef}
              className="w-full flex flex-col py-2 px-3 sm:px-0 bg-background space-y-2"
            >
              {/* Header */}
              <div className="flex gap-1 items-center justify-between ">
                <h1 className="text-2xl sm:text-xl font-bold">About Store</h1>
                <FaAngleRight className="text-muted " size={12} />
              </div>

              {/* Store Content */}
              <div className="w-full bg-gray-100 p-4">
                <p>There doesn't Exist data about this store</p>
              </div>
            </section>

            <Separator className="my-4" />
          </div>
        </div>

        {/* Tabs for pc */}
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
