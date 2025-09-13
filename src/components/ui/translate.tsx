import { useTranslate } from "@/utilities";
import { useState, useEffect } from "react";
function T({ t,}: { t: string;}) {
  const translate = useTranslate();
  const [translated, setTranslated] = useState<string>(t);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await translate(t);
      if (active) setTranslated(result);
    })();
    return () => { active = false };
  }, [t, translate]);

  return <>{translated}</>;
}

export default T;