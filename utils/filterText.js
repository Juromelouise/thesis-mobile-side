import * as filipinoBarwords from "filipino-badwords-list";
import { Filter } from "bad-words";

export const filterText = (text, role) => {
  try {
    console.log("Filtering text:", text, "for role:", role);
    const filter = new Filter({ list: filipinoBarwords.array });
    if (typeof text === "string" && role === "user") {
      return filter.clean(text);
    } else {
      return text;
    }
  } catch (error) {
    console.error("Error filtering text:", error);
    return text;
  }
};