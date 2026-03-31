#!/usr/bin/env node

/**
 * Reset the project to a blank app directory.
 * Existing app starter directories can be moved to /app-example or deleted.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log("Created /" + exampleDir + " directory.");
    }

    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log("Moved /" + dir + " to /" + exampleDir + "/" + dir + ".");
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log("Deleted /" + dir + ".");
        }
      } else {
        console.log("/" + dir + " does not exist, skipping.");
      }
    }

    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("Created new /app directory.");

    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("Created app/index.tsx.");

    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("Created app/_layout.tsx.");

    console.log("Project reset complete.");
    console.log("1. Run `npx expo start`.");
    console.log("2. Edit app/index.tsx.");
    if (userInput === "y") {
      console.log("3. Remove /" + exampleDir + " when you no longer need it.");
    }
  } catch (error) {
    console.error("Error during script execution: " + error.message);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
