import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "./CodeBlock";
import type { PaletteResult } from "@/lib/colorExtractor";

interface Props {
  result: PaletteResult;
}

export default function PaletteOutputTabs({ result }: Props) {
  const jsonOutput = JSON.stringify({ palette: result.palette, mood: result.mood, accessibility: result.accessibility }, null, 2);

  return (
    <Tabs defaultValue="config" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
        <TabsTrigger value="config" className="font-mono text-xs">tailwind.config</TabsTrigger>
        <TabsTrigger value="css" className="font-mono text-xs">CSS Variables</TabsTrigger>
        <TabsTrigger value="snippets" className="font-mono text-xs">Snippets</TabsTrigger>
        <TabsTrigger value="json" className="font-mono text-xs">Raw JSON</TabsTrigger>
      </TabsList>
      <TabsContent value="config" className="mt-4">
        <CodeBlock code={result.tailwindConfig} language="javascript" filename="tailwind.config.js" />
      </TabsContent>
      <TabsContent value="css" className="mt-4">
        <CodeBlock code={result.cssVariables} language="css" filename="palette.css" />
      </TabsContent>
      <TabsContent value="snippets" className="mt-4">
        <CodeBlock code={result.snippets} language="html" filename="snippets.html" />
      </TabsContent>
      <TabsContent value="json" className="mt-4">
        <CodeBlock code={jsonOutput} language="json" filename="palette.json" />
      </TabsContent>
    </Tabs>
  );
}
