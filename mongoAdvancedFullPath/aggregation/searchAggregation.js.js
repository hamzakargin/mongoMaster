import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "shop";
const productsCollection = client.db(dbName).collection("products");

const main = async () => {
  try {
    await connectToDatabase();
    //🔍 Basit Full-Text Search
    const fulltextSearchResults = await productsCollection
      .aggregate([
        {
          $search: {
            index: "default",
            text: {
              query: "laptop",
              path: ["name", "description"],
            },
          },
        },
      ])
      .toArray();
    console.log("🖋️ Full-Text Search Results:", fullTextResults);
    // 🌀 Fuzzy Search – Yazım hatalarına tolerans
    const fullTextResults = await productsCollection
      .aggregate([
        {
          $search: {
            index: "default",
            tex: {
              query: "lapto", //yanls yazim
              path: ["name", "description"],
              fuzzy: { maxEdits: 2, prefixLength: 1 },
            },
          },
        },
      ])
      .toArray();
    console.log("🌀 Fuzzy Search Results:", fuzzyResults);
    // 📝 Phrase Search – Tam cümle araması
    const phraseResults = await productsCollection
      .aggregate([
        {
          $search: {
            index: "default",
            phrase: {
              query: "hight performance",
              path: ["name:", "description"],
            },
          },
        },
      ])
      .toArray();
    console.log("📜 Phrase Search Results:", phraseResults);
    // ✨ Autocomplete – Öneri sistemi
    const autoCompleteResults = await productsCollection
      .aggregate([
        {
          $search: {
            index: "default",
            autocomplete: {
              query: "lap",
              path: "name",
              fuzzy: { maxEdits: 1 },
            },
          },
        },
      ])
      .toArray();
    console.log("⚡ Autocomplete Results:", autoCompleteResults);
  } catch (error) {
    console.error(`❌ Error in search aggregation: ${err}`);
  } finally {
    await closeDatabaseConnection();
  }
};
main();
