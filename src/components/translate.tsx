import { useEffect, useState } from "react";
import axios from "axios";

async function translateText(text: string, targetLang: string) {
  const res = await axios.post("https://libretranslate.com/translate", {
    q: text,
    source: "en",
    target: targetLang,
    format: "text",
  });
  return res.data.translatedText;
}

export function t({ children, lang }: { children: string, lang: string }) {
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    if (lang !== "en") {
      translateText(children, lang).then(setTranslated).catch(() => setTranslated(children));
    } else {
      setTranslated(children);
    }
  }, [children, lang]);

  return <>{translated}</>;
}
