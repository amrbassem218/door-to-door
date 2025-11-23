"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DragDropUploader } from "@/components/ui/dragDroupUpLoader";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/supabase/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";
// TODO: Add minimum order Field
interface IAddProductProps {}
export const schema = z.object({
  name: z.string().min(20).max(200),
  description: z.string().min(1),
  specifications: z.string().min(1).nullable(),
  minOrder: z.number().min(1).nullable(),
  priceBefore: z.number().min(0),
  priceAfter: z.number().min(0).nullable(),
  stockCount: z.number().min(1),
  tags: z.array(z.string().min(1).max(100)).min(2, "Product must contain at least 2 tags"),
  thumbnail: z.instanceof(File).nullable(),
  gallery: z.array(z.instanceof(File).nullable()).nullable(),
});
type zodSchema = z.infer<typeof schema>;
// const R2_ACCOUNT_ID = process.env.
const AddProduct: React.FunctionComponent<IAddProductProps> = (props) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const FamousTags = [
    "Vegetables",
    "Fruits",
    "T-shirts",
    "Sweaters",
    "Pots",
    "Carpet",
    "Pottery",
    "Jewelry",
    "antique",
    "Fresh",
    "Frozen",
    "Furniture",
    "Chair",
  ];
  const form = useForm<zodSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      specifications: "",
      minOrder: 1,
      priceBefore: 0,
      priceAfter: 0,
      stockCount: 1,
      tags: [],
      thumbnail: null,
      gallery: null,
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

      const imageUrls: string[] = [];
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
          (((values.priceBefore ?? 0) - (values.priceAfter ?? 0)) /
            (values.priceBefore == 0 ? 1 : values.priceBefore ?? 1)) *
          100,
        // display_name: values.displayName,
        min_order: values.minOrder,
        name: values.name,
        price_before: values.priceBefore,
        price_after: values.priceAfter ? values.priceAfter : values.priceBefore,
        specifications: values.specifications,
        stock_count: values.stockCount,
        tags: values.tags,
        thumbnail: thumbnailUrl,
        gallery: imageUrls.length > 0 ? imageUrls : null,
      };

      console.log("Product data to insert:", productData);

      const { error } = await supabase.from("products").insert([productData]);

      if (error) throw error;

      // alert("✅ Product created successfully!");
      toast.success("Product created successfully!");
      form.reset();
      setImages([]);
      setThumbnail(null);
    } catch (err: any) {
      console.error("Error creating product:", err.message);
      toast.error(`Failed to create product: ${err.message}`);
    }
  };

  const handleTagClick = (tag: string) => {
    let tags = form.getValues("tags");
    if (tags.includes(tag)) {
      toast.error("Tag already included", {
        description:
          "The tag you tried to add is already included for this product",
      });
    } else {
      tags.push(tag);
      form.setValue("tags", tags);
    }
  };

  const handleNumberFieldMin = (
    name: string,
    onChange: (num: number) => void,
    inp: string,
    minNumber?: number
  ) => {
    let num = parseInt(inp);
    let isLessThanMin = false
    if (minNumber) {
      if (num < minNumber) {
        num = minNumber;
        form.setError(name as any, {
          type: "manual",
          message: `${name} must be at least ${minNumber ?? 0}`,
        });
        isLessThanMin = true;
      }
    } else {
      if (num < 0) {
        num = 0;
        form.setError(name as any, {
          type: "manual",
          message: `${name} must be positive`,
        });
        isLessThanMin = true;
      }
    }
    if(!isLessThanMin){
      form.clearErrors(name as any);
    }
    if (typeof onChange == "function") {
      onChange(num);
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
            <form
              onSubmit={form.handleSubmit(handleCreateProductSubmit)}
              className="space-y-3"
            >
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel>Product Name</FieldLabel>
                        <FieldDescription>
                          Enter the name in full details. This will help appear
                          more on search results
                        </FieldDescription>
                      </FieldContent>
                      <Input
                        type="text"
                        placeholder="Enter product name"
                        className="border border-border"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel>Description</FieldLabel>
                      </FieldContent>
                      <Textarea
                        placeholder="Enter product description"
                        {...field}
                        className="resize-none overflow-auto h-20 border border-border"
                        value={field.value ?? ""}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="specifications"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Specification</FieldLabel>
                      <Textarea
                        placeholder="Enter product specifcations"
                        {...field}
                        className="resize-none overflow-auto h-20 border border-border"
                        value={field.value ?? ""}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    </Field>
                  )}
                />
                <FieldGroup className="grid grid-cols-12">
                  <Controller
                    control={form.control}
                    name="priceBefore"
                    render={({ field, fieldState }) => (
                      <Field className="col-span-6">
                        <FieldLabel>Price Before Discount</FieldLabel>
                        <Input
                          type="number"
                          placeholder="Enter product price before the discount"
                          {...field}
                          className="border border-border"
                          onChange={(e) =>
                            handleNumberFieldMin(
                              field.name,
                              field.onChange,
                              e.target.value
                            )
                          }
                          value={field.value ?? ""}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError
                          errors={[{ message: fieldState.error?.message }]}
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="priceAfter"
                    render={({ field, fieldState }) => (
                      <Field className="col-span-6">
                        <FieldLabel>
                          Price After Discount{" "}
                          <span className="text-sm text-text/60">
                            (optional)
                          </span>
                        </FieldLabel>
                        <Input
                          type="number"
                          placeholder="Enter product price After discount"
                          {...field}
                          className="border border-border"
                          onChange={(e) =>
                            handleNumberFieldMin(
                              field.name,
                              field.onChange,
                              e.target.value
                            )
                          }
                          value={field.value ?? ""}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError
                          errors={[{ message: fieldState.error?.message }]}
                        />
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldGroup>
              <Controller
                control={form.control}
                name="stockCount"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Stock Count</FieldLabel>
                    <Input
                      type="number"
                      placeholder="Enter stock count"
                      {...field}
                      className="border border-border"
                      onChange={(e) =>
                        handleNumberFieldMin(
                          field.name,
                          field.onChange,
                          e.target.value
                        )
                      }
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError
                      errors={[{ message: fieldState.error?.message }]}
                    />
                  </Field>
                )}
              />
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="tags"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Tags</FieldLabel>
                      {/* Suggestions */}
                      <div className="space-x-1 space-y-1 ">
                        {FamousTags.map((tag, i) => (
                          <Button
                            variant={"outline"}
                            className="text-sm"
                            key={i}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                            <FaPlus className="scale-50" />
                          </Button>
                        ))}
                      </div>
                      <FieldDescription>
                        Enter all tags related to the product. This will improve
                        the chances of exposure.
                      </FieldDescription>

                      <Input
                        type="text"
                        placeholder='"weaving manufacturing", "cloth", "towels"'
                        className="border border-border"
                        {...field}
                        value={field.value.join(", ")}
                        onChange={(e) =>
                          form.setValue("tags", e.target.value.split(", "))
                        }
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="space-y-6">
                <DragDropUploader
                  label="Upload Thumbnail"
                  multiple={false}
                  onFiles={(files) => setThumbnail(files[0])}
                />

                <DragDropUploader
                  label="Upload Gallery Images"
                  multiple={true}
                  onFiles={(files) => setImages((prev) => [...prev, ...files])}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
