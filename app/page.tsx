"use client";


import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useForm } from 'react-hook-form';
import { z } from 'zod';



Amplify.configure(outputs);

const client = generateClient<Schema>();

const productFormSchema = z.object({
  name: z.string(),
  price: z.number(),
  brand: z.string(),
})

type ProductForm = z.infer<typeof productFormSchema>

export default function App() {
  const [products, setProducts] = useState<Array<Schema["Product"]["type"]>>([]);

  const form = useForm<ProductForm>({
    defaultValues: {
      name: "",
      price: 0,
      brand: "",
    }
  })

  function listProducts() {
    client.models.Product.observeQuery().subscribe({
      next: (data) => setProducts([...data.items]),
    });
  }


  function deleteProduct(id: string) {
    client.models.Product.delete({ id })
  }

  useEffect(() => {
    listProducts();
  }, []);


  function createProduct() {
    client.models.Product.create({
      name: "BG-65",
      price: 120000,
      brand: "Yonex",
    });
  }

  function onSubmit(data: ProductForm) {
    client.models.Product.create(data)
  }

  return (

    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>My product</h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input {...form.register("name")} />
            <input {...form.register("price")} />
            <input {...form.register("brand")} />
            <button type="submit">Create Product</button>
          </form>
          <ul>
            {products.map((product) => (
              <li
                onClick={() => deleteProduct(product.id)}
                key={product.id}>{product.name} - {product.brand}</li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new product
            <br />
            <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
              Review next steps of this tutorial.
            </a>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>)}
    </Authenticator>
  );
}
