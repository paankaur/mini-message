import path from "path";
import fs from "fs/promises";
import { fileURLToPath, pathToFileURL } from "url";
import sequelize from "../util/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};
const excludedFiles = ["index.js"];

const loadModels = async () => {
  if (Object.keys(models).length) {
    return models;
  }

  try {
    const files = await fs.readdir(__dirname);

    for (const fileName of files) {
      if (!excludedFiles.includes(fileName) && fileName.endsWith(".js")) {
        const modelPath = path.join(__dirname, fileName);

        const fileUrl = pathToFileURL(modelPath).href;

        const module = await import(fileUrl);
        const modelFile = module.default;

        if (modelFile && typeof modelFile.getTableName === "function") {
          models[modelFile.name] = modelFile;
        }
      }
    }
    Object.values(models).forEach((model) => {
      if (typeof model.associate === "function") {
        model.associate(models);
      }
    });
    models.sequelize = sequelize;
  } catch (error) {
    console.error("Error loading models:", error);
  }

  return models;
};

export default loadModels;
