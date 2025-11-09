import * as React from "react";
import { useState, useEffect } from "react";
import type { Product } from "@/types/types";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/home/hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Item from "@/components/ui/item";
import { getProducts } from "@/utils/products-utils";
interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const [topSellingSeeMore, setTopSellingSeeMore] = useState(false);
  const [items, setItems] = useState<Product[]>();
  const navigate = useNavigate();
  const limit = 6;

  useEffect(() => {
    const getProd = async () => {
      let prod = await getProducts();
      if (prod) {
        setItems(prod);
      }
    };
    getProd();
  }, []);

  return (
    <div className="mx-auto">
      <div className="mb-10">
        <Hero />
      </div>

      <div className="md:mx-20 mx-5">
        {/* Today's deals */}
        <section className="mb-15 space-y-7">
          <h1 className="text-center text-3xl font-bold">Today's deals</h1>
          <div className="grid grid-cols-12 gap-5">
            {/* Best sellers */}
            <Card className="md:col-span-4 col-span-12 transition-all text-card-foreground">
              <CardHeader>
                <CardTitle className="mx-auto text-2xl font-semibold">
                  Bestsellers
                </CardTitle>
                <CardDescription className="mx-auto">
                  <div className="px-2 w-40 p-1 rounded-md text-center bg-yellow-300">
                    <p className="text-heading">Best price & Quality</p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-2">
                  {items &&
                    items.map((item, i) => {
                      return (
                        (topSellingSeeMore || i < 2) && (
                          <Item
                            item={item}
                            col="md:col-span-6 col-span-12"
                            style="bg-card"
                          />
                        )
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Big save */}
            <Card className="md:col-span-4 col-span-12 transition-all text-card-foreground">
              <CardHeader>
                <CardTitle className="mx-auto text-2xl font-semibold">
                  Big Save
                </CardTitle>
                <CardDescription className="mx-auto">
                  <div className="px-2 w-40 p-1 rounded-md text-center bg-red-300/80">
                    <p className="text-heading">Up to 50% off</p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-2">
                  {items &&
                    items.map((item, i) => {
                      return (
                        (topSellingSeeMore || i < 2) && (
                          <Item
                            item={item}
                            col="md:col-span-6 col-span-12"
                            style="bg-card"
                          />
                        )
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Super deals */}
            <Card className="md:col-span-4 col-span-12 transition-all text-card-foreground">
              <CardHeader>
                <CardTitle className="mx-auto text-2xl font-semibold">
                  SuperDeals
                </CardTitle>
                <CardDescription className="mx-auto">
                  <div className="px-2 w-40 p-1 rounded-md text-center bg-red-300">
                    <p className="text-heading">Up to 75% off</p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-2">
                  {items &&
                    items.map((item, i) => {
                      return (
                        (topSellingSeeMore || i < 2) && (
                          <Item
                            item={item}
                            col="md:col-span-6 col-span-12"
                            style="bg-card"
                          />
                        )
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* More to love */}
        <section className="space-y-7">
          <h1 className="text-center text-3xl font-bold ">More to love</h1>
          <div className="grid grid-cols-12 gap-5">
            {items &&
              items.map((item, i) => (
                <Item item={item} col="sm:col-span-2 col-span-6" />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
