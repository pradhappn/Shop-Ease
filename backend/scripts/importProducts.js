
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import products from "../products-manifest.json" with { type: "json" };

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: [path.resolve(scriptDir, "../.env"), path.resolve(scriptDir, "../../.env")],
});

async function importProducts() {
  let mongoUri = (process.env.MONGODB_URI || process.env.MONGO_URI)
    ?.trim()
    .replace(/^(["'])(.*)\1$/, "$2");

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Check your .env file.");
  }

  if (/\{[^}]+\}/.test(mongoUri)) {
    throw new Error(
      "MONGO_URI contains a placeholder. Replace {mongodb_connection_string} in your .env file with your actual MongoDB connection string."
    );
  }

  // Accept a host-style value such as localhost:27017/db and add its scheme.
  if (!/^[a-z][a-z\d+.-]*:\/\//i.test(mongoUri)) {
    mongoUri = `mongodb://${mongoUri}`;
  }

  if (!/^mongodb(?:\+srv)?:\/\//i.test(mongoUri)) {
    throw new Error('MONGO_URI must use "mongodb://" or "mongodb+srv://". Check your .env value.');
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB.");

  let created = 0;
  let updated = 0;

  for (const productData of products) {
    const existing = await Product.findOne({
      name: productData.name,
    });

    if (existing) {
      await Product.updateOne(
        { _id: existing._id },
        { $set: productData }
      );

      updated++;
      console.log(`Updated: ${productData.name}`);
    } else {
      await Product.create(productData);

      created++;
      console.log(`Created: ${productData.name}`);
    }
  }

  console.log("\nImport complete!");
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log("Other existing products were left untouched.");
}

try {
  await importProducts();
} catch (error) {
  console.error("Product import failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
