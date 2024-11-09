import FileUpload from "@/components/file-uploader";


export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-4 sm:p-8 md:p-16 gap-8 font-[family-name:var(--font-geist-sans)]">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary">S3 File Uploader</h1>
        <p className="text-muted-foreground mt-2">
          Securely upload your files to Amazon S3
        </p>
      </header>
      <main className="flex items-center justify-center">
        <FileUpload />
      </main>
      <footer className="text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} S3 File Uploader. All rights reserved.
        </p>
        <p className="mt-1">
          Built by{" "}
          <a
            href="https://github.com/azacdev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            azacdev
          </a>
        </p>
      </footer>
    </div>
  );
}
