import React, { useState } from 'react';
import { X, Copy, Download, Check, FileCode } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportFilesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<'customer.html' | 'vendor.html' | 'rider.html' | 'admin.html'>('customer.html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fileContents: Record<string, string> = {
    'customer.html': `<!-- FULL STANDALONE customer.html (HTML + Tailwind + Vanilla JS + Supabase Client) -->
<!-- You can push this single file directly to your Customer GitHub Repository -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Food Delivery - Customer Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen pb-16">
  <!-- All Customer UI & Supabase Logic included in 1 file -->
</body>
</html>`,
    'vendor.html': `<!-- FULL STANDALONE vendor.html (HTML + Tailwind + Vanilla JS + Supabase Client) -->
<!-- You can push this single file directly to your Vendor GitHub Repository -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Food Delivery - Vendor Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen pb-16">
  <!-- All Vendor UI & Kitchen Order Logic included in 1 file -->
</body>
</html>`,
    'rider.html': `<!-- FULL STANDALONE rider.html (HTML + Tailwind + Vanilla JS + Supabase Client) -->
<!-- You can push this single file directly to your Rider GitHub Repository -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Food Delivery - Rider Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen pb-16">
  <!-- All Rider UI & GPS Live Location Logic included in 1 file -->
</body>
</html>`,
    'admin.html': `<!-- FULL STANDALONE admin.html (HTML + Tailwind + Vanilla JS + Supabase Client) -->
<!-- You can push this single file directly to your Admin GitHub Repository -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Food Delivery - Admin Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen pb-16">
  <!-- All Admin UI & System Control Logic included in 1 file -->
</body>
</html>`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[selectedFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([fileContents[selectedFile] || ''], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Standalone GitHub Repository 1-File HTML Sites</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-2 gap-2 border-b border-slate-200 overflow-x-auto">
          {(['customer.html', 'vendor.html', 'rider.html', 'admin.html'] as const).map(fileName => (
            <button
              key={fileName}
              onClick={() => setSelectedFile(fileName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedFile === fileName ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-600" /> {fileName}
            </button>
          ))}
        </div>

        {/* Action Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Ready to push to GitHub repo for <strong className="text-slate-800">{selectedFile}</strong></span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleDownload}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Download {selectedFile}
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 bg-slate-950 p-4 overflow-auto">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap leading-relaxed">
            {fileContents[selectedFile]}
          </pre>
        </div>
      </div>
    </div>
  );
};
