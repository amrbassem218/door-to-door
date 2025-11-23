import Hero from "@/components/home/hero";
import ListProd from "@/components/home/ListProds";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import "../App.css";
export function generateStaticParams() {
  return [{ slug: [""] }];
}

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  // const [topSellingSeeMore, setTopSellingSeeMore] = useState(false);
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
                <ListProd limit={2} size="large" />
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
                <ListProd limit={2} size="large" />
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
                <ListProd limit={2} size="large" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* More to love */}
        <section className="space-y-7">
          <h1 className="text-center text-3xl font-bold ">More to love</h1>
          <ListProd size="small" />
        </section>
      </div>
    </div>
  );
};

export default Home;
