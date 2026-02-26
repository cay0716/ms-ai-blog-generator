import { GeneratedContent } from "@/types/generate";

interface ResultBtnsProps {
  result: GeneratedContent;
  markdown: string;
}

export default function ResultBtns({ result, markdown }: ResultBtnsProps) {

  const handleCopy = async () => {
    if (!markdown) return;

    await navigator.clipboard.writeText(markdown);
    alert("복사 완료!");
  };

  const handleDownloadMarkdown = () => {
    if (!markdown) return;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title}.md`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    if (!markdown) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${result.title}</title>
</head>
<body>
${markdown}
</body>
</html>
`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title}.html`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 w-full font-semibold">
      <button
        onClick={handleCopy}
        className="w-full px-3 py-1 border rounded border hover:bg-gray-300 dark:bg-neutral-900 dark:hover:bg-neutral-950"
      >
        복사
      </button>

      <button
        onClick={handleDownloadMarkdown}
        className="min-w-20 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-800"
      >
        .md<br />저장
      </button>

      <button
        onClick={handleDownloadHTML}
        className="min-w-20 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-800"
      >
        .html<br />저장
      </button>
    </div>
  );
}