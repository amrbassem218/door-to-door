import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Header from "@/components/header/Header";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { file, z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DragDropUploader } from "@/components/ui/dragDroupUpLoader";
import { supabase } from "@/supabase/supabaseClient";

interface IAddProductProps {}
export const schema = z.object({
  createdAt: z.string(),
  description: z.string().nullable(),
  specifications: z.string().nullable(),
  discount: z.number(),
  displayName: z.string().nullable(),
  id: z.number(),
  minOrder: z.number().nullable(),
  name: z.string(),
  price: z.number().nullable(),
  priceAfter: z.number().nullable(),
  rating: z.number().nullable(),
  reviewCount: z.number().nullable(),
  seller: z.string().nullable(),
  sellerId: z.number().nullable(),
  stockCount: z.number().nullable(),
  subCategory: z.number().nullable(),
  tags: z.array(z.string()).nullable(),
});
type zodSchema = z.infer<typeof schema>;
// const R2_ACCOUNT_ID = process.env.
const AddProduct: React.FunctionComponent<IAddProductProps> = (props) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const form = useForm<zodSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      createdAt: "",
      description: "",
      discount: 20,
      displayName: "",
      id: 0,
      minOrder: 20,
      name: "",
      price: 400,
      rating: 1,
      reviewCount: 0,
      seller: "Lorem ipsum dolor sit.",
      sellerId: 2,
      specifications: "",
      stockCount: 200,
      subCategory: null,
      tags: [],
      priceAfter: null,
    },
  });

  async function uploadToR2(file: File, folder: string) {
    // Generate filename once to ensure consistency
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}-${file.name}`;

    // 1. Ask edge function for a signed URL
    const res = await fetch(
      `https://tlzmbkutwmlixjwnkylg.functions.supabase.co/r2-upload-url?filename=${filename}`
    );

    if (!res.ok) {
      throw new Error(`Failed to get upload URL: ${res.statusText}`);
    }

    const { url } = await res.json();

    // 2. Upload file directly to R2
    const uploadRes = await fetch(url, {
      method: "PUT",
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload file: ${uploadRes.statusText}`);
    }

    // 3. Construct public URL (using the same filename)
    return `https://pub-8af98dd80060441abb806f8778b58c40.r2.dev/${filename}`;
  }

  const handleCreateProductSubmit = async (values: zodSchema) => {
    try {
      console.log("Form submitted with values:", values);
      console.log("Thumbnail file:", thumbnail);
      console.log("Images files:", images);

      let thumbnailUrl: string | null = null;
      if (thumbnail) {
        console.log("Uploading thumbnail...");
        thumbnailUrl = await uploadToR2(thumbnail, "thumbnails");
        console.log("Thumbnail URL:", thumbnailUrl);
      }

      let imageUrls: string[] = [];
      if (images && images.length > 0) {
        console.log("Uploading images...");
        for (const file of images) {
          const url = await uploadToR2(file, "gallery");
          imageUrls.push(url);
          console.log("Image URL:", url);
        }
      }

      console.log("Final thumbnail URL:", thumbnailUrl);
      console.log("Final image URLs:", imageUrls);

      const productData = {
        created_at: new Date().toISOString(),
        description: values.description,
        discount:
          (((values.price ?? 0) - (values.priceAfter ?? 0)) /
            (values.price == 0 ? 1 : values.price ?? 1)) *
          100,
        display_name: values.displayName,
        images: imageUrls.length > 0 ? imageUrls : null,
        min_order: values.minOrder,
        name: values.name,
        price: values.price,
        price_after: values.priceAfter,
        rating: values.rating,
        review_count: values.reviewCount,
        seller: values.seller,
        seller_id: values.sellerId,
        specifications: values.specifications,
        stock_count: values.stockCount,
        sub_category: values.subCategory,
        tags: values.tags && values.tags.length > 0 ? values.tags : null,
        thumbnail: thumbnailUrl,
      };

      console.log("Product data to insert:", productData);

      const { error } = await supabase.from("products").insert([productData]);

      if (error) throw error;

      alert("✅ Product created successfully!");
      form.reset();
      setImages([]);
      setThumbnail(null);
    } catch (err: any) {
      console.error("❌ Error creating product:", err.message);
      alert("❌ Failed to create product: " + err.message);
    }
  };
  return (
    <div className="w-full h-full">
      <div className="w-full flex justify-center items-center">
        <Card className="w-150 my-20 border-border">
          <CardHeader>
            <CardTitle className="text-xl">Add New Product</CardTitle>
            <CardDescription>
              Fill in the details below to add a product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateProductSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter product name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          {...field}
                          className="resize-none overflow-auto h-20"
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specification</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product specifcations"
                          {...field}
                          className="resize-none overflow-auto h-20"
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter product price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceAfter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price After Discount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter product price After discount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter discount"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

                <FormField
                  control={form.control}
                  name="stockCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter stock count"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder='["weaving manufacturing", "cloth", "towels"]'
                          value={
                            Array.isArray(field.value)
                              ? JSON.stringify(field.value)
                              : field.value || ""
                          }
                          onChange={(e) => {
                            const inputValue = e.target.value.trim();

                            if (inputValue === "") {
                              field.onChange([]);
                              return;
                            }

                            try {
                              // Try to parse as JSON array
                              const parsed = JSON.parse(inputValue);
                              if (Array.isArray(parsed)) {
                                field.onChange(parsed);
                              } else {
                                // If it's not an array, wrap it in an array
                                field.onChange([parsed]);
                              }
                            } catch (error) {
                              // If JSON parsing fails, treat as comma-separated values
                              const tagsArray = inputValue
                                .split(",")
                                .map((tag) =>
                                  tag.trim().replace(/^["']|["']$/g, "")
                                ) // Remove quotes
                                .filter((tag) => tag.length > 0);
                              field.onChange(tagsArray);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter as JSON array: ["tag1", "tag2"] or
                        comma-separated: tag1, tag2
                        <br />
                        Current: {JSON.stringify(field.value || [])}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="weaving manufacturing, cloth, towels"
                      value={
                        Array.isArray(field.value) 
                          ? field.value.join(", ") 
                          : field.value || ""
                      }
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        
                        if (inputValue.trim() === "") {
                          field.onChange([]);
                        } else {
                          // Simple comma split and trim
                          const tagsArray = inputValue
                            .split(",")
                            .map(tag => tag.trim())
                            .filter(tag => tag.length > 0);
                          field.onChange(tagsArray);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter tags separated by commas (no quotes needed)
                    <br />
                    Result: {JSON.stringify(field.value || [])}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
                <div className="space-y-6">
                  <DragDropUploader
                    label="Upload Thumbnail"
                    multiple={false}
                    onFiles={(files) => setThumbnail(files[0])}
                  />

                  <DragDropUploader
                    label="Upload Gallery Images"
                    multiple={true}
                    onFiles={(files) =>
                      setImages((prev) => [...prev, ...files])
                    }
                  />

                  <div className="grid grid-cols-4 gap-4">
                    {thumbnail && (
                      <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Thumbnail preview"
                        className="rounded-md w-full h-32 object-cover"
                      />
                    )}
                    {images.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${i}`}
                        className="rounded-md w-full h-32 object-cover"
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Add Product
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
